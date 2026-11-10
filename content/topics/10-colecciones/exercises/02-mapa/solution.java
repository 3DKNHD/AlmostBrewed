import java.util.HashMap;
import java.util.Scanner;

public class ConteoPalabras {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        String linea = entrada.nextLine();
        String[] partes = linea.split(" ");
        HashMap<String, Integer> mapa = new HashMap<String, Integer>();
        for (int i = 0; i < partes.length; i++) {
            String palabra = partes[i];
            if (palabra.isEmpty()) {
                continue;
            }
            Integer van = mapa.get(palabra);
            if (van == null) {
                mapa.put(palabra, 1);
            } else {
                mapa.put(palabra, van + 1);
            }
        }
        System.out.println(mapa.get("hola"));
    }
}
