// script.js (Empresa_script.js)

// Função para buscar dados da API e exibir na tabela
async function carregarEmpresas() {
  try {
    const resposta = await fetch('http://localhost:3000/api/empresas');
    const empresas = await resposta.json();

    const tabela = document.getElementById('tabela-empresas');
    tabela.innerHTML = ''; // Limpa a tabela antes de preencher

    empresas.forEach(empresa => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${empresa.ID}</td>
        <td>${empresa.Revisao}</td>
        <td>${empresa.NomeFantasia}</td>
        <td>${empresa.Razao}</td>
      `;

      tabela.appendChild(linha);
    });
  } catch (erro) {
    console.error('Erro ao carregar empresas:', erro);
  }
}

// Executa a função ao carregar a página
window.onload = carregarEmpresas;