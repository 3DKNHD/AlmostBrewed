import java.util.Scanner;

public class Lectura {
    static String leer(String texto) {
        try {
            int n = Integer.parseInt(texto);
            return Integer.toString(n);
        } catch (NumberFormatException ex) {
            return "no es un numero";
        }
    }

    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        System.out.println(leer(entrada.next()));
        System.out.println(leer(entrada.next()));
    }
}
