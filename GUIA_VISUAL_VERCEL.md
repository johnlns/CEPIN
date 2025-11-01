# 🎯 Guia Visual - Configurar Variáveis na Vercel

## 📸 Passo a Passo com Screenshots

### 1️⃣ Acesse o Dashboard da Vercel

1. Vá para https://vercel.com
2. Faça login
3. Você verá sua dashboard

### 2️⃣ Selecione ou Crie um Projeto

#### Se já tem um projeto:
- Clique no projeto

#### Se ainda não tem:
1. Clique em **"Add New"** → **"Project"**
2. Importe seu repositório do GitHub
3. Clique em **"Import"**

### 3️⃣ Vá para Settings

1. No menu lateral, clique em **"Settings"**
2. Você verá várias opções no submenu

### 4️⃣ Acesse Environment Variables

1. Clique em **"Environment Variables"**
2. Você verá uma lista vazia (se for a primeira vez)

### 5️⃣ Adicione as Variáveis

Para cada variável, siga estes passos:

#### Variável 1: DATABASE_URL

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `DATABASE_URL`
   - **Value**: `libsql://seu-database.turso.io` (substitua pelo seu valor)
   - **Environment**: Marque todas as opções (Production, Preview, Development)
3. Clique em **"Save"**

#### Variável 2: DATABASE_AUTH_TOKEN

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `DATABASE_AUTH_TOKEN`
   - **Value**: Seu token do Turso
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 3: SMTP_HOST

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `SMTP_HOST`
   - **Value**: `smtp.resend.com`
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 4: SMTP_PORT

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `SMTP_PORT`
   - **Value**: `465`
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 5: SMTP_USER

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `SMTP_USER`
   - **Value**: `resend`
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 6: SMTP_PASS

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `SMTP_PASS`
   - **Value**: Sua API key do Resend (começa com `re_`)
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 7: APP_URL

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `APP_URL`
   - **Value**: `https://seu-projeto.vercel.app` (substitua pelo seu domínio)
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 8: NODE_ENV

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

#### Variável 9: NEXTAUTH_SECRET

1. Clique em **"Add New"**
2. Preencha:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: Um secret aleatório com pelo menos 32 caracteres
   - **Environment**: Marque todas as opções
3. Clique em **"Save"**

## ✅ Resultado Final

Você deve ter 9 variáveis configuradas:

```
✅ DATABASE_URL
✅ DATABASE_AUTH_TOKEN
✅ SMTP_HOST
✅ SMTP_PORT
✅ SMTP_USER
✅ SMTP_PASS
✅ APP_URL
✅ NODE_ENV
✅ NEXTAUTH_SECRET
```

## 🎯 Próximo Passo

Após configurar todas as variáveis, você está pronto para o **Passo 3: Deploy!

## 💡 Dica

Se você precisar editar uma variável depois:
1. Clique nos três pontinhos (...) ao lado da variável
2. Selecione **"Edit"**
3. Faça as alterações
4. Clique em **"Save"**


