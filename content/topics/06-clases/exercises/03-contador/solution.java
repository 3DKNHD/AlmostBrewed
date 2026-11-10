public class Conteo {
    public static void main(String[] args) {
        new Alumno("Ana");
        new Alumno("Luis");
        new Alumno("Eva");
        System.out.println(Alumno.cuantas());
    }
}

class Alumno {
    private static int total = 0;
    private String nombre;

    public Alumno(String nombre) {
        this.nombre = nombre;
        total = total + 1;
    }

    public static int cuantas() {
        return total;
    }
}
