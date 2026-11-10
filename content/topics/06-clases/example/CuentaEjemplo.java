public class CuentaEjemplo {
    public static void main(String[] args) {
        Cuenta cuenta = new Cuenta();
        cuenta.depositar(100);
        cuenta.extraer(40);
        System.out.println(cuenta.getSaldo());
    }
}

class Cuenta {
    private int saldo;

    public void depositar(int monto) {
        if (monto > 0) {
            saldo = saldo + monto;
        }
    }

    public boolean extraer(int monto) {
        if (monto <= 0 || monto > saldo) {
            return false;
        }
        saldo = saldo - monto;
        return true;
    }

    public int getSaldo() {
        return saldo;
    }
}
