# Curso local de Java

Aplicación en el navegador para aprender Java desde cero y seguir con programación orientada a objetos, UML, interfaces y pantallas Swing.

El nombre que se ve en la página está en `content/course.json` (`title`, `slug` y `tagline`). El resto del programa lo lee de ahí.

## Arrancar

Hace falta Python 3 y un JDK (`javac` y `java`).

```sh
./start.sh
```

Abre `http://127.0.0.1:8765/` en este equipo. La terminal también imprime una dirección `http://…:8765/` para abrirla desde otro dispositivo de la misma red. Para apagarla, cierra esa terminal. La teoría y los diagramas se leen aunque no compiles. Las ventanas Swing se abren en el escritorio donde corre el servidor.

El avance queda en `data/progress.json` y no se versiona. Los borradores del editor quedan en el navegador.

## Añadir un ejercicio

Cada tema es una carpeta en `content/topics/` o en `content/exams/`. Cada ejercicio es otra carpeta dentro de `exercises/`. Al arrancar, la aplicación lee esas carpetas. No hay una lista escrita en el código.

El formato está en `content/templates/exercise/HOWTO.md`.

`python3 app/selfcheck.py` compila las soluciones y no abre ventanas.
