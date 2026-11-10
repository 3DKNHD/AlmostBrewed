import java.util.ArrayList;

public class DemoBib {
    public static void main(String[] args) {
        Biblioteca biblioteca = new Biblioteca("Provincial");
        biblioteca.agregar(new Libro("El Quijote"));
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
    private String nombre;
    private ArrayList<Libro> libros = new ArrayList<Libro>();

    public Biblioteca(String nombre) {
        this.nombre = nombre;
    }

    public void agregar(Libro libro) {
        libros.add(libro);
    }

    public int cantidad() {
        return libros.size();
    }
}
