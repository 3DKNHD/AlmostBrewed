# Un programa es una lista de órdenes

Java no ejecuta el archivo que tú escribes. `javac` lo traduce a bytecode, un archivo `.class`. `java` ejecuta ese `.class`. Si el archivo se llama `Hola.java`, la clase pública se llama `Hola`. El nombre tiene que coincidir, mayúsculas incluidas.

Todo programa de consola entra por aquí:

```java
public class Hola {
    public static void main(String[] args) {
        System.out.println("Hola, mundo");
    }
}
```

- `public` significa que se puede usar desde fuera.
- `static` significa que `main` pertenece a la clase, no a un objeto. Todavía no hay objetos.
- `void` significa que no devuelve un valor.
- `String[] args` es la lista de palabras que le pasarías al programa. Puede ir vacía.
- `System.out.println` imprime una línea y baja a la siguiente. `print` no baja.

Los comentarios los ignora el compilador. `//` vale hasta el fin de la línea. `/* ... */` puede ocupar varias.

## Lo que se cae en un examen escrito

Te piden el `main` de memoria. También te piden el error de este fragmento:

```java
System.out.println("hola")
```

Falta el punto y coma. Java no cierra la instrucción por ti. Otro clásico: la clase pública `Hola` guardada en `hola.java`. En el laboratorio, Linux distingue mayúsculas.

> En el examen: saber explicar, en una frase, la diferencia entre compilar y ejecutar.
