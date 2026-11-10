# Listas y mapas ya escritos

Este tema no pide que implementes una lista enlazada. Pide que uses las que Java trae.

`ArrayList` guarda objetos y crece. El tipo va entre ángulos: `ArrayList<String>`. `add` mete, `get` saca, `size` cuenta, `remove` quita.

`HashMap<String, Integer>` asocia una clave con un valor. `get` devuelve `null` si la clave no está. Por eso, antes de sumar, preguntas.

```java
Integer van = mapa.get(palabra);
if (van == null) {
    mapa.put(palabra, 1);
} else {
    mapa.put(palabra, van + 1);
}
```

## Cuando el dato viene mal

`Integer.parseInt("12")` devuelve 12. `Integer.parseInt("x")` lanza `NumberFormatException` y, si nadie la atrapa, el programa muere.

```java
try {
    int n = Integer.parseInt(texto);
    return Integer.toString(n);
} catch (NumberFormatException ex) {
    return "no es un numero";
}
```

`try` es el tramo que puede fallar. `catch` es lo que haces si falla ese tipo de excepción. No uses un `catch` vacío: ahí se esconden los errores.

## Un archivo de texto

`PrintWriter` escribe líneas. `BufferedReader` las lee. Cierra los dos cuando termines. El archivo queda en la carpeta desde la que corre el programa.

Esto no reemplaza el curso de estructuras de datos. Aquí eliges una colección. Allá la construyes y discutes cuánto tarda.

> En el examen práctico: guardar el modelo en un `.txt` y volver a armarlo al abrir el programa.
