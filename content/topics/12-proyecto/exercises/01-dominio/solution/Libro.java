public class Libro implements Prestable {
    private String titulo;
    private boolean disponible = true;
    private String socio = "";

    public Libro(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getSocio() {
        return socio;
    }

    public void prestar(String socio) {
        this.socio = socio;
        this.disponible = false;
    }

    public void devolver() {
        this.disponible = true;
        this.socio = "";
    }

    public boolean estaDisponible() {
        return disponible;
    }
}
