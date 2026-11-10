import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingUtilities;

public class TablaEjemplo extends JFrame {
    public TablaEjemplo() {
        super("Libros");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        String[] columnas = {"Titulo", "Estado"};
        String[][] datos = {
            {"El Quijote", "disponible"},
            {"Cecilia", "prestado"}
        };
        add(new JScrollPane(new JTable(datos, columnas)));
        pack();
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new TablaEjemplo();
            }
        });
    }
}
