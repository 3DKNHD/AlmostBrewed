#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compile every solution and grade it. Does not open windows."""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

os.environ.pop("DISPLAY", None)
os.environ.pop("WAYLAND_DISPLAY", None)

import course
from grade import grade
from runner import compile_and_run, merged_sources

ROOT = course.ROOT
TEXT_SUFFIXES = {".py", ".js", ".css", ".html", ".md", ".java", ".sh"}


def fail(errors, message):
    errors.append(message)
    print("FALLO " + message)


def main():
    errors = []
    meta = course.load_course()
    title = meta["title"]
    slug = meta["slug"]
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in TEXT_SUFFIXES:
            continue
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if title in text or slug in text:
            fail(errors, "el nombre del curso aparece en " + str(path.relative_to(ROOT)))

    seen = []
    for _kind, topic_dir in course.iter_topic_dirs():
        topic = course.topic_meta(topic_dir)
        if not (topic_dir / "guide.md").exists():
            fail(errors, topic_dir.name + " no tiene guide.md")
        example = course.example_files(topic_dir)
        if example:
            result = compile_and_run(example, window=bool(topic.get("exampleWindow")))
            if not result.get("compiled") or (not topic.get("exampleWindow") and not result.get("passed")):
                fail(errors, "ejemplo de " + topic_dir.name + ": " + (result.get("compileLog") or str(result.get("cases"))))
        for exercise_dir in course.exercise_dirs(topic_dir):
            exercise = course.load_exercise(exercise_dir)
            exercise_id = exercise["meta"]["id"]
            seen.append(exercise_id)
            kind = exercise["meta"]["type"]
            if kind == "code":
                result = grade(exercise, {"files": exercise["solution"]})
                if not result.get("passed"):
                    fail(errors, exercise_id + " " + (result.get("compileLog") or str(result.get("cases"))))
            elif kind == "window":
                files = merged_sources(exercise["files"], exercise["fixed"], exercise["solution"])
                result = compile_and_run(files, main=exercise["meta"].get("main"), window=True)
                if not result.get("compiled"):
                    fail(errors, exercise_id + " no compiló: " + result.get("compileLog", ""))
            elif kind == "quiz":
                result = grade(exercise, {"choice": exercise["meta"]["answer"]})
                if not result.get("passed"):
                    fail(errors, exercise_id + " la respuesta marcada no coincide")
            elif kind == "uml":
                result = grade(exercise, {"uml": exercise["checks"]})
                if not result.get("passed"):
                    fail(errors, exercise_id + " el uml de comprobación no pasa: " + str(result.get("notes")))
            else:
                fail(errors, exercise_id + " tipo desconocido")
    duplicates = {item for item in seen if seen.count(item) > 1}
    for item in sorted(duplicates):
        fail(errors, "id repetido " + item)
    if errors:
        print("%s problemas" % len(errors))
        return 1
    print("ok %s ejercicios" % len(seen))
    return 0


if __name__ == "__main__":
    sys.exit(main())
