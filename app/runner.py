# -*- coding: utf-8 -*-
"""Compile and run student Java in a temp directory."""

import os
import re
import shutil
import signal
import subprocess
import tempfile
import threading
from pathlib import Path

MAIN_RE = re.compile(r"public\s+static\s+void\s+main\s*\(")
CLASS_RE = re.compile(r"public\s+class\s+(\w+)")


class RunnerError(Exception):
    pass


def javac_bin():
    path = shutil.which("javac")
    if not path:
        raise RunnerError("No está javac. Instala un JDK y vuelve a abrir la aplicación.")
    return path


def java_bin():
    path = shutil.which("java")
    if not path:
        raise RunnerError("No está java. Instala un JDK y vuelve a abrir la aplicación.")
    return path


def norm_text(value):
    text = (value or "").replace("\r\n", "\n").replace("\r", "\n")
    lines = text.split("\n")
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(line.rstrip() for line in lines)


def find_main_class(files, preferred=None):
    if preferred:
        return preferred
    for _name, source in files.items():
        if MAIN_RE.search(source):
            match = CLASS_RE.search(source)
            if match:
                return match.group(1)
    return None


def merged_sources(editable, fixed, submitted):
    files = dict(editable)
    if submitted is not None:
        files.update(submitted)
    files.update(fixed)
    return files


def write_sources(directory, files):
    for name, source in files.items():
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*\.java", name):
            raise RunnerError("Nombre de archivo no válido: " + name)
        (directory / name).write_text(source, encoding="utf-8")


def run_process(args, cwd, timeout, stdin=""):
    proc = subprocess.Popen(
        args,
        cwd=str(cwd),
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
        env={**os.environ, "LANG": "C.UTF-8", "LC_ALL": "C.UTF-8"},
    )
    try:
        out, err = proc.communicate(stdin, timeout=timeout)
    except subprocess.TimeoutExpired:
        os.killpg(proc.pid, signal.SIGKILL)
        proc.wait(timeout=2)
        raise RunnerError("El programa tardó demasiado y se detuvo.")
    return proc.returncode, out or "", err or ""


def compile_and_run(files, main=None, cases=None, window=False, timeout=8):
    if not files:
        raise RunnerError("No hay archivos Java para compilar.")
    javac = javac_bin()
    java = java_bin()
    main_class = find_main_class(files, main)
    directory = Path(tempfile.mkdtemp(prefix="curso-java-"))
    keep_directory = False
    try:
        write_sources(directory, files)
        code, _out, err = run_process(
            [javac, "-encoding", "UTF-8", *sorted(files.keys())],
            directory,
            timeout=20,
        )
        if code != 0:
            return {
                "compiled": False,
                "passed": False,
                "compileLog": err.strip(),
                "cases": [],
            }
        if window:
            result = launch_window(java, directory, main_class)
            keep_directory = bool(result.get("launched"))
            return result
        if cases is None:
            if not main_class:
                raise RunnerError("No encuentro el método main.")
            run_code, out, run_err = run_process(
                [java, "-Dfile.encoding=UTF-8", main_class],
                directory,
                timeout=timeout,
            )
            actual = out if out else run_err
            return {
                "compiled": True,
                "passed": run_code == 0,
                "demo": True,
                "compileLog": "",
                "cases": [{
                    "ok": run_code == 0,
                    "expected": "",
                    "actual": actual,
                    "error": run_err.strip(),
                    "files": [],
                }],
            }
        results = []
        passed = True
        for case in cases or [{"stdin": "", "stdout": ""}]:
            if not main_class:
                raise RunnerError("No encuentro el método main.")
            run_code, out, run_err = run_process(
                [java, "-Dfile.encoding=UTF-8", main_class],
                directory,
                timeout=timeout,
                stdin=case.get("stdin", ""),
            )
            actual = out
            if run_code != 0 and not actual:
                actual = run_err
            expected = case.get("stdout", "")
            ok = norm_text(actual) == norm_text(expected) and run_code == 0
            file_report = []
            for filename, expected_file in (case.get("files") or {}).items():
                path = directory / filename
                got = path.read_text(encoding="utf-8") if path.exists() else ""
                file_ok = norm_text(got) == norm_text(expected_file)
                ok = ok and file_ok
                file_report.append({
                    "name": filename,
                    "ok": file_ok,
                    "expected": expected_file,
                    "actual": got if path.exists() else "(el archivo no existe)",
                })
            passed = passed and ok
            results.append({
                "ok": ok,
                "expected": expected,
                "actual": actual,
                "error": run_err.strip(),
                "files": file_report,
            })
        return {"compiled": True, "passed": passed, "compileLog": "", "cases": results}
    finally:
        if not keep_directory:
            shutil.rmtree(directory, ignore_errors=True)


def launch_window(java, directory, main_class):
    if not main_class:
        raise RunnerError("No encuentro el método main de la ventana.")
    if not os.environ.get("DISPLAY") and not os.environ.get("WAYLAND_DISPLAY"):
        return {
            "compiled": True,
            "passed": False,
            "window": True,
            "launched": False,
            "compileLog": "",
            "message": "Compiló. En esta máquina no hay pantalla para abrir la ventana.",
            "cases": [],
        }
    proc = subprocess.Popen(
        [java, "-Dfile.encoding=UTF-8", main_class],
        cwd=str(directory),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
        env={**os.environ, "LANG": "C.UTF-8", "LC_ALL": "C.UTF-8"},
    )
    def cleanup():
        proc.wait()
        shutil.rmtree(directory, ignore_errors=True)

    try:
        _out, err = proc.communicate(timeout=0.6)
        return {
            "compiled": True,
            "passed": False,
            "window": True,
            "launched": False,
            "compileLog": "",
            "message": (err or "La ventana se cerró al instante.").strip(),
            "cases": [],
        }
    except subprocess.TimeoutExpired:
        threading.Thread(target=cleanup, daemon=True).start()
        return {
            "compiled": True,
            "passed": True,
            "window": True,
            "launched": True,
            "compileLog": "",
            "message": "La ventana está abierta en el escritorio. Ciérrala cuando termines.",
            "cases": [],
        }
