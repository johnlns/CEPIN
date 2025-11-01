# 📤 Passo a Passo: Upload para GitHub

## 🎯 Método Mais Fácil: Upload via Web

### 1️⃣ Acesse seu repositório
- URL: https://github.com/johnlns/CEPIN
- Você verá uma tela dizendo que está vazio

### 2️⃣ Prepare os arquivos
1. Abra o **Explorador de Arquivos** do Windows
2. Navegue até: `C:\Users\lenno\academia-infantil`
3. Selecione **TODOS** os arquivos e pastas:
   - Ctrl+A (selecionar tudo)
   - Ou selecione manualmente:
     - 📁 src/
     - 📁 node_modules/ (pode pular este)
     - 📄 package.json
     - 📄 package-lock.json
     - 📄 next.config.js
     - 📄 tailwind.config.ts
     - 📄 tsconfig.json
     - 📄 drizzle.config.ts
     - 📄 dev.db
     - 📄 README.md
     - E todos os outros arquivos

### 3️⃣ Upload no GitHub
1. **Volte** para https://github.com/johnlns/CEPIN
2. **Clique** em **"uploading an existing file"**
3. **Arraste** todos os arquivos para a área de upload
   - Ou clique em **"choose your files"**
4. **Aguarde** o upload terminar

### 4️⃣ Fazer commit
1. **Role** para baixo na página
2. **Escreva** no campo "Commit changes":
   ```
   Initial commit - Sistema CEPIN completo
   ```
3. **Clique** em **"Commit changes"**

### 5️⃣ Verificar
- Após o commit, você verá todos os arquivos no repositório
- A página não estará mais vazia

---

## ⚠️ IMPORTANTE:

### Arquivos que PODE pular:
- 📁 `node_modules/` (muito grande, será recriado)
- 📁 `.next/` (cache, será recriado)

### Arquivos que DEVE incluir:
- 📁 `src/` (código fonte)
- 📄 `package.json` (dependências)
- 📄 `package-lock.json` (versões exatas)
- 📄 Todos os arquivos de configuração (.ts, .js, .json)

---

## 🚀 Depois do upload:

1. ✅ Repositório terá os arquivos
2. ✅ Volte na Vercel
3. ✅ Tente o deploy novamente
4. ✅ Deve funcionar perfeitamente!

---

## 💡 Dica:

Se o upload for muito lento, pule a pasta `node_modules` - a Vercel instalará as dependências automaticamente usando o `package.json`.

