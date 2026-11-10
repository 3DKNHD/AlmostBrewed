# -*- coding: utf-8 -*-
"""Grade one exercise without exposing the expected answer beforehand."""

from runner import RunnerError, compile_and_run, merged_sources


RELATION_KINDS = {
    "association",
    "aggregation",
    "composition",
    "generalization",
    "realization",
}


def grade(exercise, body):
    kind = exercise["meta"]["type"]
    if kind == "quiz":
        return grade_quiz(exercise, body)
    if kind == "uml":
        return grade_uml(exercise, body)
    if kind in ("code", "window"):
        return grade_code(exercise, body, window=(kind == "window"))
    raise RunnerError("Tipo de ejercicio desconocido.")


def grade_quiz(exercise, body):
    expected = exercise["meta"].get("answer")
    chosen = body.get("choice")
    ok = chosen == expected
    return {
        "passed": ok,
        "explain": exercise["meta"].get("explain", "") if ok or chosen is not None else "",
    }


def norm_name(value):
    return " ".join(str(value or "").strip().lower().split())


def grade_uml(exercise, body):
    checks = exercise["checks"]
    submitted = body.get("uml") or {}
    got_classes = {norm_name(name) for name in submitted.get("classes", []) if norm_name(name)}
    expected_classes = {norm_name(name) for name in checks.get("classes", [])}
    missing_classes = sorted(expected_classes - got_classes)
    extra_classes = sorted(got_classes - expected_classes)

    def relation_set(items):
        found = set()
        for item in items or []:
            kind = norm_name(item.get("kind"))
            source = norm_name(item.get("from"))
            target = norm_name(item.get("to"))
            if kind not in RELATION_KINDS or not source or not target:
                continue
            found.add((source, target, kind))
        return found

    got_relations = relation_set(submitted.get("relations"))
    expected_relations = relation_set(checks.get("relations"))
    missing_relations = expected_relations - got_relations
    extra_relations = got_relations - expected_relations
    passed = not missing_classes and not extra_classes and not missing_relations and not extra_relations
    notes = []
    if missing_classes:
        notes.append("Faltan clases: " + ", ".join(missing_classes) + ".")
    if extra_classes:
        notes.append("Sobran clases: " + ", ".join(extra_classes) + ".")
    if missing_relations or extra_relations:
        notes.append("Las relaciones no coinciden. Revisa el tipo y cuál clase es el origen.")
    return {"passed": passed, "notes": notes}


def grade_code(exercise, body, window=False):
    submitted = body.get("files")
    files = merged_sources(exercise["files"], exercise["fixed"], submitted)
    result = compile_and_run(
        files,
        main=exercise["meta"].get("main"),
        cases=exercise["checks"].get("cases"),
        window=window,
    )
    if window and result.get("launched"):
        result["steps"] = exercise["checks"].get("steps", [])
    return result
