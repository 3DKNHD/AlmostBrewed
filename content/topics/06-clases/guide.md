# La clase es el molde

Un campo `private` no se toca desde fuera. Quien quiera cambiar el saldo llama a `depositar` o a `extraer`, y esas operaciones pueden negarse. Eso es encapsular: la regla vive dentro de la clase. Un par de get y set públicos que dejen hacer cualquier cosa no encapsulan nada.

```java
class Cuenta {
    private int saldo;

    public void depositar(int monto) {
        if (monto > 0) {
            saldo = saldo + monto;
        }
    }

    public boolean extraer(int monto) {
        if (monto <= 0 || monto > saldo) {
            return false;
        }
        saldo = saldo - monto;
        return true;
    }
}
```

El constructor se llama igual que la clase y no declara tipo de retorno. `this` es el objeto que se está construyendo. Sirve para distinguir el campo del parámetro cuando se llaman igual, y para reutilizar otro constructor: `this(lado, lado)`.

Dos constructores con distinta lista de parámetros son una sobrecarga. No es herencia. Es la misma clase, varias formas de crearla.

`static` pertenece a la clase, no a cada objeto. Un contador `static` sube en el constructor y lo consultas con `Alumno.cuantas()` aunque no uses un alumno concreto. `main` es estático porque al arrancar todavía no hay objeto.

`toString` es el texto del objeto. Si no lo escribes, Java imprime algo como `Alumno@1a2b3c`.

> En el examen: te piden una clase con la regla de negocio en el método, no en el main. El main solo crea el objeto y llama.
