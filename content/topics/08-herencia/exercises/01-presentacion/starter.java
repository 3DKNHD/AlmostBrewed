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
    public Persona(String nombre) {
    }

    public String presentacion() {
        return "";
    }
}

class Estudiante extends Persona {
    public Estudiante(String nombre, String carrera) {
        super(nombre);
    }
}
