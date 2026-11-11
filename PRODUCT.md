# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quien estudia Java en este equipo, desde el primer programa hasta programación orientada a objetos, UML, interfaces y Swing. El curso nombra la segunda mitad «Programación 2» y abre con «Java desde cero». Inferido del programa y del README: no hubo una entrevista aparte; el plan aprobado fija el uso.

## Product Purpose

Una aplicación local en el navegador para leer la guía, intentar el ejercicio y comprobar el resultado. El éxito es que la persona sepa qué tema sigue, escriba el código, vea si compiló y deje el avance marcado.

## Positioning

Los ejercicios de consola se comprueban solos. Los de ventana se abren en el escritorio y la página dice qué pulsar. El programa se lee de carpetas en `content/`, no de una lista escrita en el código. El avance queda en `data/progress.json` y los borradores del editor, en el navegador.

## Operating Context

Se arranca con `./start.sh` y se abre en `http://127.0.0.1:8765/` en este equipo. Otro dispositivo de la misma red entra por la dirección que imprime la terminal. Hace falta Python 3 y un JDK para compilar. La teoría y los diagramas se leen aunque no haya compilador. Una sola persona, en una sola máquina, a menudo con la guía y el editor en la misma vista.

## Capabilities and Constraints

- Tres recorridos: Java desde cero, Programación 2 y simulacros.
- Tipos de ejercicio: código (uno o varios archivos), quiz y diagrama UML.
- El servidor, el contenido y la lógica de corrección no cambian en este trabajo.
- La interfaz sigue en HTML, CSS y JavaScript sin framework.
- Tema claro, oscuro y el del sistema, recordado en el navegador.
- La página tiene que verse sin pedir una fuente a una CDN.
- La interfaz está en español. La voz que ya existe es corta y seca: «javac todavía no está de acuerdo», «Compiló. Esta vez sí.»

## Brand Commitments

El nombre es AlmostBrewed. La frase que lo acompaña es «El café casi listo y el programa que casi compila.» Esa frase se queda. El aspecto de papel crema y sello terracota es el mundo visual que se reemplaza, no un compromiso de marca.

## Evidence on Hand

Guías, enunciados y soluciones en `content/topics/` y `content/exams/`. La interfaz actual está en `app/static/`. No hay testimonios, precios ni capturas de alumnos, y no se inventan.

## Product Principles

- La guía y el editor son el trabajo; el adorno no puede taparlos.
- El avance se lee en palabras y en cuentas, no solo en un color.
- La respuesta del compilador aparece donde se acaba de pedir.
- El texto sigue la voz del curso.
- Funciona en este equipo aunque la red falle.

## Accessibility & Inclusion

WCAG 2.2 AA en claro y en oscuro: texto 4.5:1, controles y foco 3:1. El foco de teclado se ve. `prefers-reduced-motion` anula el movimiento. El estado de un ejercicio hecho lleva la palabra «Hecho».
