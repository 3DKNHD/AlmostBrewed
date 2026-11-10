import java.util.ArrayList;
import java.util.Scanner;

public class Limpia {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int n = entrada.nextInt();
        entrada.nextLine();
        ArrayList<String> nombres = new ArrayList<String>();
        for (int i = 0; i < n; i++) {
            String linea = entrada.nextLine().trim();
            if (!linea.isEmpty()) {
                nombres.add(linea);
            }
        }
        for (int i = 0; i < nombres.size(); i++) {
            System.out.println(nombres.get(i));
        }
    }
}
