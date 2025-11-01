# 🔧 Remover Chave Extra no GitHub

## 🚨 Problema:
Há um `}` extra na linha 158 do arquivo financeiro.ts no GitHub.

## ✅ Solução:

### Passo 1: Acessar o arquivo
**Link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/server/services/financeiro.ts
```

### Passo 2: Encontrar as linhas 156-158

**Deve estar assim (ERRADO):**
```typescript
  return modelo
}    // linha 156
       // linha 157 (vazia)
}    // linha 158 - ESTE É O PROBLEMA!
```

### Passo 3: Remover o `}` extra da linha 158

**Deve ficar assim (CORRETO):**
```typescript
  return modelo
}    // linha 156
       // linha 157 (vazia)
       // linha 158 (vazia - sem o })
```

### Passo 4: Verificação completa da função

**A função `createContaFixaModelo` deve estar EXATAMENTE assim (linhas 144-156):**

```typescript
export async function createContaFixaModelo(data: {
  nome: string
  categoria: 'pessoal' | 'utilidades' | 'impostos' | 'negociacao' | 'reserva'
  valorPadraoCents: number
  vencimentoDia: number
  observacoes?: string
}) {
  const [modelo] = await drizzleDb.insert(despesasFixas).values({
    ...data,
  }).returning()

  return modelo
}
```

### Passo 5: Commit
**Mensagem**: `Fix: remove extra closing brace`
**Clique em "Commit changes"**

---

**Acesse o link e remova o `}` extra da linha 158!**

