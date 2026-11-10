public class DemoAvisos {
    public static void main(String[] args) {
        Notificable[] vias = new Notificable[2];
        vias[0] = new Correo();
        vias[1] = new Sms();
        for (int i = 0; i < vias.length; i++) {
            System.out.println(vias[i].enviar("hola"));
        }
    }
}

interface Notificable {
    String enviar(String mensaje);
}

class Correo implements Notificable {
    public String enviar(String mensaje) {
        return "correo: " + mensaje;
    }
}

class Sms implements Notificable {
    public String enviar(String mensaje) {
        return "sms: " + mensaje;
    }
}
