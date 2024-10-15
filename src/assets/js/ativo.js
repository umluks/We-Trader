document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);

  // Pega os elementos
  const salvarAtivoBtn = document.getElementById("salvar-ativo");
  const traderContainer = document.getElementById("trader-container");

  // Adiciona evento de clique no botão salvar do modal
  salvarAtivoBtn.addEventListener("click", function () {
    // Pega os valores dos campos e converte para número
    const nomeAtivo = document.getElementById("ativo-nome").value;
    const quantidadeAtivo = parseInt(
      document.getElementById("ativo-quantidade").value
    );
    const precoAtivo = parseFloat(
      document.getElementById("ativo-preco").value.replace(",", ".")
    );
    const precoAtualAtivo = parseFloat(
      document.getElementById("ativo-preco-atual").value.replace(",", ".")
    );

    // Calcula o saldo
    const saldoAtivo = precoAtivo * quantidadeAtivo;

    // Formata os valores como moeda BRL
    const precoAtivoFormatado = precoAtivo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const precoAtualAtivoFormatado = precoAtualAtivo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const saldoAtivoFormatado = saldoAtivo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // Cria a nova linha com os dados formatados
    const novaLinha = `
          <div class="trader-row col s12">
             <div class="col s2">${nomeAtivo}</div>
             <div class="col s2">${quantidadeAtivo}</div>
             <div class="col s2">${precoAtivoFormatado}</div>
             <div class="col s2">${precoAtualAtivoFormatado}</div>
             <div class="col s2">${saldoAtivoFormatado}</div>
             <div class="trader-btn col s2">
                <a class="waves-effect waves-light btn green edit-ativo"><i class="material-icons">create</i></a>
                <a class="waves-effect waves-light btn red delete-ativo"><i class="material-icons">delete</i></a> <!-- Botão de exclusão -->
             </div>
          </div>
       `;

    // Adiciona a nova linha no container
    traderContainer.innerHTML += novaLinha;

    // Fecha o modal
    const modalInstance = M.Modal.getInstance(
      document.getElementById("modal1")
    );
    modalInstance.close();

    // Limpa os campos do modal
    document.getElementById("ativo-form").reset();

    // Adiciona o evento de clique para exclusão na nova linha
    const deleteButtons = traderContainer.querySelectorAll(".delete-ativo");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const confirmDelete = confirm(
          "Tem certeza que deseja excluir este ativo?"
        );
        if (confirmDelete) {
          const row = button.closest(".trader-row"); // Encontra a linha pai correta
          traderContainer.removeChild(row); // Remove a linha do container
        }
      });
    });
  });
});
