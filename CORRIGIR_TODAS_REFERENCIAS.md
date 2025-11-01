# 🔧 Corrigir Todas as Referências no GitHub

## 🚨 Problema:
Ainda há referência a `contasFixasMensal` na linha 167 do GitHub.

## ✅ Solução Completa:

### Passo 1: Acessar o arquivo
**Link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/server/services/financeiro.ts
```

### Passo 2: Usar Find and Replace

1. **No editor do GitHub**, procure pelo botão **"Find"** ou **"Ctrl+F"** (ou Cmd+F no Mac)
2. **Digite**: `contasFixasMensal`
3. **Verifique** todas as ocorrências encontradas
4. **Substitua TODAS** por: `despesasFixasMensal`

### Passo 3: Verificar linha 167 especificamente

**Encontre a linha 167:**
```typescript
const contasExistentes = await drizzleDb.query.contasFixasMensal.findFirst({
```

**Deve ser:**
```typescript
const contasExistentes = await drizzleDb.query.despesasFixasMensal.findFirst({
```

### Passo 4: Verificar TODAS as referências

**Procure por e substitua TODAS:**
- `query.contasFixasMensal` → `query.despesasFixasMensal`
- `contasFixasMensal.referenciaMes` → `despesasFixasMensal.referenciaMes`
- `contasFixasMensal.id` → `despesasFixasMensal.id`
- `contasFixasMensal.status` → `despesasFixasMensal.status`
- `insert(contasFixasMensal)` → `insert(despesasFixasMensal)`
- `update(contasFixasMensal)` → `update(despesasFixasMensal)`
- `.from(contasFixasMensal)` → `.from(despesasFixasMensal)`

### Passo 5: Commit
**Mensagem**: `Fix: replace all contasFixasMensal with despesasFixasMensal`
**Clique em "Commit changes"**

---

## 🎯 Método Rápido - Substituir Tudo:

**Use "Find and Replace" no editor:**
1. **Procurar**: `contasFixasMensal`
2. **Substituir por**: `despesasFixasMensal`
3. **Substituir todas**
4. **Commit**

---

**Acesse o link e substitua TODAS as referências!**

