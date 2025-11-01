# 🔧 Atualizar Mailer no GitHub

## ✅ Correção aplicada localmente

O campo `from` foi corrigido de `env.SMTP_USER` (resend) para `CEPIN <noreply@cepin.com>`.

## 📝 Atualizar no GitHub:

### Passo 1: Acessar o arquivo
```
https://github.com/johnlns/CEPIN/edit/main/src/server/mailer/index.ts
```

### Passo 2: Encontrar e substituir

**Linha 16 - Encontre:**
```typescript
from: env.SMTP_USER,
```

**Substitua por:**
```typescript
from: 'CEPIN <noreply@cepin.com>',
```

**Linha 46 - Encontre:**
```typescript
from: env.SMTP_USER,
```

**Substitua por:**
```typescript
from: 'CEPIN <noreply@cepin.com>',
```

### Passo 3: Commit
**Mensagem**: `Fix: email from field for Resend`

### Passo 4: Aguardar deploy
Aguarde ~30 segundos — a Vercel fará deploy automaticamente.

---

## ⚠️ IMPORTANTE: Verificar domínio no Resend

Para usar `noreply@cepin.com`, você precisa:
1. **Acesse**: https://resend.com
2. **Vá** em **Domains**
3. **Adicione** o domínio `cepin.com`
4. **OU** use um domínio verificado que você já tenha

### Se não tiver domínio próprio:

**Use o email de teste do Resend:**
```typescript
from: 'CEPIN <onboarding@resend.dev>',
```

---

**Qual opção prefere?**
1. Adicionar domínio no Resend (cepin.com)
2. Usar email de teste do Resend (onboarding@resend.dev)

