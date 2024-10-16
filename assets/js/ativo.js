document.addEventListener("DOMContentLoaded", function () {
  const ativoNomeInput = document.getElementById("ativo-nome");
  const suggestionsList = document.getElementById("suggestions");
  const precoAtualInput = document.getElementById("ativo-preco-atual");
  const salvarAtivoBtn = document.getElementById("salvar-ativo");
  const traderContainer = document.getElementById("trader-container");
  const modalElement = document.querySelector("#modal1");
  const modalInstance = M.Modal.getInstance(modalElement); // Inicializando o modal

  let ativos = [];
  let ativoEditando = null; // Para rastrear se estamos editando um ativo

  // Função para adicionar sugestão de ativo e buscar o preço atual
  ativoNomeInput.addEventListener("input", function () {
    const query = ativoNomeInput.value;

    if (query.length > 2) {
      fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=89URNZWCG7CZPUBG`
      )
        .then((response) => response.json())
        .then((data) => {
          suggestionsList.innerHTML = "";
          data.bestMatches.forEach((stock) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${stock["1. symbol"]} - ${stock["2. name"]}`;
            listItem.addEventListener("click", function () {
              ativoNomeInput.value = stock["1. symbol"];
              suggestionsList.innerHTML = "";

              // Busca o preço atual
              fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock["1. symbol"]}&apikey=89URNZWCG7CZPUBG`
              )
                .then((response) => response.json())
                .then((priceData) => {
                  const price = priceData["Global Quote"]["05. price"];
                  precoAtualInput.value = parseFloat(price).toFixed(2); // Preenche o campo "Preço Atual"
                });
            });
            suggestionsList.appendChild(listItem);
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar sugestões de ativos:", error);
        });
    }
  });

  // Função para salvar o ativo
  salvarAtivoBtn.addEventListener("click", function () {
    const nomeAtivo = ativoNomeInput.value;
    const quantidade = document.getElementById("ativo-quantidade").value;
    const preco = document.getElementById("ativo-preco").value;
    const precoAtual = precoAtualInput.value;

    if (nomeAtivo && quantidade && preco && precoAtual) {
      if (ativoEditando !== null) {
        // Atualizar ativo existente
        ativos[ativoEditando] = {
          nome: nomeAtivo,
          quantidade: quantidade,
          preco: preco,
          precoAtual: precoAtual,
        };
      } else {
        // Adiciona novo ativo
        const novoAtivo = {
          nome: nomeAtivo,
          quantidade: quantidade,
          preco: preco,
          precoAtual: precoAtual,
        };
        ativos.push(novoAtivo);
      }

      atualizarListaAtivos();
      document.getElementById("ativo-form").reset();
      ativoEditando = null; // Limpa o estado de edição

      modalInstance.close(); // Fecha o modal
    } else {
      alert("Por favor, preencha todos os campos antes de salvar.");
    }
  });

  // Função para atualizar a exibição dos ativos na UI
  function atualizarListaAtivos() {
    const rows = ativos
      .map((ativo, index) => {
        return `
           <div class="container trader-row">
              <div class="col s2">${ativo.nome}</div>
              <div class="col s2">${ativo.quantidade}</div>
              <div class="col s2">R$ ${parseFloat(ativo.preco).toFixed(2)}</div>
              <div class="col s2">R$ ${parseFloat(ativo.precoAtual).toFixed(
                2
              )}</div>
              <div class="col s2">R$ ${(ativo.quantidade * ativo.preco).toFixed(
                2
              )}</div>
              <div class="col s2">
                 <button class="btn blue" onclick="editarAtivo(${index})">  <i class="material-icons">edit</i> </button>
                 <button class="btn red" onclick="removerAtivo(${index})">  <i class="material-icons">delete_forever</i> </button>
              </div>
           </div>
        `;
      })
      .join("");
    traderContainer.innerHTML = `
        <div class="container trader-header">
           <div class="col s2"><span>Ativo</span></div>
           <div class="col s2"><span>Quantidade</span></div>
           <div class="col s2"><span>Preço em R$</span></div>
           <div class="col s2"><span>Preço Atual</span></div>
           <div class="col s2"><span>Saldo</span></div>
           <div class="col s2"><span> &nbsp; </span></div>
        </div>
        ${rows}
     `;
  }

  // Função para remover um ativo
  window.removerAtivo = function (index) {
    ativos.splice(index, 1);
    atualizarListaAtivos();
  };

  // Função para editar um ativo
  window.editarAtivo = function (index) {
    const ativo = ativos[index];
    ativoNomeInput.value = ativo.nome;
    document.getElementById("ativo-quantidade").value = ativo.quantidade;
    document.getElementById("ativo-preco").value = ativo.preco;
    precoAtualInput.value = ativo.precoAtual;

    ativoEditando = index; // Definir o índice para saber que estamos editando

    M.updateTextFields(); // Atualizar os campos de texto no Materialize
    modalInstance.open(); // Abrir o modal para edição
  };
});
