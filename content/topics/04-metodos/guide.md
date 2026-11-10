# Un método es un trozo con nombre

La firma dice quién puede llamarlo, qué devuelve, cómo se llama y qué recibe.

```java
public static int suma(int[] datos) {
    int total = 0;
    for (int i = 0; i < datos.length; i++) {
        total = total + datos[i];
    }
    return total;
}
```

`void` no lleva `return` de un valor. Un método que promete `int` tiene que devolver un `int` por todos los caminos. `return` sale del método en ese instante.

`static` aquí significa que lo llamas con el nombre de la clase, sin crear un objeto. En los temas de clases vas a quitar ese `static` de los métodos que hablen del objeto.

## Arreglos

```java
int[] datos = new int[n];
datos[0] = 4;
int cantidad = datos.length;
```

`length` en un arreglo es un campo, sin paréntesis. Las casillas van de `0` a `length - 1`. `new int[n]` las llena de ceros.

## Cadenas

```java
String palabra = "casa";
int letras = palabra.length();
char primera = palabra.charAt(0);
```

En un `String`, `length` es un método y lleva paréntesis. `charAt` devuelve el carácter de esa posición. Para armar otra cadena puedes ir sumando: `reves = letra + reves`.

> En el examen: la confusión `length` / `length()` aparece en preguntas cortas. Arreglo sin paréntesis, String con paréntesis.
