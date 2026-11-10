import java.util.Scanner;

public class Reves {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        String palabra = entrada.next();
        String reves = "";
        for (int i = palabra.length() - 1; i >= 0; i--) {
            reves = reves + palabra.charAt(i);
        }
        System.out.println(reves);
    }
}
