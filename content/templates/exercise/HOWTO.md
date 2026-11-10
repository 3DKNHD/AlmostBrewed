# Cómo añadir un ejercicio

Copia esta carpeta dentro de `content/topics/<tema>/exercises/` o de `content/exams/<examen>/exercises/` y cámbiale el nombre. El nombre lleva un número delante para ordenarlo, por ejemplo `04-vocales`. Tiene que ser minúsculas, números y guiones.

La aplicación no tiene una lista de ejercicios. Al arrancar lee las carpetas.

## Código de consola

- `exercise.json` con `id`, `title`, `type` = `code` y `main` (la clase que tiene `main`).
- `statement.md` con el enunciado.
- `starter.java` con lo que ve el estudiante. La clase pública debe llamarse como `main`.
- `solution.java` con la solución.
- `checks.json` con `cases`. Cada caso tiene `stdin`, `stdout` y, si hace falta, `files`.

Si hay varias clases, no uses `starter.java`. Crea `starter/Libro.java`, `solution/Libro.java` y las demás. Los archivos de `fixed/` se compilan siempre y no salen en el editor. Sirven para el programa de prueba.

## Pregunta

En `exercise.json`: `type` = `quiz`, `question`, `choices` y `answer` (índice desde 0). `explain` se muestra después de responder. `statement.md` puede repetir la pregunta o dar contexto.

## Diagrama

`type` = `uml`. El enunciado va en `statement.md`. `checks.json` lleva `classes` y `relations`. Cada relación tiene `from`, `to` y `kind`: `association`, `aggregation`, `composition`, `generalization` o `realization`. En generalización y realización, `from` es la clase general o la interfaz.

## Ventana

`type` = `window`. Misma estructura que el código. `checks.json` lleva `steps`, la lista de lo que hay que pulsar. La aplicación compila, abre la ventana en el escritorio y no adivina si el clic estuvo bien.

## Guía de un tema

Cada tema es una carpeta con `topic.json` y `guide.md`. En la guía, un bloque ```uml se dibuja como diagrama de clases. `example/*.java` es el botón de correr el ejemplo. Si la ventana es el ejemplo, pon `"exampleWindow": true` en `topic.json`.
