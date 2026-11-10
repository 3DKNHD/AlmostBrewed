public class DemoHerencia {
    public static void main(String[] args) {
        Persona[] gente = new Persona[2];
        gente[0] = new Persona("Ana");
        gente[1] = new Estudiante("Ana", "Informática");
        for (int i = 0; i < gente.length; i++) {
            System.out.println(gente[i].presentacion());
        }
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
