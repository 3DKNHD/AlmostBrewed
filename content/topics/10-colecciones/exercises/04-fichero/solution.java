import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;

public class Notas {
    public static void main(String[] args) throws Exception {
        PrintWriter salida = new PrintWriter(new FileWriter("notas.txt"));
        salida.println("Java");
        salida.close();
        BufferedReader entrada = new BufferedReader(new FileReader("notas.txt"));
        String linea = entrada.readLine();
        entrada.close();
        System.out.println(linea);
    }
}
