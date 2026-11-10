# Curso local de Java

Aplicación para estudiar Java desde cero y la Programación 2 de Ingeniería Informática en la Universidad de Holguín: programación orientada a objetos, UML, interfaces y pantallas Swing. El temario sigue el Plan E (Diseño y Programación Orientada a Objetos) y lo que dijo el profesor. El programa oficial de la facultad no está publicado.

El nombre que se ve en el navegador está solo en `content/course.json`, en `title`, `slug` y `tagline`. El resto de la aplicación lo lee de ahí.

## Arrancar

Hace falta Python 3 y un JDK (`javac` y `java`).

```sh
./iniciar.sh
```

Abre `http://127.0.0.1:8765/` en este equipo. Para apagarla, cierra esa terminal. La teoría y los diagramas funcionan aunque ese día no compiles. Las ventanas Swing se abren en el escritorio, no dentro de la página.

El avance queda en `data/progress.json`. Ese archivo no se versiona. Los borradores del editor quedan en el navegador.

## Añadir un ejercicio

Cada tema es una carpeta en `content/topics/` o en `content/exams/`. Cada ejercicio es otra carpeta dentro de `exercises/`. La aplicación las descubre al arrancar: no hay una lista en el código.

La plantilla y el formato están en `content/templates/exercise/HOWTO.md`.

## Ramas y commits

Los commits de este repositorio son [Conventional Commits](https://www.conventionalcommits.org/) en inglés. Ámbitos: `app`, `runner`, `content`, `docs`.

Cada bloque va en su rama, encima de la anterior. El agente no ejecuta `git add` ni `git commit`. Cuando un bloque está listo, deja escritos la rama, los archivos y el mensaje para que el commit lo hagas tú.

Mensajes de esta primera versión:

```sh
git switch -c feat/app-shell
git add app iniciar.sh .gitignore README.md content/course.json content/templates data/.gitkeep
git commit -m "feat(app): add local course shell"

git switch -c feat/java-from-scratch
git add content/topics/01-primer-programa content/topics/02-datos content/topics/03-decisiones content/topics/04-metodos
git commit -m "feat(content): add Java from scratch topics"

git switch -c feat/oop-uml
git add content/topics/05-paradigma-uml content/topics/06-clases content/topics/07-relaciones content/topics/08-herencia content/topics/09-interfaces content/topics/10-colecciones
git commit -m "feat(content): add OOP, UML, and interfaces"

git switch -c feat/swing-and-exams
git add content/topics/11-swing content/topics/12-proyecto content/exams
git commit -m "feat(content): add Swing project and sufficiency drills"
```

Un ejercicio suelto, más adelante, va en una rama corta. Por ejemplo: `feat(content): add loop exercises for running sums`.

`python3 app/selfcheck.py` compila las soluciones y no abre ventanas.

## Bibliografía

No está copiada en las guías. Para profundizar: los tutoriales de Oracle (Trail: Learning the Java Language), Deitel, *Cómo programar en Java*, Joyanes Aguilar, *Programación en Java*, y un manual breve de UML para el diagrama de clases.
