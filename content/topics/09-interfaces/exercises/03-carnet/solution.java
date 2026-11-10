public class DemoCarnet {
    public static void main(String[] args) {
        Carnet carnet = new Carnet();
        System.out.println(carnet.nombre());
        System.out.println(carnet.codigo());
    }
}

interface Nombrable {
    String nombre();
}

interface Codificable {
    String codigo();
}

class Carnet implements Nombrable, Codificable {
    public String nombre() {
        return "Ana";
    }

    public String codigo() {
        return "A-10";
    }
}
