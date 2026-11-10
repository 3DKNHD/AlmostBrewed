public class Caja {
    public static void main(String[] args) {
        Cuenta cuenta = new Cuenta();
        cuenta.depositar(100);
        cuenta.extraer(40);
        cuenta.extraer(1000);
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

    public void extraer(int monto) {
        if (monto > 0 && monto <= saldo) {
            saldo = saldo - monto;
        }
    }

    public int getSaldo() {
        return saldo;
    }
}
