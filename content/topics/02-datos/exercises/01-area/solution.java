import java.util.Scanner;

public class Area {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int ancho = entrada.nextInt();
        int alto = entrada.nextInt();
        System.out.println(ancho * alto);
    }
}
