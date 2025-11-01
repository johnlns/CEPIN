'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package, Calendar, ShoppingCart, CheckCircle } from 'lucide-react'

// Mock data - em produção viria dos serviços
const pacotesVendidos = [
  {
    id: '1',
    aluno: 'Ana Clara Silva',
    referencia: 'Colônia de Férias Janeiro',
    quantidade: 5,
    valorUnitCents: 2500,
    valorTotalCents: 12500,
    data: '2024-01-15',
    status: 'pago',
    consumidos: 3,
    disponiveis: 2
  },
  {
    id: '2',
    aluno: 'Pedro Henrique Costa',
    referencia: 'Aulas Avulsas Fevereiro',
    quantidade: 10,
    valorUnitCents: 3000,
    valorTotalCents: 30000,
    data: '2024-02-01',
    status: 'pago',
    consumidos: 7,
    disponiveis: 3
  }
]

const consumos = [
  {
    id: '1',
    aluno: 'Ana Clara Silva',
    dataUso: '2024-01-16',
    turma: 'Futebol Sub-10',
    observacao: 'Aula experimental'
  },
  {
    id: '2',
    aluno: 'Ana Clara Silva',
    dataUso: '2024-01-18',
    turma: 'Natação Iniciante',
    observacao: 'Aula regular'
  },
  {
    id: '3',
    aluno: 'Ana Clara Silva',
    dataUso: '2024-01-20',
    turma: null,
    observacao: 'Uso livre'
  }
]

export default function VendasDiariasPage() {
  const [pacotes, setPacotes] = useState(pacotesVendidos)
  const [consumosList, setConsumosList] = useState(consumos)

  const consumirDiaria = (pacoteId: string, aluno: string, dataUso: string, turma?: string, observacao?: string) => {
    // Simular consumo
    const novoConsumo = {
      id: Date.now().toString(),
      aluno,
      dataUso,
      turma: turma || null,
      observacao: observacao || ''
    }
    
    setConsumosList(prev => [...prev, novoConsumo])
    
    // Atualizar contadores do pacote
    setPacotes(prev => prev.map(pacote => {
      if (pacote.id === pacoteId) {
        return {
          ...pacote,
          consumidos: pacote.consumidos + 1,
          disponiveis: pacote.disponiveis - 1
        }
      }
      return pacote
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800'
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago'
      case 'pendente': return 'Pendente'
      case 'cancelado': return 'Cancelado'
      default: return 'Desconhecido'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendas Avulsas</h1>
              <p className="text-gray-600">Diárias e pacotes sem contrato mensal</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Voltar</Button>
              </Link>
              <Link href="/vendas/diarias/nova">
                <Button className="bg-cepin-blue hover:bg-cepin-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Venda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pacotes Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pacotes.length}</div>
              <p className="text-xs text-gray-500">
                R$ {(pacotes.reduce((sum, p) => sum + p.valorTotalCents, 0) / 100).toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Diárias Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pacotes.reduce((sum, p) => sum + p.disponiveis, 0)}
              </div>
              <p className="text-xs text-gray-500">
                Para consumo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Diárias Consumidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {pacotes.reduce((sum, p) => sum + p.consumidos, 0)}
              </div>
              <p className="text-xs text-gray-500">
                Total utilizado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((pacotes.reduce((sum, p) => sum + p.consumidos, 0) / 
                  pacotes.reduce((sum, p) => sum + p.quantidade, 0)) * 100)}%
              </div>
              <p className="text-xs text-gray-500">
                Utilização
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pacotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pacotes">
              <Package className="h-4 w-4 mr-2" />
              Pacotes Vendidos
            </TabsTrigger>
            <TabsTrigger value="consumos">
              <Calendar className="h-4 w-4 mr-2" />
              Histórico de Consumos
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Pacotes Tab */}
          <TabsContent value="pacotes" className="space-y-6">
            <div className="space-y-4">
              {pacotes.map((pacote) => (
                <Card key={pacote.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pacote.referencia}</CardTitle>
                        <CardDescription>
                          Aluno: {pacote.aluno} • Vendido em {new Date(pacote.data).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(pacote.status)}>
                        {getStatusText(pacote.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Quantidade Total</div>
                        <div className="text-lg font-bold">{pacote.quantidade} diárias</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Valor Unitário</div>
                        <div className="text-lg font-bold">
                          R$ {(pacote.valorUnitCents / 100).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Valor Total</div>
                        <div className="text-lg font-bold">
                          R$ {(pacote.valorTotalCents / 100).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Status</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(pacote.consumidos / pacote.quantidade) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {pacote.consumidos}/{pacote.quantidade}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-600">Disponíveis</div>
                        <div className="text-2xl font-bold text-green-600">{pacote.disponiveis}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-600">Consumidas</div>
                        <div className="text-2xl font-bold text-blue-600">{pacote.consumidos}</div>
                      </div>
                    </div>

                    {pacote.disponiveis > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => consumirDiaria(pacote.id, pacote.aluno, new Date().toISOString().split('T')[0])}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Consumir Diária
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Consumos Tab */}
          <TabsContent value="consumos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Consumos</CardTitle>
                <CardDescription>
                  Diárias consumidas pelos alunos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consumosList.map((consumo) => (
                    <div key={consumo.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{consumo.aluno}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(consumo.dataUso).toLocaleDateString('pt-BR')}
                          {consumo.turma && ` • ${consumo.turma}`}
                        </div>
                        {consumo.observacao && (
                          <div className="text-sm text-gray-600 mt-1">{consumo.observacao}</div>
                        )}
                      </div>
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Consumido
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Vendas Avulsas</CardTitle>
                <CardDescription>
                  Relatórios de vendas e utilização de pacotes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Package className="h-6 w-6 mb-2" />
                    Vendas por Período
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Taxa de Utilização
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <ShoppingCart className="h-6 w-6 mb-2" />
                    Receita por Pacote
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Consumos por Aluno
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Executivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {pacotes.length}
                    </div>
                    <div className="text-sm text-gray-500">Pacotes Vendidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {(pacotes.reduce((sum, p) => sum + p.valorTotalCents, 0) / 100).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">Receita Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((pacotes.reduce((sum, p) => sum + p.consumidos, 0) / 
                        pacotes.reduce((sum, p) => sum + p.quantidade, 0)) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Taxa de Uso</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
