const input = document.getElementById("codigo");
const form = document.getElementById("bipForm");

let enviando = false; // evita múltiplos envios acidentais

function emitirBip() {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1000, context.currentTime);
  gainNode.gain.setValueAtTime(0.1, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    context.close();
  }, 150);
}

function onScanSuccess(decodedText) {
  if (enviando) return;
  if (!decodedText || decodedText.trim() === "") return; // evita código vazio

  input.value = decodedText.trim();
  emitirBip();
  enviando = true;

  setTimeout(() => {
    form.requestSubmit();
    setTimeout(() => {
      enviando = false;
    }, 1000);
  }, 300);
}

const html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: 250 }
);
html5QrcodeScanner.render(onScanSuccess);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Valida que o código não está vazio antes de enviar
  const codigo = input.value.trim();
  if (!codigo) {
    document.getElementById("resposta").innerText = "Código vazio. Por favor, tente novamente.";
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  try {
    const resposta = await fetch("https://webhook.ton618.cloud/webhook/bip-pecas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await resposta.json();
    document.getElementById("resposta").innerText = json.mensagem || "Enviado!";

    form.querySelector('#codigo').value = "";

  } catch (err) {
    document.getElementById("resposta").innerText = "Erro ao enviar!";
    console.error("Erro no envio:", err);
  }
});
