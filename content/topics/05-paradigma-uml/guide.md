# De las funciones a los objetos

En lo que llevas hecho, los datos van por un lado y los métodos por otro. Un objeto junta las dos cosas. La clase es el molde. El objeto es un ejemplar. Un atributo es un dato del objeto. Un método es una operación. Un mensaje es la llamada: `cuenta.depositar(100)` le pide a ese objeto que deposite.

La visibilidad dice quién puede tocarlo:

- `+` público. Cualquiera.
- `-` privado. Solo el código de la clase.
- `#` protegido. La clase y quien hereda de ella.

En el diagrama de este curso se escribe así. Las relaciones van en su propia línea.

```uml
class Biblioteca
  -libros: List
class Libro
  -titulo: String
  +getTitulo(): String
Biblioteca *-- Libro
```

- `*--` composición. El todo se compone de la parte. Si desaparece la biblioteca, esos libros del catálogo no tienen sentido fuera de ella.
- `o--` agregación. El todo reúne partes que pueden existir solas. Un departamento agrupa profesores; el profesor sigue existiendo si cierran el departamento.
- `-->` asociación. Una clase usa o conoce a la otra, sin que una esté hecha de la otra. Un estudiante tiene un tutor.
- `<|--` generalización. El destino hereda del origen. `Persona <|-- Estudiante` se lee: Estudiante hereda de Persona.
- `<|..` realización. El destino cumple la interfaz del origen.

La multiplicidad se escribe al lado cuando importe: 1, 0..1, *. Una biblioteca tiene muchos libros. Un libro, en este modelo, pertenece a una biblioteca.

El diagrama de casos de uso, en este curso, solo nombra al actor y al objetivo: el bibliotecario presta un libro. No diseñes pantallas ahí. El diagrama de secuencia muestra el mensaje en el tiempo: el bibliotecario llama a `prestar` y ese método llama a `estaDisponible`. Cuando la variable es del tipo general y el objeto es de una subclase, el mensaje lo atiende la subclase. Eso es la ligadura dinámica, y el tema de herencia vuelve sobre ella.

> En el examen: composición contra agregación es la pregunta corta de siempre. Composición es parte inseparable. Agregación es grupo de cosas que viven por su cuenta.
