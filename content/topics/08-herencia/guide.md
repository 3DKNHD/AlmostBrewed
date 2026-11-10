# Heredar es especializar

`Estudiante` es una `Persona` con datos de más. No copies los campos de persona dentro de estudiante. Extiende.

```java
class Persona {
    protected String nombre;

    public Persona(String nombre) {
        this.nombre = nombre;
    }

    public String presentacion() {
        return nombre;
    }
}

class Estudiante extends Persona {
    private String carrera;

    public Estudiante(String nombre, String carrera) {
        super(nombre);
        this.carrera = carrera;
    }

    public String presentacion() {
        return nombre + " estudia " + carrera;
    }
}
```

`super(nombre)` llama al constructor de la clase padre y tiene que ser la primera línea. `protected` deja que el hijo lea `nombre`. Redefinir es escribir el mismo método en el hijo. `@Override`, puesto encima, le pide al compilador que avise si te equivocaste de nombre y en realidad no estás redefiniendo.

El polimorfismo se ve en esta lista:

```java
Persona[] gente = new Persona[2];
gente[0] = new Persona("Ana");
gente[1] = new Estudiante("Ana", "Informática");
```

La variable es `Persona`. El segundo objeto es `Estudiante`. Al llamar `presentacion()`, Java usa el método del objeto real, no el de la variable. Eso es ligadura dinámica, o despacho dinámico.

No heredes solo para reutilizar un método. Un cuadrado no debería ser una subclase de rectángulo si el rectángulo deja cambiar ancho y alto por separado: un cuadrado dejaría de ser cuadrado. Ahí conviene composición, o una sola clase con una operación que mantenga los lados iguales.

> En el examen: dibujan una variable de la clase padre y preguntan qué texto sale. Miras el objeto creado con `new`, no el tipo de la variable.
