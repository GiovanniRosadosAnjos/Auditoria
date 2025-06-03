const msal = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

async function getToken() {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return result.accessToken;
}

async function getGraphClient() {
  const token = await getToken();

  const client = Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });

  return client;
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const client = await getGraphClient();

      const workbookId = process.env.WORKBOOK_ID;
      const sheetName = 'Empresa';

      const response = await client
        .api(`/me/drive/items/${workbookId}/workbook/worksheets('${sheetName}')/usedRange`)
        .get();

      const values = response.values;

      const empresas = values.slice(1).map((row) => ({
        ID: row[0],
        Revisao: row[1],
        NomeFantasia: row[2],
        Razao: row[3],
      }));

      res.status(200).json(empresas);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro ao buscar dados do Excel' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};

