// Seleciona o botão de adicionar ativo e o container onde as novas linhas serão adicionadas
const addAtivoBtn = document.getElementById("add-ativo-btn");
const traderContainer = document.getElementById("trader-container");

// Função que cria uma nova linha de ativo
function adicionarNovaLinha() {
  const novaLinha = document.createElement("div");
  novaLinha.classList.add("trader", "col", "s10", "trader-row");

  // Linha de entrada com os dados
  novaLinha.innerHTML = `
        <div class="col s2"><input type="text" placeholder="Ativo" /></div>
        <div class="col s2"><input type="number" placeholder="Quantidade" /></div>
        <div class="col s2"><input type="text" placeholder="Preço em R$" class="preco" /></div>
        <div class="col s2"><input type="text" placeholder="Preço Médio" class="preco" /></div>
        <div class="col s2"><input type="text" placeholder="Preço Atual" class="preco" /></div>
        <div class="col s2"><input type="text" placeholder="Saldo" class="preco" disabled /></div>
    `;

  const botoesAcoes = document.createElement("div");
  botoesAcoes.classList.add("trader-btn", "col", "s2");

  botoesAcoes.innerHTML = `
        <a class="waves-effect waves-light btn green"><i class="material-icons">create</i></a>
        <a class="waves-effect waves-light btn red"><i class="material-icons">delete</i></a>
        <a class="waves-effect waves-light btn blue" style="display:none;"><i class="material-icons">check</i></a>
    `;

  const habilitarEdicao = () => {
    const inputs = novaLinha.querySelectorAll("input");
    inputs.forEach((input) => (input.disabled = false)); // Habilita os inputs
    botoesAcoes.querySelector(".blue").style.display = "inline-block"; // Mostra o botão de check
  };

  const confirmarLinha = () => {
    const inputs = novaLinha.querySelectorAll("input");
    const quantidade = parseFloat(inputs[1].value); // Índice 1 é para "Quantidade"
    const precoAtual = parseFloat(inputs[4].value.replace(/[^\d.-]/g, "")); // Remove a máscara
    const saldo = quantidade * precoAtual;
    inputs[5].value = saldo.toFixed(2); // Índice 5 é para "Saldo"
    inputs.forEach((input) => (input.disabled = true)); // Desabilita os inputs
    botoesAcoes.querySelector(".blue").style.display = "none"; // Esconde o botão de check
  };

  const deletarLinha = () => {
    novaLinha.remove(); // Remove a linha de dados
    botoesAcoes.remove(); // Remove o container dos botões de ação
  };

  botoesAcoes
    .querySelector(".green")
    .addEventListener("click", habilitarEdicao);
  botoesAcoes.querySelector(".blue").addEventListener("click", confirmarLinha);
  botoesAcoes.querySelector(".red").addEventListener("click", deletarLinha);

  traderContainer.appendChild(novaLinha);
  traderContainer.appendChild(botoesAcoes);
}

// Função para aplicar a máscara R$
function aplicarMascaraMoeda(event) {
  let valor = event.target.value;
  valor = valor.replace(/\D/g, "");
  valor = (valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  event.target.value = valor; // Atualiza o valor do campo
}

// Adiciona o evento de input a todos os campos com a classe "preco"
document.querySelectorAll(".preco").forEach((input) => {
  input.addEventListener("input", aplicarMascaraMoeda);
});

// Adiciona o evento de clique ao botão "Adicionar Ativo"
addAtivoBtn.addEventListener("click", adicionarNovaLinha);
