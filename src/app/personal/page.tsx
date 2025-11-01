'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Calendar, FileText, Users, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

// Mock data - em produção viria dos serviços
const agendaPersonal = [
  {
    id: '1',
    data: '2024-01-20',
    horario: '09:00 - 10:00',
    aluno: 'Ana Clara Silva',
    profissional: 'Maria Silva',
    status: 'feito',
    pagador: 'unimed',
    valorCents: 8000,
    observacoes: 'Sessão de adaptação, aluno se adaptou bem'
  },
  {
    id: '2',
    data: '2024-01-22',
    horario: '10:00 - 11:00',
    aluno: 'Pedro Henrique Costa',
    profissional: 'Maria Silva',
    status: 'feito',
    pagador: 'particular',
    valorCents: 8000,
    observacoes: 'Exercícios respiratórios devido à asma'
  },
  {
    id: '3',
    data: '2024-01-25',
    horario: '09:00 - 10:00',
    aluno: 'Ana Clara Silva',
    profissional: 'Carlos Santos',
    status: 'faltou',
    pagador: 'unimed',
    valorCents: 8000,
    observacoes: 'Aluno faltou sem aviso'
  },
  {
    id: '4',
    data: '2024-01-27',
    horario: '10:00 - 11:00',
    aluno: 'João Santos',
    profissional: 'Maria Silva',
    status: 'agendado',
    pagador: 'particular',
    valorCents: 8000,
    observacoes: ''
  }
]

const fechamentos = [
  {
    id: '1',
    referenciaMes: '2024-01',
    pagador: 'unimed',
    totalSessoes: 15,
    valorTotalCents: 120000,
    status: 'aberto'
  },
  {
    id: '2',
    referenciaMes: '2024-01',
    pagador: 'particular',
    totalSessoes: 8,
    valorTotalCents: 64000,
    status: 'faturado'
  }
]

export default function PersonalPage() {
  const hoje = new Date().toISOString().split('T')[0]
  const sessoesHoje = agendaPersonal.filter(s => s.data === hoje)
  const sessoesRealizadas = agendaPersonal.filter(s => s.status === 'feito')
  const sessoesPendentes = agendaPersonal.filter(s => s.status === 'agendado')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personal Training</h1>
              <p className="text-gray-600">Agenda e fechamentos de sessões individuais</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Voltar</Button>
              </Link>
              <Link href="/personal/nova">
                <Button className="bg-cepin-blue hover:bg-cepin-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sessão
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
              <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessoesHoje.length}</div>
              <p className="text-xs text-gray-500">
                {sessoesHoje.filter(s => s.status === 'agendado').length} agendadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sessoesRealizadas.length}</div>
              <p className="text-xs text-gray-500">
                R$ {(sessoesRealizadas.reduce((sum, s) => sum + s.valorCents, 0) / 100).toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sessões Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{sessoesPendentes.length}</div>
              <p className="text-xs text-gray-500">
                {agendaPersonal.filter(s => s.status === 'faltou').length} faltas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fechamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {fechamentos.filter(f => f.status === 'aberto').length}
              </div>
              <p className="text-xs text-gray-500">
                Para faturamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="agenda" className="space-y-6">
          <TabsList>
            <TabsTrigger value="agenda">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="fechamentos">
              <FileText className="h-4 w-4 mr-2" />
              Fechamentos
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              <DollarSign className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="space-y-6">
            {/* Sessões Hoje */}
            {sessoesHoje.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Sessões de Hoje
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessoesHoje.map((sessao) => (
                      <div key={sessao.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium text-gray-900">{sessao.aluno}</div>
                              <div className="text-sm text-gray-500">
                                {sessao.horario} • Prof. {sessao.profissional}
                              </div>
                              {sessao.observacoes && (
                                <div className="text-sm text-gray-600 mt-1">{sessao.observacoes}</div>
                              )}
                            </div>
                            <Badge variant={sessao.pagador === 'unimed' ? 'default' : 'secondary'}>
                              {sessao.pagador === 'unimed' ? 'Unimed' : 'Particular'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">
                              R$ {(sessao.valorCents / 100).toLocaleString('pt-BR')}
                            </div>
                            <Badge 
                              className={
                                sessao.status === 'feito' ? 'bg-green-100 text-green-800' :
                                sessao.status === 'faltou' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {sessao.status === 'feito' ? 'Realizada' :
                               sessao.status === 'faltou' ? 'Faltou' : 'Agendada'}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            {sessao.status === 'agendado' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Feito
                                </Button>
                                <Button variant="outline" size="sm">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Faltou
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Todas as Sessões */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
                <CardDescription>
                  Todas as sessões de personal training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agendaPersonal.map((sessao) => (
                    <div key={sessao.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium text-gray-900">{sessao.aluno}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(sessao.data).toLocaleDateString('pt-BR')} • {sessao.horario} • Prof. {sessao.profissional}
                            </div>
                            {sessao.observacoes && (
                              <div className="text-sm text-gray-600 mt-1">{sessao.observacoes}</div>
                            )}
                          </div>
                          <Badge variant={sessao.pagador === 'unimed' ? 'default' : 'secondary'}>
                            {sessao.pagador === 'unimed' ? 'Unimed' : 'Particular'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            R$ {(sessao.valorCents / 100).toLocaleString('pt-BR')}
                          </div>
                          <Badge 
                            className={
                              sessao.status === 'feito' ? 'bg-green-100 text-green-800' :
                              sessao.status === 'faltou' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {sessao.status === 'feito' ? 'Realizada' :
                             sessao.status === 'faltou' ? 'Faltou' : 'Agendada'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fechamentos Tab */}
          <TabsContent value="fechamentos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Fechamentos Mensais</h2>
              <Button 
                onClick={() => alert('Funcionalidade de gerar fechamento será implementada em breve')}
                className="bg-cepin-blue hover:bg-cepin-blue/90"
              >
                Gerar Fechamento do Mês
              </Button>
            </div>

            <div className="space-y-4">
              {fechamentos.map((fechamento) => (
                <Card key={fechamento.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          Fechamento {fechamento.referenciaMes} - {fechamento.pagador === 'unimed' ? 'Unimed' : 'Particular'}
                        </CardTitle>
                        <CardDescription>
                          {fechamento.totalSessoes} sessões • R$ {(fechamento.valorTotalCents / 100).toLocaleString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={
                          fechamento.status === 'aberto' ? 'bg-yellow-100 text-yellow-800' :
                          fechamento.status === 'faturado' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {fechamento.status === 'aberto' ? 'Aberto' :
                         fechamento.status === 'faturado' ? 'Faturado' : 'Recebido'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        Exportar CSV
                      </Button>
                      {fechamento.status === 'aberto' && (
                        <Button size="sm">
                          Marcar como Faturado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Personal Training</CardTitle>
                <CardDescription>
                  Relatórios financeiros e de produtividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Relatório Financeiro
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    Produtividade por Profissional
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Relatório de Frequência
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Relatório Mensal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
