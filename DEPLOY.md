# 🚀 Guia de Deploy - Sistema CEPIN

## 📋 Checklist de Implementação

### 1. ✅ Banco de Dados
- [x] Schema criado (Drizzle ORM)
- [x] Migrations configuradas
- [ ] Configurar Turso (produção) ou SQLite (desenvolvimento)
- [ ] Executar migrations em produção

### 2. ✅ Variáveis de Ambiente
- [ ] Criar arquivo `.env.production`
- [ ] Configurar DATABASE_URL
- [ ] Configurar APP_URL
- [ ] Configurar email service

### 3. ✅ Deploy
- [ ] Criar conta na Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Deploy automático

### 4. ✅ Email Service
- [ ] Configurar Resend ou SendGrid
- [ ] Testar envio de OTP
- [ ] Configurar templates de email

### 5. ✅ Testes
- [ ] Testar login/logout
- [ ] Testar matrículas públicas
- [ ] Testar agendamentos experimentais
- [ ] Testar painel admin

## 🔧 Configuração Passo a Passo

### Passo 1: Banco de Dados (Turso)

1. Criar conta em https://turso.tech
2. Criar database
3. Obter URL de conexão
4. Adicionar ao `.env.production`:
   ```
   DATABASE_URL=libsql://seu-database.turso.io
   TURSO_AUTH_TOKEN=seu-token-aqui
   ```

### Passo 2: Email Service (Resend)

1. Criar conta em https://resend.com
2. Verificar domínio
3. Obter API key
4. Adicionar ao `.env.production`:
   ```
   RESEND_API_KEY=re_seu-api-key
   EMAIL_FROM=noreply@seudominio.com
   ```

### Passo 3: Deploy na Vercel

1. Criar conta em https://vercel.com
2. Importar projeto do GitHub
3. Configurar Build Settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Adicionar variáveis de ambiente
5. Deploy!

### Passo 4: Configurar Domínio

1. Adicionar domínio na Vercel
2. Configurar DNS:
   - A Record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com
3. Aguardar propagação (24-48h)

## 📝 Arquivos Necessários

### `.env.production`
```env
# Database
DATABASE_URL=libsql://seu-database.turso.io
TURSO_AUTH_TOKEN=seu-token

# App
APP_URL=https://seu-dominio.com
NODE_ENV=production

# Email
RESEND_API_KEY=re_seu-api-key
EMAIL_FROM=noreply@seudominio.com

# Auth
SESSION_SECRET=seu-secret-aleatorio-aqui
```

### `vercel.json` (opcional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"]
}
```

## 🧪 Testes

### Checklist de Testes
- [ ] Login com OTP funciona
- [ ] Logout funciona
- [ ] Matrículas públicas são salvas
- [ ] Agendamentos experimentais são salvos
- [ ] Painel admin acessível
- [ ] Solicitações aparecem no admin
- [ ] Email de OTP é enviado
- [ ] Responsive funciona em mobile

## 🐛 Troubleshooting

### Problema: Banco de dados não conecta
**Solução**: Verificar DATABASE_URL e TURSO_AUTH_TOKEN

### Problema: Email não envia
**Solução**: Verificar RESEND_API_KEY e domínio verificado

### Problema: Build falha
**Solução**: Verificar logs na Vercel e variáveis de ambiente

## 📊 Monitoramento

### Vercel Analytics
- Configurar Vercel Analytics
- Monitorar performance
- Acompanhar erros

### Logs
- Verificar logs na Vercel
- Monitorar erros em produção
- Configurar alertas

## 🔐 Segurança

### Checklist de Segurança
- [ ] HTTPS habilitado
- [ ] Variáveis sensíveis em .env
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Headers de segurança configurados

## 📈 Próximos Passos

1. **Fase 1**: Deploy básico (1-2 dias)
2. **Fase 2**: Testes e ajustes (2-3 dias)
3. **Fase 3**: Otimizações (1-2 dias)
4. **Fase 4**: Produção (contínuo)

## 💰 Custos Estimados

- **Vercel**: Gratuito (hobby plan)
- **Turso**: Gratuito até 500MB
- **Resend**: Gratuito até 3.000 emails/mês
- **Domínio**: ~R$ 30/ano

**Total**: ~R$ 30/ano (ou gratuito sem domínio customizado)

## 🎯 Objetivo Final

Sistema CEPIN rodando em:
- ✅ https://cepin.vercel.app (gratuito)
- ✅ https://cepin.com.br (com domínio)

Tempo estimado: 3-5 dias


