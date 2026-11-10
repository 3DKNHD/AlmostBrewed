# El programa deja de ser una línea recta

`if` ejecuta un bloque solo si la condición es verdadera. `else` cubre el resto. Las condiciones usan `== != < > <= >=` y se combinan con `&&` (y) y `||` (o).

```java
if (nota >= 60) {
    System.out.println("aprobado");
} else {
    System.out.println("suspenso");
}
```

`switch` elige por un valor concreto, un `int` o un `String`. No olvides `break`: sin él, Java sigue con el caso de abajo.

## Repetir

`while` repite mientras la condición sea verdadera. Úsalo cuando no sabes cuántas vueltas serán. `for` sirve cuando sí lo sabes, sobre todo para recorrer de `0` a `n - 1`.

```java
int suma = 0;
for (int i = 1; i <= n; i++) {
    suma = suma + i;
}
```

El índice de un arreglo empieza en 0. Un ciclo hasta `i <= n` cuando el arreglo tiene `n` casillas se sale por la derecha. Para la suma `1 + 2 + ... + n`, el `<=` sí es correcto, porque `n` es un valor, no una posición.

`Scanner` lee de `System.in`. `nextInt()` lee un entero. `next()` lee una palabra. `nextLine()` lee el resto de la línea, y eso incluye el salto que `nextInt()` dejó pendiente. Si mezclas los dos, consume esa línea vacía con un `nextLine()` de más.

> En el examen: te dan un ciclo y te piden la tabla de valores de `i` y de la suma. Hazla en papel antes de confiar en la corrida.
