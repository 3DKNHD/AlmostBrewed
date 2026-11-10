public class DemoTutor {
    public static void main(String[] args) {
        Profesor profe = new Profesor("Ana");
        Estudiante alumno = new Estudiante("Luis");
        alumno.setTutor(profe);
        System.out.println(alumno.getTutor().getNombre());
    }
}

class Profesor {
    private String nombre;

    public Profesor(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}

class Estudiante {
    private String nombre;
    private Profesor tutor;

    public Estudiante(String nombre) {
        this.nombre = nombre;
    }

    public void setTutor(Profesor tutor) {
        this.tutor = tutor;
    }

    public Profesor getTutor() {
        return tutor;
    }
}
