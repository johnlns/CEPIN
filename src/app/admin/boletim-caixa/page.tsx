'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react'

interface BoletimCaixaItem {
  id: string
  data: string
  evento: string
  referencia?: string
  tipoMovimento: 'entrada' | 'saida'
  valorCents: number
  observacoes?: string
  criadoEm: string
}

const EVENTOS_EXEMPLO: BoletimCaixaItem[] = [
  // Dia 1
  { id: '1', data: '2025-01-01', evento: 'STONE', referencia: 'B', tipoMovimento: 'entrada', valorCents: 222724, criadoEm: '2025-01-01T10:00:00Z' },
  { id: '2', data: '2025-01-01', evento: 'C6', referencia: 'C', tipoMovimento: 'entrada', valorCents: 142000, criadoEm: '2025-01-01T10:00:00Z' },
  { id: '3', data: '2025-01-01', evento: 'SANTANDER', referencia: 'A', tipoMovimento: 'saida', valorCents: 1519, criadoEm: '2025-01-01T10:00:00Z' },
  { id: '4', data: '2025-01-01', evento: 'DINHEIRO', referencia: 'D', tipoMovimento: 'entrada', valorCents: 0, criadoEm: '2025-01-01T10:00:00Z' },
  { id: '5', data: '2025-01-01', evento: 'SEGURO STONE', referencia: 'B', tipoMovimento: 'saida', valorCents: 3895, criadoEm: '2025-01-01T10:00:00Z' },
  
  // Dia 3
  { id: '6', data: '2025-01-03', evento: 'ALMOÇO LUIZA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '7', data: '2025-01-03', evento: 'ALMOÇO JOÃO PEDRO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '8', data: '2025-01-03', evento: 'ALMOÇO MANU E HELENNA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 5200, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '9', data: '2025-01-03', evento: 'ALMOÇO ANTONIO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '10', data: '2025-01-03', evento: 'ALMOÇO THEO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '11', data: '2025-01-03', evento: 'ALMOÇO NAOMI', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '12', data: '2025-01-03', evento: 'ALMOÇO ALICE', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '13', data: '2025-01-03', evento: 'ALMOÇO MARIA VITÓRIA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '14', data: '2025-01-03', evento: 'ALMOÇO HELO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 2600, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '15', data: '2025-01-03', evento: 'PERSONAL ANTONIO + COLÔNIA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 117950, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '16', data: '2025-01-03', evento: 'COLÔNIA ALICE', referencia: 'B', tipoMovimento: 'entrada', valorCents: 29990, criadoEm: '2025-01-03T10:00:00Z' },
  { id: '17', data: '2025-01-03', evento: 'SISTEMA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 25731, criadoEm: '2025-01-03T10:00:00Z' },
  
  // Dia 4
  { id: '18', data: '2025-01-04', evento: '20% PINTOR', referencia: 'B', tipoMovimento: 'saida', valorCents: 80000, criadoEm: '2025-01-04T10:00:00Z' },
  
  // Dia 6
  { id: '19', data: '2025-01-06', evento: 'PERSONAL ARTHUR', referencia: 'B', tipoMovimento: 'entrada', valorCents: 66000, criadoEm: '2025-01-06T10:00:00Z' },
  
  // Dia 7
  { id: '20', data: '2025-01-07', evento: 'PAGAMENTO MENSALIDADE JOAO - MARISA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 56990, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '21', data: '2025-01-07', evento: 'ALMOÇO FRANCISCO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 11700, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '22', data: '2025-01-07', evento: 'ALMOÇO LIVIA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 3900, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '23', data: '2025-01-07', evento: 'MATRICULA VICENTE GUGLIELMI', referencia: 'B', tipoMovimento: 'entrada', valorCents: 56990, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '24', data: '2025-01-07', evento: 'RESERVA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 1749149, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '25', data: '2025-01-07', evento: 'CONTRATURNO MARIA E OTÁVIO', referencia: 'B', tipoMovimento: 'entrada', valorCents: 45105, criadoEm: '2025-01-07T10:00:00Z' },
  { id: '26', data: '2025-01-07', evento: 'PERSONAL MARIA', referencia: 'B', tipoMovimento: 'entrada', valorCents: 36000, criadoEm: '2025-01-07T10:00:00Z' },
  
  // Dia 8
  { id: '27', data: '2025-01-08', evento: 'DANI', referencia: 'B', tipoMovimento: 'saida', valorCents: 136932, criadoEm: '2025-01-08T10:00:00Z' },
  { id: '28', data: '2025-01-08', evento: 'BRUNA', referencia: 'B', tipoMovimento: 'saida', valorCents: 54874, criadoEm: '2025-01-08T10:00:00Z' },
]

export default function BoletimCaixaPage() {
  const [boletimItems, setBoletimItems] = useState<BoletimCaixaItem[]>(EVENTOS_EXEMPLO)
  const [dataFiltro, setDataFiltro] = useState('2025-01')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<BoletimCaixaItem | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getMovimentoIcon = (tipo: string) => {
    return tipo === 'entrada' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getMovimentoBadge = (tipo: string) => {
    return tipo === 'entrada' ? 
      <Badge className="bg-green-100 text-green-800">Entrada</Badge> : 
      <Badge className="bg-red-100 text-red-800">Saída</Badge>
  }

  const getReferenciaColor = (ref?: string) => {
    switch (ref) {
      case 'A': return 'bg-red-100 text-red-800'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-green-100 text-green-800'
      case 'D': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filtrar itens por mês
  const itensFiltrados = boletimItems.filter(item => 
    item.data.startsWith(dataFiltro)
  )

  // Calcular totais
  const totalEntradas = itensFiltrados
    .filter(item => item.tipoMovimento === 'entrada')
    .reduce((total, item) => total + item.valorCents, 0)

  const totalSaidas = itensFiltrados
    .filter(item => item.tipoMovimento === 'saida')
    .reduce((total, item) => total + item.valorCents, 0)

  const saldo = totalEntradas - totalSaidas

  // Agrupar por dia
  const itensPorDia = itensFiltrados.reduce((acc, item) => {
    const dia = item.data
    if (!acc[dia]) {
      acc[dia] = []
    }
    acc[dia].push(item)
    return acc
  }, {} as Record<string, BoletimCaixaItem[]>)

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
            <li className="text-cepin-dark font-medium">Boletim de Caixa</li>
          </ol>
        </nav>

        {/* Header do Boletim */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-cepin-dark">BOLETIM DE CAIXA</CardTitle>
                <CardDescription>
                  Gestão Administrativa e Financeira - {new Date(dataFiltro + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="mes">Mês:</Label>
                <Input
                  id="mes"
                  type="month"
                  value={dataFiltro}
                  onChange={(e) => setDataFiltro(e.target.value)}
                  className="w-40"
                />
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-cepin-green hover:bg-cepin-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-cepin-green/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-green">Total Entradas</CardTitle>
              <TrendingUp className="h-4 w-4 text-cepin-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{formatCurrency(totalEntradas)}</div>
            </CardContent>
          </Card>

          <Card className="border-cepin-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-red">Total Saídas</CardTitle>
              <TrendingDown className="h-4 w-4 text-cepin-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{formatCurrency(totalSaidas)}</div>
            </CardContent>
          </Card>

          <Card className={`border-${saldo >= 0 ? 'cepin-green' : 'cepin-red'}/20`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${saldo >= 0 ? 'text-cepin-green' : 'text-cepin-red'}`}>
                Saldo do Mês
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${saldo >= 0 ? 'text-cepin-green' : 'text-cepin-red'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-cepin-green' : 'text-cepin-red'}`}>
                {formatCurrency(saldo)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-cepin-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-blue">Total Eventos</CardTitle>
              <FileText className="h-4 w-4 text-cepin-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{itensFiltrados.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Boletim por Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">Movimentação Diária</CardTitle>
            <CardDescription>
              Detalhamento dos eventos por dia do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(itensPorDia)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dia, eventos]) => (
                  <div key={dia} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-cepin-dark">
                        Dia {new Date(dia).getDate()}
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          Entradas: {formatCurrency(eventos.filter(e => e.tipoMovimento === 'entrada').reduce((sum, e) => sum + e.valorCents, 0))}
                        </span>
                        <span className="text-red-600">
                          Saídas: {formatCurrency(eventos.filter(e => e.tipoMovimento === 'saida').reduce((sum, e) => sum + e.valorCents, 0))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {eventos.map((evento) => (
                        <div
                          key={evento.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              {getMovimentoIcon(evento.tipoMovimento)}
                            </div>
                            <div>
                              <h4 className="font-medium">{evento.evento}</h4>
                              {evento.observacoes && (
                                <p className="text-sm text-gray-600">{evento.observacoes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`font-medium ${evento.tipoMovimento === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                {evento.tipoMovimento === 'entrada' ? '+' : '-'}{formatCurrency(evento.valorCents)}
                              </p>
                              <div className="flex gap-2">
                                {evento.referencia && (
                                  <Badge className={getReferenciaColor(evento.referencia)}>
                                    {evento.referencia}
                                  </Badge>
                                )}
                                {getMovimentoBadge(evento.tipoMovimento)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingItem(evento)}
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
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Novo/Editar Evento */}
        {(showAddForm || editingItem) && (
          <Card className="mt-8 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingItem ? 'Editar Evento' : 'Novo Evento'}
              </CardTitle>
              <CardDescription>
                {editingItem ? 'Editar movimentação existente' : 'Adicionar nova movimentação de caixa'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novoEvento: BoletimCaixaItem = {
                  id: editingItem?.id || crypto.randomUUID(),
                  data: formData.get('data') as string,
                  evento: formData.get('evento') as string,
                  referencia: formData.get('referencia') as string || undefined,
                  tipoMovimento: formData.get('tipoMovimento') as 'entrada' | 'saida',
                  valorCents: Math.round(parseFloat(formData.get('valor') as string) * 100),
                  observacoes: formData.get('observacoes') as string || undefined,
                  criadoEm: editingItem?.criadoEm || new Date().toISOString()
                }
                
                if (editingItem) {
                  setBoletimItems(boletimItems.map(item => item.id === editingItem.id ? novoEvento : item))
                } else {
                  setBoletimItems([...boletimItems, novoEvento])
                }
                
                setShowAddForm(false)
                setEditingItem(null)
                alert(editingItem ? 'Evento atualizado com sucesso!' : 'Evento adicionado com sucesso!')
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      name="data"
                      type="date"
                      required
                      defaultValue={editingItem?.data || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="evento">Evento *</Label>
                    <Input
                      id="evento"
                      name="evento"
                      required
                      defaultValue={editingItem?.evento || ''}
                      placeholder="Ex: STONE, C6, DINHEIRO..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="referencia">Referência</Label>
                    <select
                      id="referencia"
                      name="referencia"
                      defaultValue={editingItem?.referencia || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="">Nenhuma</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="tipoMovimento">Tipo de Movimento *</Label>
                    <select
                      id="tipoMovimento"
                      name="tipoMovimento"
                      required
                      defaultValue={editingItem?.tipoMovimento || 'entrada'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="entrada">Entrada</option>
                      <option value="saida">Saída</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor (R$) *</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingItem ? (editingItem.valorCents / 100).toString() : ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Input
                      id="observacoes"
                      name="observacoes"
                      defaultValue={editingItem?.observacoes || ''}
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
                      setEditingItem(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cepin-blue hover:bg-cepin-blue/90">
                    {editingItem ? 'Salvar Alterações' : 'Adicionar Evento'}
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
