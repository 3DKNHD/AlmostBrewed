public class Prueba {
    public static void main(String[] args) throws Exception {
        Biblioteca biblioteca = new Biblioteca();
        biblioteca.agregar(new Libro("El Quijote"));
        biblioteca.prestar("El Quijote", "Ana");
        System.out.println(biblioteca.estado("El Quijote"));
        biblioteca.guardar("catalogo.txt");
    }
}
