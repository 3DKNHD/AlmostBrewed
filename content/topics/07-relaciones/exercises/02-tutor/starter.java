public class DemoTutor {
    public static void main(String[] args) {
        Profesor profe = new Profesor("Ana");
        Estudiante alumno = new Estudiante("Luis");
        alumno.setTutor(profe);
        System.out.println(alumno.getTutor().getNombre());
    }
}

class Profesor {
    public Profesor(String nombre) {
    }

    public String getNombre() {
        return "";
    }
}

class Estudiante {
    public Estudiante(String nombre) {
    }

    public void setTutor(Profesor tutor) {
    }

    public Profesor getTutor() {
        return null;
    }
}
