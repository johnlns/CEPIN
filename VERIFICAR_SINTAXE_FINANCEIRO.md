# 🔧 Verificar Sintaxe do financeiro.ts

## 🚨 Erro:
"Declaration or statement expected" na linha 158

## ✅ Solução:

### Passo 1: Acessar o arquivo
**Link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/server/services/financeiro.ts
```

### Passo 2: Verificar a função `createContaFixaModelo` (linhas 144-156)

**Deve estar EXATAMENTE assim:**

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

### Passo 3: Verificar linha 158

**Linha 158 deve estar vazia OU ter:**
```typescript

```

**NÃO deve ter:**
- `}` sozinho
- Texto markdown
- Qualquer coisa estranha

### Passo 4: Se o arquivo estiver correto

**Use "Find and Replace" para verificar:**
- Procure por: `categoria: 'despesa'`
- Se encontrar, remova essa linha
- Procure por: `subcategoria`
- Se encontrar, remova do objeto de parâmetros

### Passo 5: Commit
**Mensagem**: `Fix: syntax error in financeiro.ts`

---

## 📝 Código completo correto da função:

```typescript
// Contas Fixas
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

---

**Acesse o link e verifique se está exatamente assim!**

