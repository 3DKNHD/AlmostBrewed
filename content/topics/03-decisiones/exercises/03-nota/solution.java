import java.util.Scanner;

public class Nota {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int nota = entrada.nextInt();
        if (nota >= 60) {
            System.out.println("aprobado");
        } else {
            System.out.println("suspenso");
        }
    }
}
