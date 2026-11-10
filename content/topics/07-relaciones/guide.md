# El diagrama se vuelve un campo

Una asociación de uno es una variable del otro tipo.

```java
class Estudiante {
    private Profesor tutor;

    public void setTutor(Profesor tutor) {
        this.tutor = tutor;
    }
}
```

El estudiante conoce a su tutor. Ninguno está hecho del otro. Si el estudiante se va, el profesor sigue en el departamento.

Una composición de muchos es una lista que crea la clase dueña y que los de fuera no reemplazan a su antojo.

```java
class Biblioteca {
    private ArrayList<Libro> libros = new ArrayList<Libro>();

    public void agregar(Libro libro) {
        libros.add(libro);
    }

    public int cantidad() {
        return libros.size();
    }
}
```

`ArrayList` crece sola. `size` dice cuántos hay. `get(i)` saca el de la posición `i`. En el diagrama, la biblioteca va con `*` hacia el libro y la relación es composición: el catálogo es parte de la biblioteca.

La agregación, en código, se parece mucho: también hay una lista. La diferencia no la ve el compilador. La decides tú al modelar. Si la parte tiene vida propia, es agregación. Si nace y muere con el todo, es composición.

> En el examen: te dan el diagrama y te piden los campos. Asociación simple: un atributo. Muchos: una colección.
