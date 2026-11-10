import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Saludo extends JFrame {
    private JTextField campo = new JTextField(10);
    private JLabel etiqueta = new JLabel("...");

    public Saludo() {
        super("Saludo");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JButton boton = new JButton("Saludar");
        boton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evento) {
                etiqueta.setText("hola " + campo.getText().trim());
            }
        });
        JPanel panel = new JPanel();
        panel.add(campo);
        panel.add(boton);
        panel.add(etiqueta);
        add(panel);
        pack();
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new Saludo();
            }
        });
    }
}
