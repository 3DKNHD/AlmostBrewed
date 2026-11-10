public class Conteo {
    public static void main(String[] args) {
        new Alumno("Ana");
        new Alumno("Luis");
        new Alumno("Eva");
        System.out.println(Alumno.cuantas());
    }
}

class Alumno {
    public Alumno(String nombre) {
    }

    public static int cuantas() {
        return 0;
    }
}
