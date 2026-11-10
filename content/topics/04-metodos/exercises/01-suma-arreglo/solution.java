import java.util.Scanner;

public class SumaArreglo {
    static int suma(int[] datos) {
        int total = 0;
        for (int i = 0; i < datos.length; i++) {
            total = total + datos[i];
        }
        return total;
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
