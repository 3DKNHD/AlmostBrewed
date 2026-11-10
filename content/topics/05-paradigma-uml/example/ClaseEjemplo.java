public class ClaseEjemplo {
    public static void main(String[] args) {
        Libro libro = new Libro("Cecilia");
        System.out.println(libro.getTitulo());
    }
}

class Libro {
    private String titulo;

    public Libro(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}
