# Una variable es un nombre para un valor

Declaras el tipo, el nombre, y a veces el valor:

```java
int edad = 20;
double precio = 3.5;
char letra = 'A';
boolean aprobo = true;
String nombre = "Ana";
```

Los primitivos guardan el valor directamente: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`. `String` no es primitivo. Es una clase, por eso la ese va en mayúscula y el texto va entre comillas dobles. El `char` usa comillas simples y es un solo carácter.

Operadores que vas a usar: `+ - * / %`. El `%` es el resto. `7 % 2` vale `1`.

## La división tiene trampa

Si los dos operandos son enteros, `/` trunca. `5 / 2` vale `2`, no `2.5`. Para la división real, uno de los dos tiene que ser `double`:

```java
System.out.println(5 / 2);
System.out.println((double) 5 / 2);
```

`(double) 5` convierte el 5 antes de dividir. El paréntesis importa: `(double) (5 / 2)` convierte el 2 que ya truncaste, y sigues teniendo 2.0.

## Textos

`==` compara primitivos. Entre dos `String` compara si son el mismo objeto, no si dicen lo mismo. Para el contenido se usa `nombre.equals("Ana")`.

> En el examen: te dan una expresión con enteros y te piden el valor. Traza la división antes de convertir.
