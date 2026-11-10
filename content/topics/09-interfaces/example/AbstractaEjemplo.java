public class AbstractaEjemplo {
    public static void main(String[] args) {
        Figura figura = new Rectangulo(3, 4);
        System.out.println(figura.area());
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
