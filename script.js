function calcularDescuento() {
    const precio = parseFloat(document.getElementById('precio-base').value);
    const porcentaje = parseFloat(document.getElementById('tipo-descuento').value);

    if (isNaN(precio) || precio <= 0) {
        alert("Por favor, ingresa un precio válido.");
        return;
    }

    const descuento = (precio * porcentaje) / 100;
    const totalFinal = precio - descuento;

    document.getElementById('resultado-total').textContent = totalFinal.toFixed(2);
}