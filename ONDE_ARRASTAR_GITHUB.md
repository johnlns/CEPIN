# 📤 Onde Arrastar os Arquivos no GitHub

## 🎯 Passo a Passo Visual

### 1️⃣ Acesse o repositório vazio
- URL: https://github.com/johnlns/CEPIN
- Você verá uma tela assim:

```
Quick setup — if you've done this kind of thing before

Get started by creating a new file or uploading an existing file.
We recommend every repository include a README, LICENSE, and .gitignore.

[Create new file] [Upload files]

…or create a new repository on the command line
…or push an existing repository from the command line
```

### 2️⃣ Clique em "Upload files"
- Procure pelo botão **"Upload files"**
- Ou clique no link **"uploading an existing file"**

### 3️⃣ Você verá a área de upload
Aparecerá uma tela com:

```
┌─────────────────────────────────────────┐
│                                         │
│    Drag files here to add them to      │
│         your repository                 │
│                                         │
│         or choose your files           │
│                                         │
└─────────────────────────────────────────┘

Drag additional files here to add them to your repository
```

### 4️⃣ AQUI é onde você arrasta!
- **Área grande** com texto "Drag files here"
- **OU** clique em "choose your files"

---

## 📁 Preparar os arquivos ANTES de arrastar

### No Windows Explorer:
1. **Abra** o Explorador de Arquivos
2. **Navegue** para: `C:\Users\lenno\academia-infantil`
3. **ENTRE** na pasta `academia-infantil`
4. **Você deve ver**:
   ```
   📁 src
   📁 node_modules
   📄 package.json
   📄 next.config.js
   📄 tailwind.config.ts
   📄 tsconfig.json
   📄 drizzle.config.ts
   📄 postcss.config.js
   📄 README.md
   📄 dev.db
   ```

### Selecionar arquivos:
1. **Clique** na pasta `src` (segure Ctrl)
2. **Clique** em `package.json` (ainda segurando Ctrl)
3. **Clique** em `next.config.js` (ainda segurando Ctrl)
4. **Continue** selecionando:
   - `tailwind.config.ts`
   - `tsconfig.json`
   - `drizzle.config.ts`
   - `postcss.config.js`
   - `README.md`

### ❌ NÃO selecionar:
- `node_modules` (muito grande)
- `dev.db` (banco local)
- `.next` (se existir)

---

## 🖱️ Arrastar para o GitHub

### Método 1: Arrastar
1. **Selecione** todos os arquivos (como acima)
2. **Arraste** da janela do Windows Explorer
3. **Solte** na área "Drag files here" do GitHub

### Método 2: Escolher arquivos
1. **Clique** em "choose your files" no GitHub
2. **Selecione** todos os arquivos na janela que abrir
3. **Clique** em "Abrir"

---

## ✍️ Fazer o commit

Após o upload, você verá:

```
Commit changes

Add files via upload

[Text box for commit message]

○ Commit directly to the main branch
○ Create a new branch for this commit and start a pull request

[Commit changes]
```

### Preencher:
1. **Apague** o texto padrão
2. **Escreva**: `Initial commit - Sistema CEPIN`
3. **Deixe** marcado "Commit directly to the main branch"
4. **Clique** em "Commit changes"

---

## ✅ Resultado esperado

Após o commit, você verá:
```
📁 src
📄 package.json
📄 next.config.js
📄 tailwind.config.ts
📄 tsconfig.json
📄 drizzle.config.ts
📄 postcss.config.js
📄 README.md
```

**Agora está pronto para o deploy na Vercel!**

