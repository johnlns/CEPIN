# 🔧 Corrigir route.ts no GitHub

## 🚨 Erro:
O arquivo no GitHub está sem tipos: `PATCH(request, context)`

## ✅ Solução:

### Passo 1: Acessar o arquivo
**Copie e cole este link:**
```
https://github.com/johnlns/CEPIN/edit/main/src/app/api/admin/agendamentos-experimentais/%5Bid%5D/route.ts
```

### Passo 2: Encontrar a linha 5
**Procure por:**
```typescript
export async function PATCH(request, context) {
```

### Passo 3: Substituir por:
**Troque para:**
```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
```

### Passo 4: Verificar linha 16
**Deve ter:**
```typescript
const { id } = await params
```

### Passo 5: Verificar imports (linhas 1-3)
**Devem estar assim:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { updateAgendamentoExperimentalStatus } from '@/server/services/solicitacoes'
import { getSession } from '@/server/auth'
```

### Passo 6: Commit
**Mensagem**: `Fix: TypeScript types in PATCH route`
**Clique em "Commit changes"`

---

## ✅ Código completo correto:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { updateAgendamentoExperimentalStatus } from '@/server/services/solicitacoes'
import { getSession } from '@/server/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || !['admin', 'gestor'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    const { status, observacoesAdmin } = await request.json()
    const { id } = await params

    if (!status || !['pendente', 'confirmado', 'realizado', 'cancelado'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Status inválido' 
      }, { status: 400 })
    }

    await updateAgendamentoExperimentalStatus(id, status as any, observacoesAdmin, user.id)
    
    return NextResponse.json({ success: true, message: 'Agendamento atualizado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento experimental:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}
```

---

**Acesse o link e cole o código completo!**

