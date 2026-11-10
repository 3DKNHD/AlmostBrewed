public class DemoBib {
    public static void main(String[] args) {
        Biblioteca biblioteca = new Biblioteca("Provincial");
        biblioteca.agregar(new Libro("El Quijote"));
        biblioteca.agregar(new Libro("Cecilia"));
        System.out.println(biblioteca.cantidad());
    }
}

class Libro {
    public Libro(String titulo) {
    }
}

class Biblioteca {
    public Biblioteca(String nombre) {
    }

    public void agregar(Libro libro) {
    }

    public int cantidad() {
        return 0;
    }
}
