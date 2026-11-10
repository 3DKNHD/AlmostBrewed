public class HerenciaEjemplo {
    public static void main(String[] args) {
        Persona persona = new Estudiante("Ana", "Informática");
        System.out.println(persona.presentacion());
    }
}

class Persona {
    protected String nombre;

    public Persona(String nombre) {
        this.nombre = nombre;
    }

    public String presentacion() {
        return nombre;
    }
}

class Estudiante extends Persona {
    private String carrera;

    public Estudiante(String nombre, String carrera) {
        super(nombre);
        this.carrera = carrera;
    }

    public String presentacion() {
        return nombre + " estudia " + carrera;
    }
}
