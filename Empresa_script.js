// empresa_script.js (integrado com MSAL.js)

// 1️⃣ Importar MSAL.js no HTML:
// <script src="https://alcdn.msauth.net/browser/2.34.0/js/msal-browser.min.js"></script>
// <script src="empresa_script.js"></script>

// 2️⃣ Configuração do MSAL.js
const msalConfig = {
  auth: {
    clientId: "4c77ad19-c4b5-4f57-8c58-85410895d5c9", // substitua pelo seu ID do app
    authority: "https://login.microsoftonline.com/cbc1c935-f23d-4266-9a16-53f2c6f7a8a1", // substitua pelo seu ID do tenant
    redirectUri: "https://https://auditoria-three.vercel.app/" // substitua pelo seu domínio no Vercel
  },
  cache: {
    cacheLocation: "sessionStorage", // ou localStorage
    storeAuthStateInCookie: false
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// 3️⃣ Função de login
async function signIn() {
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ["Files.ReadWrite"] // ou outras permissões necessárias
    });

    console.log("Login realizado com sucesso!", loginResponse);

    // Após o login bem-sucedido, carregue os dados da tabela
    carregarEmpresas();
  } catch (error) {
    console.error("Erro no login:", error);
  }
}

// 4️⃣ Função para buscar dados da API e exibir na tabela
async function carregarEmpresas() {
  try {
    const resposta = await fetch('http://localhost:3000/api/empresas');
    const empresas = await resposta.json();

    const tabela = document.getElementById('tabela-empresas');
    tabela.innerHTML = '';

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

// 5️⃣ Executar login na inicialização
window.onload = () => {
  signIn();
};
