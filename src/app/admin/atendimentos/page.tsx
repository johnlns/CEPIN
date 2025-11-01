'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { Plus, Edit, Trash2, DollarSign, Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Atendimento {
  id: string
  profissionalId: string
  pacienteId: string
  data: string
  valorSessaoCents: number
  tipoPagamento: 'unimed' | 'particular' | 'reembolso'
  status: 'agendado' | 'realizado' | 'faltou' | 'cancelado'
  observacoes?: string
  criadoEm: string
  profissional: { name: string }
  paciente: { fullName: string }
}

const ATENDIMENTOS_EXEMPLO: Atendimento[] = [
  // UNIMED
  { id: '1', profissionalId: 'aleksandra', pacienteId: 'maria-antonia', data: '2025-01-15', valorSessaoCents: 10000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Maria Antônia' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '2', profissionalId: 'aleksandra', pacienteId: 'miguel-santos', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Miguel dos Santos' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '3', profissionalId: 'aleksandra', pacienteId: 'leticia-macedo', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Letícia Macedo' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '4', profissionalId: 'aleksandra', pacienteId: 'juan', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Juan' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '5', profissionalId: 'aleksandra', pacienteId: 'lucas-hector', data: '2025-01-15', valorSessaoCents: 11000, tipoPagamento: 'reembolso', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Lucas Hector Pescador Zanette' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '6', profissionalId: 'aleksandra', pacienteId: 'mateus-vieira', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Mateus Vieira Patricio' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '7', profissionalId: 'aleksandra', pacienteId: 'julia-joao', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Julia João' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '8', profissionalId: 'aleksandra', pacienteId: 'benicio', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Benício' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '9', profissionalId: 'aleksandra', pacienteId: 'lucca', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Lucca' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '10', profissionalId: 'aleksandra', pacienteId: 'arthur-motta', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Arthur Motta' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '11', profissionalId: 'aleksandra', pacienteId: 'miguel-boaventura', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Miguel Boaventura Lucio' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '12', profissionalId: 'aleksandra', pacienteId: 'antonio-carlos', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'unimed', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Antônio Carlos' }, criadoEm: '2025-01-15T10:00:00Z' },
  
  // PARTICULAR
  { id: '13', profissionalId: 'aleksandra', pacienteId: 'maria-luiza', data: '2025-01-15', valorSessaoCents: 12000, tipoPagamento: 'particular', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Maria Luiza' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '14', profissionalId: 'aleksandra', pacienteId: 'eloah', data: '2025-01-15', valorSessaoCents: 11000, tipoPagamento: 'particular', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Eloah' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '15', profissionalId: 'aleksandra', pacienteId: 'lucas-zamparetti', data: '2025-01-15', valorSessaoCents: 11000, tipoPagamento: 'particular', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Lucas Zamparetti' }, criadoEm: '2025-01-15T10:00:00Z' },
  { id: '16', profissionalId: 'aleksandra', pacienteId: 'benjamim', data: '2025-01-15', valorSessaoCents: 10000, tipoPagamento: 'particular', status: 'realizado', profissional: { name: 'Aleksandra' }, paciente: { fullName: 'Benjamim' }, criadoEm: '2025-01-15T10:00:00Z' },
]

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>(ATENDIMENTOS_EXEMPLO)
  const [mesAtual, setMesAtual] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAtendimento, setEditingAtendimento] = useState<Atendimento | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'realizado':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'faltou':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'realizado':
        return <Badge className="bg-green-100 text-green-800">Realizado</Badge>
      case 'faltou':
        return <Badge className="bg-red-100 text-red-800">Faltou</Badge>
      case 'cancelado':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Agendado</Badge>
    }
  }

  const getTipoPagamentoBadge = (tipo: string) => {
    switch (tipo) {
      case 'unimed':
        return <Badge className="bg-blue-100 text-blue-800">UNIMED</Badge>
      case 'particular':
        return <Badge className="bg-green-100 text-green-800">PARTICULAR</Badge>
      case 'reembolso':
        return <Badge className="bg-purple-100 text-purple-800">REEMBOLSO</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>
    }
  }

  const handleEdit = (atendimento: Atendimento) => {
    setEditingAtendimento(atendimento)
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este atendimento?')) {
      setAtendimentos(atendimentos.filter(a => a.id !== id))
      alert('Atendimento excluído com sucesso!')
    }
  }

  // Filtrar atendimentos por mês
  const atendimentosFiltrados = atendimentos.filter(atendimento => 
    atendimento.data.startsWith(mesAtual)
  )

  // Agrupar por tipo de pagamento
  const unimedAtendimentos = atendimentosFiltrados.filter(a => a.tipoPagamento === 'unimed')
  const particularAtendimentos = atendimentosFiltrados.filter(a => a.tipoPagamento === 'particular')
  const reembolsoAtendimentos = atendimentosFiltrados.filter(a => a.tipoPagamento === 'reembolso')

  // Calcular totais
  const totalUnimed = unimedAtendimentos.reduce((total, a) => total + a.valorSessaoCents, 0)
  const totalParticular = particularAtendimentos.reduce((total, a) => total + a.valorSessaoCents, 0)
  const totalReembolso = reembolsoAtendimentos.reduce((total, a) => total + a.valorSessaoCents, 0)
  const totalGeral = totalUnimed + totalParticular + totalReembolso

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
            <li><a href="/admin/despesas-fixas" className="hover:text-cepin-blue">Despesas Fixas</a></li>
            <li>/</li>
            <li><a href="/admin/receitas-mensais" className="hover:text-cepin-blue">Receitas Mensais</a></li>
            <li>/</li>
            <li><a href="/admin/boletim-caixa" className="hover:text-cepin-blue">Boletim de Caixa</a></li>
            <li>/</li>
            <li className="text-cepin-dark font-medium">Atendimentos</li>
          </ol>
        </nav>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-cepin-dark">Atendimentos Aleksandra</CardTitle>
                <CardDescription>
                  Controle de atendimentos e sessões - {new Date(mesAtual + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="mes">Mês:</Label>
                <Input
                  id="mes"
                  type="month"
                  value={mesAtual}
                  onChange={(e) => setMesAtual(e.target.value)}
                  className="w-40"
                />
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-cepin-green hover:bg-cepin-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atendimento
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-cepin-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-blue">Total Sessões</CardTitle>
              <Users className="h-4 w-4 text-cepin-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{atendimentosFiltrados.length}</div>
            </CardContent>
          </Card>

          <Card className="border-cepin-green/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-green">Total Valor</CardTitle>
              <DollarSign className="h-4 w-4 text-cepin-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{formatCurrency(totalGeral)}</div>
            </CardContent>
          </Card>

          <Card className="border-cepin-yellow/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-yellow">UNIMED</CardTitle>
              <CheckCircle className="h-4 w-4 text-cepin-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{unimedAtendimentos.length}</div>
              <p className="text-sm text-gray-600">{formatCurrency(totalUnimed)}</p>
            </CardContent>
          </Card>

          <Card className="border-cepin-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-red">PARTICULAR</CardTitle>
              <Users className="h-4 w-4 text-cepin-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{particularAtendimentos.length}</div>
              <p className="text-sm text-gray-600">{formatCurrency(totalParticular)}</p>
            </CardContent>
          </Card>
        </div>

        {/* UNIMED Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-cepin-dark">UNIMED</CardTitle>
            <CardDescription>
              Atendimentos cobertos pelo convênio UNIMED
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unimedAtendimentos.map((atendimento) => (
                <div
                  key={atendimento.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-blue-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      {getStatusIcon(atendimento.status)}
                    </div>
                    <div>
                      <h3 className="font-medium">{atendimento.paciente.fullName}</h3>
                      <p className="text-sm opacity-75">
                        {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(atendimento.valorSessaoCents)}</p>
                      <div className="flex gap-2">
                        {getTipoPagamentoBadge(atendimento.tipoPagamento)}
                        {getStatusBadge(atendimento.status)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(atendimento)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(atendimento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal UNIMED */}
            <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-green-800">Sub Total UNIMED {unimedAtendimentos.length}</h3>
                <div className="text-right">
                  <p className="font-bold text-green-800">{unimedAtendimentos.length} sessões</p>
                  <p className="font-bold text-green-800">{formatCurrency(totalUnimed)}</p>
                  <p className="text-sm text-green-700">+ {formatCurrency(Math.floor(totalUnimed * 0.1))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PARTICULAR Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-cepin-dark">PARTICULAR</CardTitle>
            <CardDescription>
              Atendimentos particulares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {particularAtendimentos.map((atendimento) => (
                <div
                  key={atendimento.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-orange-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      {getStatusIcon(atendimento.status)}
                    </div>
                    <div>
                      <h3 className="font-medium">{atendimento.paciente.fullName}</h3>
                      <p className="text-sm opacity-75">
                        {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(atendimento.valorSessaoCents)}</p>
                      <div className="flex gap-2">
                        {getTipoPagamentoBadge(atendimento.tipoPagamento)}
                        {getStatusBadge(atendimento.status)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(atendimento)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(atendimento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal PARTICULAR */}
            <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-green-800">Sub Total PARTICULAR {particularAtendimentos.length}</h3>
                <div className="text-right">
                  <p className="font-bold text-green-800">{particularAtendimentos.length} sessões</p>
                  <p className="font-bold text-green-800">{formatCurrency(totalParticular)}</p>
                  <p className="text-sm text-green-700">+ {formatCurrency(Math.floor(totalParticular * 0.1))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Geral */}
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-green-800">Total Aleksandra {atendimentosFiltrados.length}</h3>
                <div className="text-right">
                  <p className="font-bold text-green-800">{atendimentosFiltrados.length} sessões</p>
                  <p className="font-bold text-green-800">{formatCurrency(totalGeral)}</p>
                  <p className="text-sm text-green-700">+ {formatCurrency(Math.floor(totalGeral * 0.1))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Novo/Editar Atendimento */}
        {(showAddForm || editingAtendimento) && (
          <Card className="mt-8 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingAtendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
              </CardTitle>
              <CardDescription>
                {editingAtendimento ? 'Editar atendimento existente' : 'Adicionar novo atendimento'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novoAtendimento: Atendimento = {
                  id: editingAtendimento?.id || crypto.randomUUID(),
                  profissionalId: 'aleksandra',
                  pacienteId: formData.get('paciente') as string,
                  data: formData.get('data') as string,
                  valorSessaoCents: Math.round(parseFloat(formData.get('valor') as string) * 100),
                  tipoPagamento: formData.get('tipoPagamento') as 'unimed' | 'particular' | 'reembolso',
                  status: formData.get('status') as 'agendado' | 'realizado' | 'faltou' | 'cancelado',
                  observacoes: formData.get('observacoes') as string || undefined,
                  criadoEm: editingAtendimento?.criadoEm || new Date().toISOString(),
                  profissional: { name: 'Aleksandra' },
                  paciente: { fullName: formData.get('paciente') as string }
                }
                
                if (editingAtendimento) {
                  setAtendimentos(atendimentos.map(a => a.id === editingAtendimento.id ? novoAtendimento : a))
                } else {
                  setAtendimentos([...atendimentos, novoAtendimento])
                }
                
                setShowAddForm(false)
                setEditingAtendimento(null)
                alert(editingAtendimento ? 'Atendimento atualizado com sucesso!' : 'Atendimento adicionado com sucesso!')
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paciente">Nome do Paciente *</Label>
                    <Input
                      id="paciente"
                      name="paciente"
                      required
                      defaultValue={editingAtendimento?.paciente.fullName || ''}
                      placeholder="Nome completo do paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      name="data"
                      type="date"
                      required
                      defaultValue={editingAtendimento?.data || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor da Sessão (R$) *</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingAtendimento ? (editingAtendimento.valorSessaoCents / 100).toString() : ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipoPagamento">Tipo de Pagamento *</Label>
                    <select
                      id="tipoPagamento"
                      name="tipoPagamento"
                      required
                      defaultValue={editingAtendimento?.tipoPagamento || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="">Selecione</option>
                      <option value="unimed">UNIMED</option>
                      <option value="particular">Particular</option>
                      <option value="reembolso">Reembolso</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      name="status"
                      required
                      defaultValue={editingAtendimento?.status || 'agendado'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="realizado">Realizado</option>
                      <option value="faltou">Faltou</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      defaultValue={editingAtendimento?.observacoes || ''}
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
                      setEditingAtendimento(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cepin-blue hover:bg-cepin-blue/90">
                    {editingAtendimento ? 'Salvar Alterações' : 'Adicionar Atendimento'}
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
