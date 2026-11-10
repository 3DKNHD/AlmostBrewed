public class Cuenta {
    private int saldo;

    public void depositar(int monto) {
        if (monto > 0) {
            saldo = saldo + monto;
        }
    }

    public int getSaldo() {
        return saldo;
    }
}
