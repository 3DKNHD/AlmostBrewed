import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Contador extends JFrame {
    private int valor = 0;
    private JLabel etiqueta = new JLabel("0");

    public Contador() {
        super("Contador");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JButton boton = new JButton("Sumar");
        boton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evento) {
            }
        });
        JPanel panel = new JPanel();
        panel.add(boton);
        panel.add(etiqueta);
        add(panel);
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new Contador();
            }
        });
    }
}
