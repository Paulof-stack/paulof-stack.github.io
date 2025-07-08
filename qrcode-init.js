const input = document.getElementById("codigo");

function onScanSuccess(decodedText) {
  input.value = decodedText;
  // Você pode submeter automaticamente se quiser
  // document.getElementById("bipForm").submit();
}

const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);
