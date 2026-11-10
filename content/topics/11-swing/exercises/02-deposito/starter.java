import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Ventana extends JFrame {
    private Cuenta cuenta = new Cuenta();
    private JTextField campo = new JTextField(8);
    private JLabel saldo = new JLabel("0");

    public Ventana() {
        super("Cuenta");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JButton boton = new JButton("Depositar");
        boton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evento) {
            }
        });
        JPanel panel = new JPanel();
        panel.add(campo);
        panel.add(boton);
        panel.add(saldo);
        add(panel);
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
