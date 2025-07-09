const input = document.getElementById("codigo");
const form = document.getElementById("bipForm");
const respostaEl = document.getElementById("resposta");
const contadorEl = document.getElementById("contadorEntradas");

let enviando = false;
let totalEntradas = 0;

// 🔊 Bip de sucesso
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

// 🔊 Bip de erro (grave)
function emitirErro() {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(300, context.currentTime);
  gainNode.gain.setValueAtTime(0.2, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    context.close();
  }, 300);
}

// 📷 Quando QR code for lido
function onScanSuccess(decodedText) {
  if (enviando) return;
  if (!decodedText || decodedText.trim() === "") return;

  input.value = decodedText.trim();
  emitirBip(); // bip imediato

  enviando = true;
  setTimeout(() => {
    form.requestSubmit();
    setTimeout(() => {
      enviando = false;
    }, 500);
  }, 100);
}

const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);

// 📤 Ao enviar formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const codigo = input.value.trim();
  if (!codigo) {
    respostaEl.innerText = "Código vazio. Por favor, tente novamente.";
    respostaEl.style.color = "red";
    emitirErro();
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  // ⚡ Feedback imediato
  respostaEl.innerText = "Enviando...";
  respostaEl.style.color = "gray";

  try {
    const resposta = await fetch("https://webhook.ton618.cloud/webhook/bip-pecas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await resposta.json();

    respostaEl.innerText = json.mensagem || "OK!";
    respostaEl.style.color = "green";

    if (data.status === "Entrada") {
      totalEntradas++;
      contadorEl.innerText = totalEntradas;
    }

    input.value = "";

    setTimeout(() => {
      respostaEl.innerText = "";
    }, 800);

  } catch (err) {
    respostaEl.innerText = "Erro";
    respostaEl.style.color = "red";
    emitirErro();
    console.error("Erro no envio:", err);
  }
});
