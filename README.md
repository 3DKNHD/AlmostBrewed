# AlmostBrewed

Curso local de Java. Local Java course.

El nombre que se ve en la página está en `content/course.json` (`title`, `slug` y `tagline`). El resto del programa lo lee de ahí.

The name on the page lives in `content/course.json` (`title`, `slug`, and `tagline`). The rest of the course is read from that file.

## Español

Aplicación en el navegador para aprender Java desde cero y seguir con programación orientada a objetos, UML, interfaces y pantallas Swing.

### Arrancar

Hace falta Python 3 y un JDK (`javac` y `java`).

```sh
./start.sh
```

Abre `http://127.0.0.1:8765/` en este equipo. La terminal también imprime una dirección `http://…:8765/` para abrirla desde otro dispositivo de la misma red. Para apagarla, cierra esa terminal. La teoría y los diagramas se leen aunque no compiles. Las ventanas Swing se abren en el escritorio donde corre el servidor.

El avance queda en `data/progress.json` y no se versiona. Los borradores del editor quedan en el navegador.

### Añadir un ejercicio

Cada tema es una carpeta en `content/topics/` o en `content/exams/`. Cada ejercicio es otra carpeta dentro de `exercises/`. Al arrancar, la aplicación lee esas carpetas. No hay una lista escrita en el código.

El formato está en `content/templates/exercise/HOWTO.md`.

`python3 app/selfcheck.py` compila las soluciones y no abre ventanas.

## English

A browser app for learning Java from scratch, then object-oriented programming, UML, interfaces, and Swing windows.

### Start

You need Python 3 and a JDK (`javac` and `java`).

```sh
./start.sh
```

Open `http://127.0.0.1:8765/` on this machine. The terminal also prints an `http://…:8765/` address for another device on the same network. Close that terminal to stop the server. Theory and diagrams can be read without compiling. Swing windows open on the desktop where the server is running.

Progress is stored in `data/progress.json` and is not versioned. Editor drafts stay in the browser.

### Add an exercise

Each topic is a folder under `content/topics/` or `content/exams/`. Each exercise is another folder inside `exercises/`. On startup the app reads those folders. There is no exercise list written in the code.

The format is in `content/templates/exercise/HOWTO.md`.

`python3 app/selfcheck.py` compiles the solutions and does not open windows.
