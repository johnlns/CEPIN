'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { Plus, Edit, Trash2, DollarSign, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

interface DespesaFixa {
  id: string
  nome: string
  categoria: 'pessoal' | 'utilidades' | 'impostos' | 'negociacao' | 'reserva'
  valorPadraoCents: number
  vencimentoDia: number
  ativo: boolean
  observacoes?: string
}

interface DespesaFixaMensal {
  id: string
  referenciaMes: string
  despesaId: string
  valorCents: number
  vencimento: string
  status: 'aberto' | 'pago' | 'atrasado'
  pagoEm?: string
  observacoes?: string
  despesa: DespesaFixa
}

const DESPESAS_FIXAS_INICIAIS: DespesaFixa[] = [
  // Pessoal
  { id: '1', nome: 'AGUA', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '2', nome: 'GABRIELLA', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '3', nome: 'DANIELLE', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '4', nome: 'PAULO RICARDO', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '5', nome: 'LAYCE BALLET', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '6', nome: 'BRUNA FUTSAL', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '7', nome: 'KETLIN', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '8', nome: 'ANA', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '9', nome: 'LIMPEZA NARA + LANCHE', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '10', nome: 'ALEK', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '11', nome: 'FELIPE', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '12', nome: 'MARINA', categoria: 'pessoal', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  
  // Utilidades
  { id: '13', nome: 'ALUGUEL', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '14', nome: 'ENERGIA', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '15', nome: 'INTERNET', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '16', nome: 'CONTABILIDADE', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '17', nome: 'ALPHA CLEAN', categoria: 'utilidades', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  
  // Impostos
  { id: '18', nome: 'GUIA DA PREVIDENCIA ATUAL', categoria: 'impostos', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '19', nome: 'SIMPLES ATUAL', categoria: 'impostos', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '20', nome: 'FGTS', categoria: 'impostos', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '21', nome: 'ALVARÁ PREFEITURA', categoria: 'impostos', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  
  // Negociação
  { id: '22', nome: 'NEGOCIAÇÃO GPS 2020/2021', categoria: 'negociacao', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '23', nome: 'NEGOCIAÇÃO GPS 2022/2023', categoria: 'negociacao', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '24', nome: 'NEGOCIAÇÃO SIMPLES 2020/2021', categoria: 'negociacao', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '25', nome: 'NEGOCIAÇÃO SIMPLES 2022/2023', categoria: 'negociacao', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '26', nome: 'NEGOCIAÇÃO IMPOSTO CRICIUMA', categoria: 'negociacao', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  
  // Reserva
  { id: '27', nome: 'RESERVA', categoria: 'reserva', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '28', nome: 'FÉRIAS', categoria: 'reserva', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
  { id: '29', nome: 'DÉCIMO', categoria: 'reserva', valorPadraoCents: 0, vencimentoDia: 5, ativo: true },
]

export default function DespesasFixasPage() {
  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>(DESPESAS_FIXAS_INICIAIS)
  const [despesasMensais, setDespesasMensais] = useState<DespesaFixaMensal[]>([])
  const [mesAtual, setMesAtual] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDespesa, setEditingDespesa] = useState<DespesaFixa | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'atrasado':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Aberto</Badge>
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'pessoal':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      case 'utilidades':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'impostos':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'negociacao':
        return 'bg-purple-50 text-purple-800 border-purple-200'
      case 'reserva':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const totalDespesas = despesasMensais.reduce((total, despesa) => total + despesa.valorCents, 0)

  return (
    <div className="min-h-screen bg-cepin-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-cepin-dark">Controle Administrativo</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/dashboard" className="hover:text-cepin-blue">Dashboard</a></li>
            <li>/</li>
            <li className="text-cepin-dark font-medium">Despesas Fixas</li>
          </ol>
        </nav>

        {/* Controls */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Label htmlFor="mes">Mês de Referência:</Label>
            <Input
              id="mes"
              type="month"
              value={mesAtual}
              onChange={(e) => setMesAtual(e.target.value)}
              className="w-40"
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-cepin-green hover:bg-cepin-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-cepin-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-blue">Total Despesas</CardTitle>
              <DollarSign className="h-4 w-4 text-cepin-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{formatCurrency(totalDespesas)}</div>
            </CardContent>
          </Card>

          <Card className="border-cepin-green/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-green">Pagas</CardTitle>
              <CheckCircle className="h-4 w-4 text-cepin-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                {despesasMensais.filter(d => d.status === 'pago').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-cepin-yellow/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-yellow">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-cepin-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                {despesasMensais.filter(d => d.status === 'aberto').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-cepin-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-red">Atrasadas</CardTitle>
              <XCircle className="h-4 w-4 text-cepin-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                {despesasMensais.filter(d => d.status === 'atrasado').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Despesas Fixas List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">DESPESAS FIXAS</CardTitle>
            <CardDescription>
              Controle mensal das despesas fixas da CEPIN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {despesasFixas.map((despesa) => (
                <div
                  key={despesa.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getCategoriaColor(despesa.categoria)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      {getStatusIcon('aberto')}
                    </div>
                    <div>
                      <h3 className="font-medium">{despesa.nome}</h3>
                      <p className="text-sm opacity-75">
                        Vencimento: dia {despesa.vencimentoDia}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(despesa.valorPadraoCents)}</p>
                      <Badge variant="outline" className="text-xs">
                        {despesa.categoria}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDespesa(despesa)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="mt-4 p-4 bg-cepin-red/10 rounded-lg border border-cepin-red/20">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cepin-red">TOTAL</h3>
                <p className="font-bold text-cepin-red">{formatCurrency(totalDespesas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Nova/Editar Despesa Fixa */}
        {(showAddForm || editingDespesa) && (
          <Card className="mt-8 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingDespesa ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa'}
              </CardTitle>
              <CardDescription>
                {editingDespesa ? 'Editar despesa fixa existente' : 'Cadastrar nova despesa fixa'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novaDespesa: DespesaFixa = {
                  id: editingDespesa?.id || crypto.randomUUID(),
                  nome: formData.get('nome') as string,
                  categoria: formData.get('categoria') as DespesaFixa['categoria'],
                  valorPadraoCents: Math.round(parseFloat(formData.get('valor') as string) * 100),
                  vencimentoDia: parseInt(formData.get('vencimentoDia') as string),
                  ativo: formData.get('ativo') === 'true',
                  observacoes: formData.get('observacoes') as string || undefined
                }
                
                if (editingDespesa) {
                  setDespesasFixas(despesasFixas.map(d => d.id === editingDespesa.id ? novaDespesa : d))
                } else {
                  setDespesasFixas([...despesasFixas, novaDespesa])
                }
                
                setShowAddForm(false)
                setEditingDespesa(null)
                alert(editingDespesa ? 'Despesa atualizada com sucesso!' : 'Despesa cadastrada com sucesso!')
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Despesa *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      required
                      defaultValue={editingDespesa?.nome || ''}
                      placeholder="Ex: ALUGUEL, ENERGIA..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <select
                      id="categoria"
                      name="categoria"
                      required
                      defaultValue={editingDespesa?.categoria || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="">Selecione</option>
                      <option value="pessoal">Pessoal</option>
                      <option value="utilidades">Utilidades</option>
                      <option value="impostos">Impostos</option>
                      <option value="negociacao">Negociação</option>
                      <option value="reserva">Reserva</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor Padrão (R$) *</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingDespesa ? (editingDespesa.valorPadraoCents / 100).toString() : ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vencimentoDia">Dia de Vencimento (1-31) *</Label>
                    <Input
                      id="vencimentoDia"
                      name="vencimentoDia"
                      type="number"
                      min="1"
                      max="31"
                      required
                      defaultValue={editingDespesa?.vencimentoDia || 5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ativo">Status</Label>
                    <select
                      id="ativo"
                      name="ativo"
                      defaultValue={editingDespesa?.ativo ? 'true' : 'false'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      defaultValue={editingDespesa?.observacoes || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Observações adicionais..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingDespesa(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cepin-blue hover:bg-cepin-blue/90">
                    {editingDespesa ? 'Salvar Alterações' : 'Cadastrar Despesa'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
