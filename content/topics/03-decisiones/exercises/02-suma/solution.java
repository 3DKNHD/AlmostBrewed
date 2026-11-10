import java.util.Scanner;

public class SumaHasta {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int n = entrada.nextInt();
        int suma = 0;
        for (int i = 1; i <= n; i++) {
            suma = suma + i;
        }
        System.out.println(suma);
    }
}
