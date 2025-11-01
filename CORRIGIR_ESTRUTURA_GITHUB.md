# 🔧 Corrigir Estrutura no GitHub

## 🚨 Problema:
```
Erro: > Não foi possível encontrar nenhum diretório `pages` ou `app`
```

Isso significa que a pasta `src/app/` não está no repositório GitHub.

## ✅ Verificação rápida:

### 1️⃣ Acesse seu repositório:
- URL: https://github.com/johnlns/CEPIN
- Verifique se você vê esta estrutura:

```
📁 src/
  📁 app/
    📁 admin/
    📁 alunos/
    📁 api/
    📄 layout.tsx
    📄 page.tsx
    📄 globals.css
  📁 components/
  📁 lib/
  📁 server/
📄 package.json
📄 next.config.js
📄 tailwind.config.ts
📄 tsconfig.json
```

## 🔧 Se a estrutura estiver errada:

### Opção 1: Reenviar arquivos corretos

#### Passo 1: Limpar repositório
1. Acesse: https://github.com/johnlns/CEPIN
2. Selecione todos os arquivos (se houver)
3. Delete tudo (botão Delete)

#### Passo 2: Upload correto
1. No Windows, vá para: `C:\Users\lenno\academia-infantil`
2. **IMPORTANTE**: Selecione o CONTEÚDO da pasta, não a pasta inteira
3. Selecione:
   - 📁 `src` (pasta completa)
   - 📄 `package.json`
   - 📄 `package-lock.json`
   - 📄 `next.config.js`
   - 📄 `tailwind.config.ts`
   - 📄 `tsconfig.json`
   - 📄 `drizzle.config.ts`
   - 📄 `postcss.config.js`
   - 📄 `README.md`
   - Todos os outros arquivos NA RAIZ

#### Passo 3: Arrastar para GitHub
1. Arraste TODOS os arquivos selecionados
2. **NÃO** arraste a pasta `academia-infantil` inteira
3. Arraste apenas o CONTEÚDO

#### Passo 4: Commit
```
Initial commit - Sistema CEPIN com estrutura correta
```

---

### Opção 2: Verificar se já está correto

#### Se você vê a pasta `src` no GitHub:
1. Clique na pasta `src`
2. Verifique se tem a pasta `app` dentro
3. Clique na pasta `app`
4. Verifique se tem os arquivos:
   - `layout.tsx`
   - `page.tsx`
   - `globals.css`
   - Pastas: `admin`, `alunos`, `api`, etc.

---

## ✅ Estrutura correta no GitHub deve ser:

```
https://github.com/johnlns/CEPIN
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── alunos/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   └── server/
├── package.json
├── next.config.js
└── outros arquivos...
```

## 🚀 Depois de corrigir:

1. ✅ Estrutura estará correta
2. ✅ Volte na Vercel
3. ✅ Clique em "Redeploy" ou tente novamente
4. ✅ Build deve funcionar!

