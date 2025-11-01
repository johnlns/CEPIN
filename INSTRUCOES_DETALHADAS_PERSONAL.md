# 📝 Instruções Detalhadas - Corrigir personal.ts

## 🎯 Objetivo:
Corrigir o erro de TypeScript na função `getAgendasByProfissional`

---

## 📍 Passo 1: Acessar o arquivo

**Link direto:**
```
https://github.com/johnlns/CEPIN/edit/main/src/server/services/personal.ts
```

**OU:**
1. Acesse: https://github.com/johnlns/CEPIN
2. Navegue: `src` → `server` → `services` → `personal.ts`
3. Clique no arquivo
4. Clique no ícone de **lápis** (Edit) no topo

---

## 📍 Passo 2: Encontrar a linha 77

**Procure por esta função:**
```typescript
export async function getAgendasByProfissional(profissionalId: string, dataInicio?: string, dataFim?: string) {
```

**Esta função deve estar nas linhas 77-95 aproximadamente**

---

## 📍 Passo 3: Alterar a LINHA 78

### 🔍 Encontre esta linha:
```typescript
let whereConditions = eq(personalAgendas.profissionalId, profissionalId)
```

### ✏️ Substitua por:
```typescript
let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = eq(personalAgendas.profissionalId, profissionalId)
```

**O que mudou:**
- **ANTES**: `let whereConditions = ...`
- **DEPOIS**: `let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = ...`

**Explicação:**
- Adicionamos `: ReturnType<typeof eq> | ReturnType<typeof and>` após `whereConditions`
- Isso define o tipo da variável explicitamente

---

## 📍 Passo 4: Alterar a LINHA 81

### 🔍 Encontre esta linha:
```typescript
whereConditions = and(whereConditions, gte(personalAgendas.data, dataInicio))
```

### ✏️ Substitua por:
```typescript
whereConditions = and(whereConditions, gte(personalAgendas.data, dataInicio))!
```

**O que mudou:**
- **ANTES**: `...dataInicio))`
- **DEPOIS**: `...dataInicio))!`

**Explicação:**
- Adicionamos `!` no final da linha (antes do ponto e vírgula)
- O `!` é um operador TypeScript que força o tipo a não ser `undefined`

---

## 📍 Passo 5: Alterar a LINHA 85

### 🔍 Encontre esta linha:
```typescript
whereConditions = and(whereConditions, lte(personalAgendas.data, dataFim))
```

### ✏️ Substitua por:
```typescript
whereConditions = and(whereConditions, lte(personalAgendas.data, dataFim))!
```

**O que mudou:**
- **ANTES**: `...dataFim))`
- **DEPOIS**: `...dataFim))!`

**Explicação:**
- Mesma coisa da linha 81 - adicionar `!` no final

---

## ✅ Código completo após as correções:

```typescript
export async function getAgendasByProfissional(profissionalId: string, dataInicio?: string, dataFim?: string) {
  let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = eq(personalAgendas.profissionalId, profissionalId)
  
  if (dataInicio) {
    whereConditions = and(whereConditions, gte(personalAgendas.data, dataInicio))!
  }
  
  if (dataFim) {
    whereConditions = and(whereConditions, lte(personalAgendas.data, dataFim))!
  }

  return await drizzleDb.query.personalAgendas.findMany({
    where: whereConditions,
    with: {
      aluno: true,
    },
    orderBy: (agendas, { asc }) => [asc(agendas.data), asc(agendas.startTime)],
  })
}
```

---

## 📍 Passo 6: Fazer Commit

1. **Role** até o final da página
2. **No campo "Commit changes"**, escreva: `Fix: TypeScript type in personal.ts`
3. **Clique** em **"Commit changes"** (botão verde)

---

## ⏰ Passo 7: Aguardar Deploy

1. **Aguarde** 30-60 segundos
2. **A Vercel** fará deploy automaticamente
3. **Verifique** se o build foi bem-sucedido

---

## 🎯 Resumo Visual das Mudanças:

### Linha 78:
```
❌ ANTES: let whereConditions = eq(...)
✅ DEPOIS: let whereConditions: ReturnType<typeof eq> | ReturnType<typeof and> = eq(...)
```

### Linha 81:
```
❌ ANTES: whereConditions = and(..., gte(...))
✅ DEPOIS: whereConditions = and(..., gte(...))!
```

### Linha 85:
```
❌ ANTES: whereConditions = and(..., lte(...))
✅ DEPOIS: whereConditions = and(..., lte(...))!
```

---

**Siga estes passos cuidadosamente e me avise se tiver alguma dúvida!**

