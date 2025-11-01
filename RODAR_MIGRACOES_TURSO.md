# 🗄️ Rodar Migrações no Turso

## 🎯 Objetivo:
Criar todas as tabelas no banco de dados Turso em produção.

---

## 📝 Método 1: Via Drizzle Kit (Recomendado)

### Passo 1: Instalar Drizzle Kit (se ainda não tiver)
```bash
npm install -g drizzle-kit
```

### Passo 2: Criar arquivo .env.local com credenciais do Turso
Crie um arquivo `.env.local` na raiz do projeto com:

```env
DATABASE_URL=libsql://cepin-johnlns.aws-us-west-2.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### Passo 3: Rodar as migrações
```bash
cd C:\Users\lenno\academia-infantil
npx drizzle-kit push
```

**OU se tiver instalado globalmente:**
```bash
drizzle-kit push
```

---

## 📝 Método 2: Via SQL direto no Turso CLI

### Passo 1: Instalar Turso CLI
```bash
npm install -g @turso/cli
```

### Passo 2: Fazer login
```bash
turso auth login
```

### Passo 3: Conectar ao banco
```bash
turso db shell cepin-johnlns
```

### Passo 4: Executar schema manualmente
Copie e cole cada CREATE TABLE do arquivo `src/server/db/schema.ts`

---

## 📝 Método 3: Via Drizzle Studio (Visual)

### Passo 1: Abrir Drizzle Studio
```bash
cd C:\Users\lenno\academia-infantil
npx drizzle-kit studio
```

### Passo 2: Conectar ao Turso
- Configure as variáveis de ambiente
- Visualize e crie as tabelas

---

## ✅ Método Mais Fácil: Push via NPM Script

### Se você tem o script configurado no package.json:

```bash
npm run db:push
```

**OU**

```bash
npm run db:migrate
```

---

## 🎯 Recomendação:

**Use o Método 1** - é mais rápido e seguro!

Depois de rodar as migrações:
1. ✅ Tabelas serão criadas no Turso
2. ✅ O erro "no such table" vai sumir
3. ✅ Você poderá fazer login no sistema

---

## 📋 Checklist:

- [ ] Criar arquivo `.env.local` com credenciais do Turso
- [ ] Rodar `npx drizzle-kit push`
- [ ] Verificar se as tabelas foram criadas
- [ ] Testar login no site

---

**Quer tentar o Método 1 agora?**

