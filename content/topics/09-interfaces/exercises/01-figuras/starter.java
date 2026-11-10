public class DemoFiguras {
    public static void main(String[] args) {
        Figura[] figuras = new Figura[2];
        figuras[0] = new Rectangulo(3, 4);
        figuras[1] = new Triangulo(4, 5);
        for (int i = 0; i < figuras.length; i++) {
            System.out.println(figuras[i].area());
        }
    }
}

abstract class Figura {
}

class Rectangulo extends Figura {
    public Rectangulo(int ancho, int alto) {
    }
}

class Triangulo extends Figura {
    public Triangulo(int base, int altura) {
    }
}
