import java.util.Scanner;

public class Vocales {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        String palabra = entrada.next();
        int cuenta = 0;
        for (int i = 0; i < palabra.length(); i++) {
            char letra = Character.toLowerCase(palabra.charAt(i));
            if (letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra == 'u') {
                cuenta = cuenta + 1;
            }
        }
        System.out.println(cuenta);
    }
}
