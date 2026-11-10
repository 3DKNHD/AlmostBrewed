import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Ventana extends JFrame {
    private Biblioteca biblioteca = new Biblioteca();
    private JTextField campo = new JTextField(16);
    private JTextArea area = new JTextArea(8, 24);

    public Ventana() {
        super("Biblioteca");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JButton agregar = new JButton("Agregar");
        agregar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evento) {
            }
        });
        JPanel norte = new JPanel();
        norte.add(campo);
        norte.add(agregar);
        add(norte, BorderLayout.NORTH);
        add(new JScrollPane(area), BorderLayout.CENTER);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new Ventana();
            }
        });
    }
}
