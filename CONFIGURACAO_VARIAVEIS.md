# 🔧 Configuração de Variáveis de Ambiente

## 📝 Passo 2: Configurar Variáveis de Ambiente

### Opção 1: Criar arquivo `.env.local` (para desenvolvimento)

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# ============================================
# BANCO DE DADOS - TURSO
# ============================================
DATABASE_URL=libsql://seu-database.turso.io
DATABASE_AUTH_TOKEN=seu-token-aqui

# ============================================
# EMAIL - RESEND
# ============================================
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_sua-api-key-aqui

# ============================================
# APLICAÇÃO
# ============================================
APP_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# SEGURANÇA
# ============================================
NEXTAUTH_SECRET=dev-secret-dev-secret-dev-secret-dev-secret-123456
```

### Opção 2: Configurar na Vercel (para produção)

#### Passo 1: Acesse o Dashboard da Vercel

1. Acesse https://vercel.com
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

#### Passo 2: Adicione as Variáveis de Ambiente

1. Vá em **Settings** → **Environment Variables**
2. Clique em **Add New**
3. Adicione cada variável uma por uma:

##### Banco de Dados (Turso)

```
Name: DATABASE_URL
Value: libsql://seu-database.turso.io
Environment: Production, Preview, Development
```

```
Name: DATABASE_AUTH_TOKEN
Value: seu-token-aqui
Environment: Production, Preview, Development
```

##### Email (Resend)

```
Name: SMTP_HOST
Value: smtp.resend.com
Environment: Production, Preview, Development
```

```
Name: SMTP_PORT
Value: 465
Environment: Production, Preview, Development
```

```
Name: SMTP_USER
Value: resend
Environment: Production, Preview, Development
```

```
Name: SMTP_PASS
Value: re_sua-api-key-aqui
Environment: Production, Preview, Development
```

##### Aplicação

```
Name: APP_URL
Value: https://seu-projeto.vercel.app
Environment: Production, Preview, Development
```

```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

##### Segurança

```
Name: NEXTAUTH_SECRET
Value: seu-secret-aleatorio-aqui-com-pelo-menos-32-caracteres
Environment: Production, Preview, Development
```

## 🔑 Como Obter os Valores

### Turso (Banco de Dados)

1. Acesse https://turso.tech
2. Faça login
3. Selecione seu database
4. Clique em **Connect**
5. Copie a URL (DATABASE_URL)
6. Copie o Auth Token (DATABASE_AUTH_TOKEN)

### Resend (Email)

1. Acesse https://resend.com
2. Faça login
3. Vá em **API Keys**
4. Clique em **Create API Key**
5. Dê um nome (ex: "CEPIN Production")
6. Copie a chave (SMTP_PASS)

### Gerar NEXTAUTH_SECRET

1. Acesse https://generate-secret.vercel.app/32
2. Copie o secret gerado
3. Use como NEXTAUTH_SECRET

## ✅ Checklist

- [ ] DATABASE_URL configurado
- [ ] DATABASE_AUTH_TOKEN configurado
- [ ] SMTP_HOST configurado
- [ ] SMTP_PORT configurado
- [ ] SMTP_USER configurado
- [ ] SMTP_PASS configurado
- [ ] APP_URL configurado
- [ ] NODE_ENV configurado
- [ ] NEXTAUTH_SECRET configurado

## 🚀 Próximo Passo

Após configurar todas as variáveis, vá para o **Passo 3: Deploy na Vercel**


