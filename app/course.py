# -*- coding: utf-8 -*-
"""Load topics and exercises from folders. No central registry."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
DATA = ROOT / "data"
PROGRESS = DATA / "progress.json"

TOPIC_ROOTS = (
    ("topics", CONTENT / "topics"),
    ("exams", CONTENT / "exams"),
)
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
CLASS_RE = re.compile(r"public\s+class\s+(\w+)")


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_course():
    return read_json(CONTENT / "course.json")


def load_progress():
    if not PROGRESS.exists():
        return {"done": []}
    data = read_json(PROGRESS)
    data.setdefault("done", [])
    return data


def save_progress(data):
    DATA.mkdir(exist_ok=True)
    PROGRESS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def mark_done(exercise_id):
    data = load_progress()
    if exercise_id not in data["done"]:
        data["done"].append(exercise_id)
        save_progress(data)
    return data


def detect_class(source):
    match = CLASS_RE.search(source)
    return match.group(1) if match else None


def java_files(directory):
    if not directory.is_dir():
        return {}
    return {path.name: path.read_text(encoding="utf-8") for path in sorted(directory.glob("*.java"))}


def editable_files(exercise_dir, meta):
    folder = exercise_dir / "starter"
    if folder.is_dir():
        return java_files(folder)
    starter = exercise_dir / "starter.java"
    if not starter.exists():
        return {}
    text = starter.read_text(encoding="utf-8")
    class_name = meta.get("main") or detect_class(text) or "Main"
    return {class_name + ".java": text}


def solution_files(exercise_dir, meta):
    folder = exercise_dir / "solution"
    if folder.is_dir():
        return java_files(folder)
    solution = exercise_dir / "solution.java"
    if not solution.exists():
        return {}
    text = solution.read_text(encoding="utf-8")
    class_name = meta.get("main") or detect_class(text) or "Main"
    return {class_name + ".java": text}


def fixed_files(exercise_dir):
    return java_files(exercise_dir / "fixed")


def example_files(topic_dir):
    return java_files(topic_dir / "example")


def iter_topic_dirs():
    for kind, root in TOPIC_ROOTS:
        if not root.is_dir():
            continue
        for topic_dir in sorted(path for path in root.iterdir() if path.is_dir()):
            if ID_RE.match(topic_dir.name):
                yield kind, topic_dir


def topic_meta(topic_dir):
    meta = read_json(topic_dir / "topic.json")
    meta["folder"] = topic_dir.name
    return meta


def exercise_dirs(topic_dir):
    root = topic_dir / "exercises"
    if not root.is_dir():
        return []
    return [path for path in sorted(root.iterdir()) if path.is_dir() and ID_RE.match(path.name)]


def load_exercise(exercise_dir):
    meta = read_json(exercise_dir / "exercise.json")
    statement_path = exercise_dir / "statement.md"
    statement = statement_path.read_text(encoding="utf-8") if statement_path.exists() else ""
    checks_path = exercise_dir / "checks.json"
    checks = read_json(checks_path) if checks_path.exists() else {}
    return {
        "folder": exercise_dir.name,
        "meta": meta,
        "statement": statement,
        "checks": checks,
        "files": editable_files(exercise_dir, meta),
        "solution": solution_files(exercise_dir, meta),
        "fixed": fixed_files(exercise_dir),
        "dir": exercise_dir,
    }


def find_topic_dir(topic_id):
    if not ID_RE.match(topic_id or ""):
        return None
    for _kind, topic_dir in iter_topic_dirs():
        if topic_dir.name == topic_id:
            return topic_dir
    return None


def find_exercise(topic_id, exercise_folder):
    topic_dir = find_topic_dir(topic_id)
    if topic_dir is None or not ID_RE.match(exercise_folder or ""):
        return None
    exercise_dir = topic_dir / "exercises" / exercise_folder
    if not exercise_dir.is_dir():
        return None
    return load_exercise(exercise_dir)


def public_exercise(exercise):
    meta = exercise["meta"]
    payload = {
        "folder": exercise["folder"],
        "id": meta["id"],
        "title": meta["title"],
        "type": meta["type"],
        "statement": exercise["statement"],
        "main": meta.get("main"),
        "files": exercise["files"],
        "question": meta.get("question"),
        "choices": meta.get("choices"),
        "steps": exercise["checks"].get("steps"),
    }
    return payload


def load_topic(topic_id):
    topic_dir = find_topic_dir(topic_id)
    if topic_dir is None:
        return None
    meta = topic_meta(topic_dir)
    guide_path = topic_dir / "guide.md"
    guide = guide_path.read_text(encoding="utf-8") if guide_path.exists() else ""
    exercises = [public_exercise(load_exercise(path)) for path in exercise_dirs(topic_dir)]
    return {
        "folder": topic_dir.name,
        "title": meta["title"],
        "summary": meta.get("summary", ""),
        "track": meta.get("track", "cero"),
        "objectives": meta.get("objectives", []),
        "guide": guide,
        "example": sorted(example_files(topic_dir).keys()),
        "exampleWindow": bool(meta.get("exampleWindow")),
        "exercises": exercises,
    }


def load_outline(progress=None):
    done = set((progress or load_progress()).get("done", []))
    course = load_course()
    grouped = {track["id"]: [] for track in course.get("tracks", [])}
    for _kind, topic_dir in iter_topic_dirs():
        meta = topic_meta(topic_dir)
        exercises = []
        for exercise_dir in exercise_dirs(topic_dir):
            exercise = load_exercise(exercise_dir)
            exercises.append(exercise["meta"]["id"])
        finished = sum(1 for exercise_id in exercises if exercise_id in done)
        item = {
            "folder": topic_dir.name,
            "title": meta["title"],
            "summary": meta.get("summary", ""),
            "track": meta.get("track", "cero"),
            "total": len(exercises),
            "done": finished,
        }
        grouped.setdefault(item["track"], []).append(item)
    tracks = []
    for track in course.get("tracks", []):
        topics = grouped.get(track["id"], [])
        if topics:
            tracks.append({"id": track["id"], "title": track["title"], "topics": topics})
    return {"tracks": tracks}
