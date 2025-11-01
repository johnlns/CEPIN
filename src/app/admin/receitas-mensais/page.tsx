'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { Plus, Edit, Trash2, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface ReceitaMensal {
  id: string
  referenciaMes: string
  categoria: string
  valorCents: number
  observacoes?: string
  criadoEm: string
}

const CATEGORIAS_RECEITAS = [
  'EM CAIXA',
  'ACADEMIA',
  'ESCOLAS PARCEIRA',
  'CONTRATURNO',
  'CONTRATURNO AVULSO',
  'PERSONAL',
  'EVENTOS',
  'ALMOÇOS',
  'RECREAÇÕES',
  'LUCIANA - NEUROPSICOPEDAGOGA',
  'TACI - TO',
  'UNIFORME',
  'AVALIAÇÃO',
  'COLÔNIA DE FÉRIAS',
  'TAXA MATRICULA'
]

export default function ReceitasMensaisPage() {
  const [receitas, setReceitas] = useState<ReceitaMensal[]>([
    {
      id: '1',
      referenciaMes: '2025-01',
      categoria: 'ACADEMIA',
      valorCents: 500000,
      observacoes: 'Receita mensal da academia',
      criadoEm: new Date().toISOString()
    },
    {
      id: '2',
      referenciaMes: '2025-01',
      categoria: 'PERSONAL',
      valorCents: 120000,
      observacoes: 'Aulas personalizadas',
      criadoEm: new Date().toISOString()
    }
  ])
  const [mesAtual, setMesAtual] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReceita, setEditingReceita] = useState<ReceitaMensal | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  const getCategoriaColor = (categoria: string) => {
    const colors = [
      'bg-blue-50 text-blue-800 border-blue-200',
      'bg-green-50 text-green-800 border-green-200',
      'bg-yellow-50 text-yellow-800 border-yellow-200',
      'bg-purple-50 text-purple-800 border-purple-200',
      'bg-pink-50 text-pink-800 border-pink-200',
      'bg-indigo-50 text-indigo-800 border-indigo-200',
      'bg-red-50 text-red-800 border-red-200',
      'bg-orange-50 text-orange-800 border-orange-200'
    ]
    const index = CATEGORIAS_RECEITAS.indexOf(categoria)
    return colors[index % colors.length]
  }

  const totalReceitas = receitas.reduce((total, receita) => total + receita.valorCents, 0)

  // Agrupar receitas por categoria para exibição
  const receitasPorCategoria = receitas.reduce((acc, receita) => {
    if (!acc[receita.categoria]) {
      acc[receita.categoria] = 0
    }
    acc[receita.categoria] += receita.valorCents
    return acc
  }, {} as Record<string, number>)

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
            <li className="text-cepin-dark font-medium">Receitas Mensais</li>
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
            Nova Receita
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-cepin-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-blue">Total Receitas</CardTitle>
              <DollarSign className="h-4 w-4 text-cepin-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{formatCurrency(totalReceitas)}</div>
            </CardContent>
          </Card>

          <Card className="border-cepin-green/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-green">Categorias</CardTitle>
              <TrendingUp className="h-4 w-4 text-cepin-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                {Object.keys(receitasPorCategoria).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-cepin-yellow/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-yellow">Mês</CardTitle>
              <Calendar className="h-4 w-4 text-cepin-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                {new Date(mesAtual + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receitas por Categoria */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-cepin-dark">RECEITAS</CardTitle>
            <CardDescription>
              Controle mensal das receitas da CEPIN - {new Date(mesAtual + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {CATEGORIAS_RECEITAS.map((categoria) => {
                const valor = receitasPorCategoria[categoria] || 0
                return (
                  <div
                    key={categoria}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getCategoriaColor(categoria)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-cepin-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium">{categoria}</h3>
                        <p className="text-sm opacity-75">
                          {valor > 0 ? 'Receita registrada' : 'Sem receita registrada'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(valor)}</p>
                        {valor > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Registrada
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const receitaExistente = receitas.find(r => r.categoria === categoria)
                            if (receitaExistente) {
                              setEditingReceita(receitaExistente)
                            } else {
                              setShowAddForm(true)
                            }
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total Row */}
            <div className="mt-4 p-4 bg-cepin-blue/10 rounded-lg border border-cepin-blue/20">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cepin-blue">TOTAL RECEITAS</h3>
                <p className="font-bold text-cepin-blue">{formatCurrency(totalReceitas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes das Receitas */}
        {receitas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-dark">Detalhes das Receitas</CardTitle>
              <CardDescription>
                Lista detalhada de todas as receitas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {receitas.map((receita) => (
                  <div
                    key={receita.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium">{receita.categoria}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(receita.criadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(receita.valorCents)}</p>
                        {receita.observacoes && (
                          <p className="text-sm text-gray-600">{receita.observacoes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReceita(receita)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta receita?')) {
                              setReceitas(receitas.filter(r => r.id !== receita.id))
                              alert('Receita excluída com sucesso!')
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Nova/Editar Receita */}
        {(showAddForm || editingReceita) && (
          <Card className="mt-8 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingReceita ? 'Editar Receita' : 'Nova Receita'}
              </CardTitle>
              <CardDescription>
                {editingReceita ? 'Editar receita existente' : 'Adicionar nova receita mensal'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const novaReceita: ReceitaMensal = {
                  id: editingReceita?.id || crypto.randomUUID(),
                  referenciaMes: mesAtual,
                  categoria: formData.get('categoria') as string,
                  valorCents: Math.round(parseFloat(formData.get('valor') as string) * 100),
                  observacoes: formData.get('observacoes') as string || undefined,
                  criadoEm: editingReceita?.criadoEm || new Date().toISOString()
                }
                
                if (editingReceita) {
                  setReceitas(receitas.map(r => r.id === editingReceita.id ? novaReceita : r))
                } else {
                  setReceitas([...receitas, novaReceita])
                }
                
                setShowAddForm(false)
                setEditingReceita(null)
                alert(editingReceita ? 'Receita atualizada com sucesso!' : 'Receita adicionada com sucesso!')
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <select
                      id="categoria"
                      name="categoria"
                      required
                      defaultValue={editingReceita?.categoria || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="">Selecione uma categoria</option>
                      {CATEGORIAS_RECEITAS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
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
                      defaultValue={editingReceita ? (editingReceita.valorCents / 100).toString() : ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      defaultValue={editingReceita?.observacoes || ''}
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
                      setEditingReceita(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cepin-blue hover:bg-cepin-blue/90">
                    {editingReceita ? 'Salvar Alterações' : 'Adicionar Receita'}
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
