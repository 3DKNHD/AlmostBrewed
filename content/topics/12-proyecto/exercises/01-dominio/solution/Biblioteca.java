import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;

public class Biblioteca {
    private ArrayList<Libro> libros = new ArrayList<Libro>();

    public void agregar(Libro libro) {
        libros.add(libro);
    }

    public void prestar(String titulo, String socio) {
        buscar(titulo).prestar(socio);
    }

    public String estado(String titulo) {
        Libro libro = buscar(titulo);
        if (libro.estaDisponible()) {
            return "disponible";
        }
        return "prestado a " + libro.getSocio();
    }

    public void guardar(String ruta) throws Exception {
        PrintWriter salida = new PrintWriter(new FileWriter(ruta));
        for (int i = 0; i < libros.size(); i++) {
            salida.println(libros.get(i).getTitulo());
        }
        salida.close();
    }

    private Libro buscar(String titulo) {
        for (int i = 0; i < libros.size(); i++) {
            if (libros.get(i).getTitulo().equals(titulo)) {
                return libros.get(i);
            }
        }
        return null;
    }
}
