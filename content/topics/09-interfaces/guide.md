# Dos formas de decir "esto todavía no está escrito"

Una clase abstracta puede tener campos, constructores y métodos con cuerpo. También puede tener un método abstracto, sin cuerpo, que obliga al hijo a escribirlo. No se hace `new` de la clase abstracta. Se hace `new` del hijo.

```java
abstract class Figura {
    public abstract int area();
}
```

Una interfaz, en este curso, es un contrato: métodos públicos y abstractos, sin estado. Una clase puede extender una sola clase y puede implementar varias interfaces.

```java
interface Notificable {
    String enviar(String mensaje);
}

class Correo implements Notificable {
    public String enviar(String mensaje) {
        return "correo: " + mensaje;
    }
}
```

La diferencia de examen cabe en una frase. La clase abstracta es una familia: comparte estado y deja huecos. La interfaz es un contrato: no dice qué campos tienes, dice qué sabes hacer. Por eso una clase entra en varias interfaces y solo en una familia.

Java permite métodos `default` dentro de una interfaz. No los vamos a usar. En el examen, la interfaz es el contrato, sin campos.

Una variable del tipo de la interfaz puede guardar cualquier objeto que la cumpla. La llamada usa el método del objeto real, igual que en la herencia. A eso, en el diagrama, se llega con una realización: flecha discontinua desde la clase hacia la interfaz. En la notación de estas guías es `Notificable <|.. Correo`.

> En el examen: "¿por qué aquí una interfaz y no una clase abstracta?". Si no hay estado compartido y una misma clase debe cumplir varios contratos, la respuesta es la interfaz.
