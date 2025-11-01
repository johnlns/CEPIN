# ⚡ Quick Start - Deploy Rápido

## 🎯 Objetivo
Colocar o sistema CEPIN online em menos de 1 hora!

## 📋 Pré-requisitos
- [ ] Conta GitHub
- [ ] Conta Vercel (grátis)
- [ ] Conta Turso (grátis)
- [ ] Conta Resend (grátis)

## 🚀 Passo a Passo (30 minutos)

### 1️⃣ Preparar o Código (5 min)

```bash
# 1. Commit e push para GitHub
git add .
git commit -m "Sistema pronto para deploy"
git push origin main
```

### 2️⃣ Configurar Turso (10 min)

1. Acesse https://turso.tech
2. Crie uma conta (grátis)
3. Crie um novo database
4. Copie a URL de conexão
5. Copie o token de autenticação

### 3️⃣ Configurar Resend (10 min)

1. Acesse https://resend.com
2. Crie uma conta (grátis)
3. Vá em "API Keys"
4. Crie uma nova API key
5. Copie a chave

### 4️⃣ Deploy na Vercel (5 min)

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Importe seu repositório GitHub
4. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=libsql://seu-database.turso.io
   TURSO_AUTH_TOKEN=seu-token
   RESEND_API_KEY=re_seu-api-key
   EMAIL_FROM=noreply@seudominio.com
   APP_URL=https://seu-projeto.vercel.app
   NODE_ENV=production
   ```
5. Clique em "Deploy"

### 5️⃣ Executar Migrations

Após o deploy, execute as migrations:

```bash
# Via Vercel CLI
vercel exec -- npm run db:migrate

# Ou via terminal local
DATABASE_URL=libsql://seu-database.turso.io \
TURSO_AUTH_TOKEN=seu-token \
npm run db:migrate
```

## ✅ Testar

1. Acesse: https://seu-projeto.vercel.app
2. Teste login: admin@academiainfantil.com
3. Verifique se o OTP chega no email
4. Teste matrícula pública
5. Teste agendamento experimental

## 🎉 Pronto!

Seu sistema está online e funcionando!

## 📊 Monitoramento

- **Logs**: Vercel Dashboard → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Database**: Turso Dashboard

## 🔧 Troubleshooting

### Erro: "Database connection failed"
- Verifique DATABASE_URL e TURSO_AUTH_TOKEN
- Execute migrations novamente

### Erro: "Email not sent"
- Verifique RESEND_API_KEY
- Confirme domínio verificado no Resend

### Erro: "Build failed"
- Verifique logs na Vercel
- Confirme que todas as variáveis estão configuradas

## 💡 Dicas

1. **Use domínio customizado**: Adicione seu domínio na Vercel
2. **Configure backups**: Turso tem backup automático
3. **Monitore logs**: Acompanhe erros em tempo real
4. **Teste regularmente**: Faça testes semanais

## 🆘 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Turso Docs**: https://docs.turso.tech
- **Resend Docs**: https://resend.com/docs

## 📈 Próximos Passos

1. Configurar domínio customizado
2. Adicionar analytics
3. Configurar backups automáticos
4. Implementar CI/CD
5. Adicionar testes automatizados

---

**Tempo total**: ~30 minutos
**Custo**: R$ 0 (gratuito)
**Resultado**: Sistema online e funcionando! 🎉


