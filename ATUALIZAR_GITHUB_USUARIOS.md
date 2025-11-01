# 🔧 Atualizar Arquivo usuarios/page.tsx no GitHub

## ✅ Seu arquivo local está CORRETO!
Mas o GitHub ainda tem a versão antiga. Vamos atualizar!

## 📝 Opção 1: Editar direto no GitHub (RÁPIDO)

### Passo 1: Acessar o arquivo
**Copie e cole este link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/app/admin/usuarios/page.tsx
```

### Passo 2: Encontrar a linha 104
**Procure por:**
```typescript
u.id === editingId ? formData : u
```

### Passo 3: Substituir por
**Troque para:**
```typescript
u.id === editingId ? { ...u, ...formData, id: u.id } : u
```

### Passo 4: Adicionar tipo na linha 103
**Na linha 103, certifique-se que está:**
```typescript
const updated: Usuario[] = usuarios.map(u =>
```

### Passo 5: Commit
**Commit message**: `Fix: TypeScript error - preservar id no update`
**Clique em "Commit changes"**

---

## 📝 Opção 2: Fazer commit via Git (se tiver Git instalado)

No terminal, execute:
```bash
cd C:\Users\lenno\academia-infantil
git add src/app/admin/usuarios/page.tsx
git commit -m "Fix: TypeScript error - preservar id no update"
git push origin main
```

---

## 🚀 Depois de atualizar:

1. **Aguarde** 30 segundos
2. **Volte** na Vercel
3. **Redeploy** com "Clear build cache"
4. **Deve funcionar!**

---

## ✅ Verificação rápida:

Após editar, verifique se a linha 104 no GitHub mostra:
```typescript
u.id === editingId ? { ...u, ...formData, id: u.id } : u
```

**E não:**
```typescript
u.id === editingId ? formData : u
```

