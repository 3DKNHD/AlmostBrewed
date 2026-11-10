# El orden que se espera en la suficiencia

No abras el editor por el botón. El examen práctico suele dar un párrafo de negocio y pide tres cosas: el diagrama, el modelo y una pantalla que lo use.

1. Subraya sustantivos y verbos. Los sustantivos candidatos a clase son libro, socio, préstamo. Los verbos son prestar y devolver.
2. Dibuja el diagrama. `Libro` realiza `Prestable`. `Biblioteca` se compone de libros. El socio, en esta versión, es el nombre a quien se presta: un `String`, no otra pantalla.
3. Implementa el modelo y pruébalo en consola, sin ventana.
4. Guarda los títulos en un archivo de texto.
5. La ventana solo agrega libros y muestra la lista. El botón llama a `biblioteca.agregar`.

```uml
class Prestable
  +prestar(socio: String): void
  +devolver(): void
  +estaDisponible(): boolean
class Libro
  -titulo: String
  -disponible: boolean
class Biblioteca
  -libros: List
Prestable <|.. Libro
Biblioteca *-- Libro
```

Si el modelo está bien, cambiar la pantalla no toca las reglas. Si las reglas están en el botón, el próximo ejercicio te obliga a copiarlas.

> En el examen: entrega el diagrama aunque el código no te alcance. Un diagrama claro rescata puntos que un botón a medias no rescata.
