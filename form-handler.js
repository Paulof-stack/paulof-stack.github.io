const form = document.getElementById('bipForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const resposta = await fetch("https://webhook.ton618.cloud/webhook/bip-pecas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await resposta.json();
  document.getElementById("resposta").innerText = json.mensagem || "Enviado!";
  form.reset();
});
