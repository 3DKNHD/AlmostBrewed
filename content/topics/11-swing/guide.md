# La pantalla es otra clase

`JFrame` es la ventana. `JPanel` agrupa componentes. Tres layouts alcanzan para este curso:

- `FlowLayout` los pone en fila, uno al lado del otro.
- `BorderLayout` tiene norte, sur, este, oeste y centro.
- `GridLayout` los pone en una cuadrícula de filas y columnas.

`JButton`, `JLabel`, `JTextField` y `JTextArea` son el botón, la etiqueta, el campo de una línea y el área de varias. `JTable` muestra filas. El ejemplo de este tema abre una tabla de dos libros.

El clic no es un `if` que tú escribas en un ciclo. Registras un oyente. `ActionListener` es una interfaz con un método, `actionPerformed`. El botón, cuando lo pulsan, llama a ese método. Por eso el tema de interfaces y el tema de pantallas son el mismo mecanismo.

```java
boton.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent evento) {
        cuenta.depositar(monto);
        etiqueta.setText(Integer.toString(cuenta.getSaldo()));
    }
});
```

La cuenta sabe depositar. El oyente solo lee el campo, llama al modelo y refresca la etiqueta. Si metes el saldo dentro del botón, el examen de diseño está perdido: no puedes probar la cuenta sin abrir la ventana.

`setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE)` cierra esa ventana sin matar otras. `pack()` la ajusta al contenido. `SwingUtilities.invokeLater` crea la ventana en el hilo que Swing exige.

Al correr un ejercicio de ventana, la ventana sale en el escritorio, no dentro de la página. La página te deja la lista de clics.

> En el examen: te dan el modelo ya pensado y te piden la pantalla, o al revés. La frase que salva es "el listener llama al modelo".
