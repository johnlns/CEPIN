# 🔧 Corrigir Arquivo usuarios/page.tsx no GitHub

## 🚨 Problema:
Você colou instruções markdown dentro do arquivo TypeScript, causando erro de sintaxe.

## ✅ Solução RÁPIDA:

### Passo 1: Acessar o arquivo
**Copie e cole este link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/app/admin/usuarios/page.tsx
```

### Passo 2: Rolar até o final
**Role até a linha 333-337**

### Passo 3: Remover TODO o texto após `}`
**O arquivo deve terminar EXATAMENTE assim:**

```typescript
      </div>
    </div>
  )
}
```

### Passo 4: NÃO deve ter:
- ```
- Qualquer texto markdown
- Instruções
- Linhas vazias desnecessárias

### Passo 5: Verificar que a função handleSave está correta
**Linha ~102-117 deve estar assim:**

```typescript
if (editingId) {
  const updated: Usuario[] = usuarios.map(u =>
    u.id === editingId ? { ...u, ...formData, id: u.id } : u
  )
  setUsuarios(updated)
  localStorage.setItem('usuarios', JSON.stringify(updated))
  setEditingId(null)
} else {
  const novo: Usuario = {
    id: crypto.randomUUID(),
    ...formData,
  }
  const updated: Usuario[] = [...usuarios, novo]
  setUsuarios(updated)
  localStorage.setItem('usuarios', JSON.stringify(updated))
}
```

### Passo 6: Commit
**Mensagem**: `Fix: remove markdown text and fix TypeScript error`
**Clique em "Commit changes"**

---

## ✅ Depois:

1. **Aguarde** 30 segundos
2. **Vercel** deve fazer deploy automático
3. **OU** clique em **Redeploy** manualmente
4. **Deve funcionar!**

