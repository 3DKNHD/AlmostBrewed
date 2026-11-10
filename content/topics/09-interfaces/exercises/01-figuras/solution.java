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
    public abstract int area();
}

class Rectangulo extends Figura {
    private int ancho;
    private int alto;

    public Rectangulo(int ancho, int alto) {
        this.ancho = ancho;
        this.alto = alto;
    }

    public int area() {
        return ancho * alto;
    }
}

class Triangulo extends Figura {
    private int base;
    private int altura;

    public Triangulo(int base, int altura) {
        this.base = base;
        this.altura = altura;
    }

    public int area() {
        return base * altura / 2;
    }
}
