import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Listo extends JFrame {
    private JLabel etiqueta = new JLabel("esperando");

    public Listo() {
        super("Examen");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        JButton boton = new JButton("Listo");
        boton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evento) {
            }
        });
        JPanel panel = new JPanel();
        panel.add(boton);
        panel.add(etiqueta);
        add(panel);
        pack();
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new Listo();
            }
        });
    }
}
