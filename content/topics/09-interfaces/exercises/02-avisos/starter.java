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
