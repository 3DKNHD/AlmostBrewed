#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Local course server. Standard library only. Listens on the local network."""

import fcntl
import json
import os
import socket
import struct
import sys
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

import course
from grade import grade
from runner import RunnerError, compile_and_run

STATIC = Path(__file__).resolve().parent / "static"
PORT = int(os.environ.get("PORT", "8765"))


def send_json(handler, payload, status=200):
    raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(raw)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(raw)


def read_body(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    if length > 1_000_000:
        raise RunnerError("El envío es demasiado grande.")
    if length <= 0:
        return {}
    raw = handler.rfile.read(length)
    return json.loads(raw.decode("utf-8"))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))

    def do_GET(self):
        path = urlparse(self.path).path
        try:
            if path == "/":
                self.serve_file(STATIC / "index.html", "text/html; charset=utf-8")
            elif path.startswith("/static/"):
                self.serve_static(path[len("/static/"):])
            elif path == "/api/course":
                send_json(self, course.load_course())
            elif path == "/api/outline":
                send_json(self, course.load_outline())
            elif path == "/api/progress":
                send_json(self, course.load_progress())
            elif path.startswith("/api/topic/"):
                topic = course.load_topic(unquote(path[len("/api/topic/"):]))
                if topic is None:
                    send_json(self, {"error": "No existe ese tema."}, 404)
                else:
                    send_json(self, topic)
            else:
                send_json(self, {"error": "No existe esa ruta."}, 404)
        except (OSError, json.JSONDecodeError, RunnerError) as exc:
            send_json(self, {"error": str(exc)}, 500)

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            body = read_body(self)
            if path == "/api/grade":
                self.grade(body)
            elif path == "/api/solution":
                self.solution(body)
            elif path == "/api/example":
                self.example(body)
            elif path == "/api/progress":
                exercise_id = body.get("id")
                if not exercise_id:
                    send_json(self, {"error": "Falta el id."}, 400)
                    return
                send_json(self, course.mark_done(str(exercise_id)))
            else:
                send_json(self, {"error": "No existe esa ruta."}, 404)
        except json.JSONDecodeError:
            send_json(self, {"error": "El envío no es JSON."}, 400)
        except RunnerError as exc:
            send_json(self, {"error": str(exc)}, 400)
        except OSError as exc:
            send_json(self, {"error": str(exc)}, 500)

    def grade(self, body):
        exercise = course.find_exercise(body.get("topic"), body.get("exercise"))
        if exercise is None:
            send_json(self, {"error": "No existe ese ejercicio."}, 404)
            return
        result = grade(exercise, body)
        if result.get("passed") and exercise["meta"]["type"] != "window":
            course.mark_done(exercise["meta"]["id"])
        result["progress"] = course.load_progress()
        send_json(self, result)

    def solution(self, body):
        exercise = course.find_exercise(body.get("topic"), body.get("exercise"))
        if exercise is None:
            send_json(self, {"error": "No existe ese ejercicio."}, 404)
            return
        send_json(self, {"files": exercise["solution"], "explain": exercise["meta"].get("explain", "")})

    def example(self, body):
        topic_dir = course.find_topic_dir(body.get("topic"))
        if topic_dir is None:
            send_json(self, {"error": "No existe ese tema."}, 404)
            return
        files = course.example_files(topic_dir)
        meta = course.topic_meta(topic_dir)
        result = compile_and_run(files, window=bool(meta.get("exampleWindow")))
        send_json(self, result)

    def serve_static(self, name):
        root = STATIC.resolve()
        path = (root / name).resolve()
        if path != root and root not in path.parents:
            send_json(self, {"error": "No existe ese archivo."}, 404)
            return
        if not path.is_file():
            send_json(self, {"error": "No existe ese archivo."}, 404)
            return
        kind = "text/css; charset=utf-8" if path.suffix == ".css" else "text/javascript; charset=utf-8"
        self.serve_file(path, kind)

    def serve_file(self, path, content_type):
        raw = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)


VIRTUAL_IFACES = ("lo", "docker", "br-", "veth", "virbr", "tun", "tap", "wg", "proton", "tailscale", "zt", "ppp")


def virtual_iface(name):
    return name == "lo" or name.startswith(VIRTUAL_IFACES)


def iface_ipv4(name):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        packed = fcntl.ioctl(sock.fileno(), 0x8915, struct.pack("256s", name.encode("utf-8")[:15]))
    except OSError:
        return ""
    finally:
        sock.close()
    return socket.inet_ntoa(packed[20:24])


def default_lan_iface():
    candidates = []
    try:
        lines = open("/proc/net/route", encoding="ascii").read().splitlines()[1:]
    except OSError:
        return ""
    for line in lines:
        parts = line.split()
        if len(parts) < 7 or parts[1] != "00000000" or virtual_iface(parts[0]):
            continue
        candidates.append((int(parts[6]), parts[0]))
    if not candidates:
        return ""
    candidates.sort()
    return candidates[0][1]


def lan_ip():
    preferred = default_lan_iface()
    if preferred:
        ip = iface_ipv4(preferred)
        if ip and not ip.startswith("127."):
            return ip
    try:
        names = os.listdir("/sys/class/net")
    except OSError:
        return ""
    names.sort(key=lambda name: (0 if name.startswith(("w", "e")) else 1, name))
    for name in names:
        if virtual_iface(name):
            continue
        ip = iface_ipv4(name)
        if ip and not ip.startswith(("127.", "169.254.")):
            return ip
    return ""


def lan_urls(port):
    ip = lan_ip()
    if not ip:
        return []
    return ["http://%s:%s/" % (ip, port)]


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    local = "http://127.0.0.1:%s/" % PORT
    print("En este equipo: %s" % local, flush=True)
    for url in lan_urls(PORT):
        print("En la red: %s" % url, flush=True)
    if os.environ.get("NO_BROWSER") != "1":
        threading.Timer(0.4, lambda: webbrowser.open(local)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")


if __name__ == "__main__":
    main()
