# 🔑 Como Obter os Valores das Variáveis de Ambiente

## 1️⃣ BANCO DE DADOS (Turso)

### Onde obter:
🌐 **Turso Dashboard**: https://turso.tech

### Passos:
1. Acesse https://turso.tech e faça login
2. Clique no seu database (ex: `cepindb`)
3. Clique em **"Connect"** ou **"Connect to your database"**
4. Você verá duas opções:
   - **Turso CLI** (linha de comando)
   - **Connection string** (URL de conexão)

### Para DATABASE_URL:
```
Exemplo: libsql://cepindb-lenno.turso.io
```
- Use o **Connection string** da seção "Turso CLI"
- Copie a URL que começa com `libsql://`

### Para DATABASE_AUTH_TOKEN:
```
Exemplo: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```
- No mesmo painel "Connect", procure por **"Auth Token"**
- Clique em **"Show"** ou **"Copy"**
- Copie o token (é uma string longa)

---

## 2️⃣ EMAIL (Resend)

### Onde obter:
🌐 **Resend Dashboard**: https://resend.com

### Passos:
1. Acesse https://resend.com e faça login
2. No menu lateral, clique em **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome: `CEPIN Production`
5. Selecione as permissões:
   - ✅ Send email
   - ✅ Read domains
6. Clique em **"Create"**
7. **IMPORTANTE**: Copie a chave imediatamente (ela não aparecerá de novo!)

### Para SMTP_PASS:
```
Exemplo: re_AbCdEf1234567890GhIjKlMnOpQrStUvWxYz
```
- Use a API Key que você acabou de criar
- Ela começa com `re_`

### Para SMTP_HOST:
```
Valor: smtp.resend.com
```
- Este é um valor fixo, não precisa buscar

### Para SMTP_PORT:
```
Valor: 465
```
- Este é um valor fixo

### Para SMTP_USER:
```
Valor: resend
```
- Este é um valor fixo

---

## 3️⃣ APLICAÇÃO

### Para APP_URL:
```
Valor inicial: https://cepin.vercel.app
```
- Use o domínio que a Vercel fornecerá após o deploy
- Se for outro domínio, use: `https://seu-dominio.com`

### Para NODE_ENV:
```
Valor: production
```
- Este é um valor fixo

---

## 4️⃣ SEGURANÇA (NEXTAUTH_SECRET)

### Onde gerar:
🌐 **Secret Generator**: https://generate-secret.vercel.app/32

### Passos:
1. Acesse https://generate-secret.vercel.app/32
2. Clique em **"Generate Secret"**
3. Copie o secret gerado (tem 32 caracteres)

### Para NEXTAUTH_SECRET:
```
Exemplo: abc123def456ghi789jkl012mno345pqr678
```
- Use o secret gerado
- Deve ter pelo menos 32 caracteres

---

## ✅ Checklist Final

Antes de fazer o deploy, certifique-se de ter:

- [ ] **DATABASE_URL**: URL do Turso (começa com `libsql://`)
- [ ] **DATABASE_AUTH_TOKEN**: Token do Turso
- [ ] **SMTP_HOST**: `smtp.resend.com`
- [ ] **SMTP_PORT**: `465`
- [ ] **SMTP_USER**: `resend`
- [ ] **SMTP_PASS**: API Key do Resend (começa com `re_`)
- [ ] **APP_URL**: Domínio da Vercel (atualize depois do deploy)
- [ ] **NODE_ENV**: `production`
- [ ] **NEXTAUTH_SECRET**: Secret aleatório de 32 caracteres

