import java.util.ArrayList;

public class RelacionEjemplo {
    public static void main(String[] args) {
        Biblioteca biblioteca = new Biblioteca();
        biblioteca.agregar(new Libro("Cecilia"));
        System.out.println(biblioteca.cantidad());
    }
}

class Libro {
    private String titulo;

    public Libro(String titulo) {
        this.titulo = titulo;
    }
}

class Biblioteca {
    private ArrayList<Libro> libros = new ArrayList<Libro>();

    public void agregar(Libro libro) {
        libros.add(libro);
    }

    public int cantidad() {
        return libros.size();
    }
}
