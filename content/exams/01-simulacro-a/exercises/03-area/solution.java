public class ExamenArea {
    public static void main(String[] args) {
        Rectangulo mesa = new Rectangulo(6, 4);
        System.out.println(mesa.area());
    }
}

class Rectangulo {
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
