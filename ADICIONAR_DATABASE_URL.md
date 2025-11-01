# ➕ Adicionar DATABASE_URL no Vercel

## O que fazer:

1. Na tela da Vercel com as variáveis de ambiente
2. Clique em **"+ Adicionar mais"**
3. Preencha:
   - **Key**: `DATABASE_URL`
   - **Value**: (obtenha abaixo)
   - **Environment**: Marque todas as opções (Production, Preview, Development)

## Como obter o DATABASE_URL:

### Passo a Passo:
1. **Acesse**: https://turso.tech
2. **Login**: Faça login
3. **Selecione**: Seu database (`cepindb`)
4. **Clique**: Em **"Connect"**
5. **Procure**: Por "Connection string" ou "Turso CLI"
6. **Copie**: A URL que começa com `libsql://`

### Exemplo:
```
libsql://cepindb-lenno.turso.io
```

**IMPORTANTE**: 
- A URL começa com `libsql://`
- Não começa com `https://` nem `http://`
- É específica do Turso

---

## Depois de adicionar:

Você terá 10 variáveis no total:
✅ DATABASE_URL (NOVA)
✅ DATABASE_AUTH_TOKEN (precisa corrigir o valor)
✅ SMTP_HOST
✅ SMTP_PORT
✅ SMTP_USER
✅ SMTP_PASS
✅ APP_URL
✅ NODE_ENV
✅ NEXTAUTH_SECRET

