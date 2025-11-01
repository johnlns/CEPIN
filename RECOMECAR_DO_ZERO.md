# 🔄 Recomeçar Deploy do Zero

## 🎯 Passo a Passo Completo

### 1️⃣ Limpar o repositório GitHub

#### Acesse seu repositório:
- URL: https://github.com/johnlns/CEPIN

#### Deletar arquivos existentes:
1. **Clique** em cada arquivo/pasta na lista
2. **Clique** no ícone da **lixeira** (🗑️) no canto superior direito
3. **Escreva** uma mensagem: "Limpando repositório"
4. **Clique** em "Commit changes"
5. **Repita** para todos os arquivos até o repositório ficar vazio

#### OU (mais rápido):
1. **Clique** no botão **"Settings"** (no menu do repositório)
2. **Role** até o final da página
3. **Clique** em **"Delete this repository"**
4. **Digite**: `johnlns/CEPIN` para confirmar
5. **Clique** em "I understand the consequences, delete this repository"

---

### 2️⃣ Criar novo repositório (se deletou o anterior)

#### Se deletou o repositório:
1. **Acesse**: https://github.com/new
2. **Nome**: `CEPIN`
3. **Descrição**: `Sistema de Academia Infantil`
4. **Público** ou **Privado** (sua escolha)
5. **NÃO** marque "Add a README file"
6. **Clique** em "Create repository"

---

### 3️⃣ Upload correto dos arquivos

#### Preparar arquivos no Windows:
1. **Abra** o Explorador de Arquivos
2. **Navegue** para: `C:\Users\lenno\academia-infantil`
3. **Entre** na pasta `academia-infantil`
4. **Selecione** APENAS o conteúdo (não a pasta inteira):

#### ✅ Arquivos para selecionar:
- 📁 `src` (pasta completa)
- 📄 `package.json`
- 📄 `package-lock.json`
- 📄 `next.config.js`
- 📄 `tailwind.config.ts`
- 📄 `tsconfig.json`
- 📄 `drizzle.config.ts`
- 📄 `postcss.config.js`
- 📄 `README.md`

#### ❌ NÃO selecionar:
- 📁 `node_modules` (muito grande)
- 📁 `.next` (cache)
- 📄 `dev.db` (banco local)

#### Upload para GitHub:
1. **Volte** para o repositório GitHub vazio
2. **Clique** em "uploading an existing file"
3. **Arraste** todos os arquivos selecionados
4. **Aguarde** o upload terminar
5. **Escreva**: "Initial commit - Sistema CEPIN"
6. **Clique** em "Commit changes"

---

### 4️⃣ Verificar estrutura correta

#### O repositório deve mostrar:
```
📁 src/
📄 package.json
📄 next.config.js
📄 tailwind.config.ts
📄 tsconfig.json
📄 drizzle.config.ts
📄 postcss.config.js
📄 README.md
```

#### ✅ Se clicar em `src/`, deve ver:
```
📁 app/
📁 components/
📁 lib/
📁 server/
📄 middleware.ts
```

---

### 5️⃣ Voltar para a Vercel

#### Acessar Vercel:
1. **Acesse**: https://vercel.com
2. **Faça login**
3. **Clique** em "Add New" → "Project"

#### Importar repositório:
1. **Procure** por `johnlns/CEPIN`
2. **Clique** em "Import"
3. **Configure** as variáveis de ambiente (mesmas de antes):

```
DATABASE_URL = libsql://cepin-johnlns.aws-us-west-2.turso.io
DATABASE_AUTH_TOKEN = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
SMTP_HOST = smtp.resend.com
SMTP_PORT = 465
SMTP_USER = resend
SMTP_PASS = re_4RNfJQ1M_Ay7JSEZMeXN5RoWd1TUMQtpa
APP_URL = https://cepin.vercel.app
NODE_ENV = production
NEXTAUTH_SECRET = 5b98d0201b3b17ca2a6e3ec2b35c2edc
```

4. **Clique** em "Deploy"

---

## 🚀 Resultado esperado:

- ✅ Build deve funcionar
- ✅ Deploy deve ser bem-sucedido
- ✅ Site deve ficar online

---

## 💡 Dica:

Se tiver dúvida em qualquer passo, me avise e eu te ajudo!

