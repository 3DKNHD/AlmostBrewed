public class Taller {
    public static void main(String[] args) {
        System.out.println(new Rectangulo(3, 4).area());
        System.out.println(new Rectangulo(5).area());
    }
}

class Rectangulo {
    private int ancho;
    private int alto;

    public Rectangulo(int ancho, int alto) {
        this.ancho = ancho;
        this.alto = alto;
    }

    public Rectangulo(int lado) {
        this(lado, lado);
    }

    public int area() {
        return ancho * alto;
    }
}
