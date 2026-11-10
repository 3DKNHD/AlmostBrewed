import java.util.ArrayList;
import java.util.Scanner;

public class Mayores {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int n = entrada.nextInt();
        ArrayList<Integer> edades = new ArrayList<Integer>();
        for (int i = 0; i < n; i++) {
            int edad = entrada.nextInt();
            if (edad >= 18) {
                edades.add(edad);
            }
        }
        for (int i = 0; i < edades.size(); i++) {
            System.out.println(edades.get(i));
        }
    }
}
