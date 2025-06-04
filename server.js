// server.js (API backend com Node.js + Express)
const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const cors = require('cors');

const app = express();
app.use(express.json());

// 🛡️ Ajuste o CORS para o domínio do front-end hospedado no Vercel
app.use(cors({
  origin: 'https://auditoria-three.vercel.app',
  credentials: true
}));

// 🔑 Configuração do Passport para autenticação via token
const options = {
  identityMetadata: `https://login.microsoftonline.com/cbc1c935-f23d-4266-9a16-53f2c6f7a8a1/v2.0/.well-known/openid-configuration`,
  clientID: '4c77ad19-c4b5-4f57-8c58-85410895d5c9',
  validateIssuer: true,
  issuer: `https://sts.windows.net/cbc1c935-f23d-4266-9a16-53f2c6f7a8a1/`,
  loggingLevel: 'info',
  passReqToCallback: false
};

passport.use(new BearerStrategy(options, (token, done) => {
  // Token válido -> continue
  done(null, {}, token);
}));

app.use(passport.initialize());

// 📦 Rota protegida
app.get('/api/empresas',
  passport.authenticate('oauth-bearer', { session: false }),
  (req, res) => {
    // Dados de exemplo
    const empresas = [
      { ID: 1, Revisao: 'A', NomeFantasia: 'Empresa 1', Razao: 'Empresa 1 Ltda' },
      { ID: 2, Revisao: 'B', NomeFantasia: 'Empresa 2', Razao: 'Empresa 2 SA' }
    ];

    res.json(empresas);
  }
);

// 🚀 Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
