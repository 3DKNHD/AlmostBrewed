import java.util.Scanner;

public class SumaArreglo {
    static int suma(int[] datos) {
        return 0;
    }

    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int n = entrada.nextInt();
        int[] datos = new int[n];
        for (int i = 0; i < n; i++) {
            datos[i] = entrada.nextInt();
        }
        System.out.println(suma(datos));
    }
}
