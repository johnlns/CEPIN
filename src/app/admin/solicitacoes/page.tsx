'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react'

interface MatriculaPublica {
  id: string
  nomeAluno: string
  dataNascimento: string
  nomeResponsavel: string
  telefoneResponsavel: string
  emailResponsavel?: string
  endereco?: string
  observacoes?: string
  modalidadeId: string
  modalidadeNome: string
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'processada'
  observacoesAdmin?: string
  processadoEm?: string
  processadoPor?: { name: string; email: string }
  criadoEm: string
}

interface AgendamentoExperimental {
  id: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone: string
  nomeCrianca: string
  idadeCrianca: string
  modalidadeInteresse: string
  dataPreferencia: string
  horarioSelecionado: string
  observacoes?: string
  status: 'pendente' | 'confirmado' | 'realizado' | 'cancelado'
  observacoesAdmin?: string
  processadoEm?: string
  processadoPor?: { name: string; email: string }
  criadoEm: string
}

export default function SolicitacoesPage() {
  const [matriculas, setMatriculas] = useState<MatriculaPublica[]>([])
  const [agendamentos, setAgendamentos] = useState<AgendamentoExperimental[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMatricula, setSelectedMatricula] = useState<MatriculaPublica | null>(null)
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoExperimental | null>(null)
  const [observacoesAdmin, setObservacoesAdmin] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      const [matriculasRes, agendamentosRes] = await Promise.all([
        fetch('/api/admin/matriculas-publicas'),
        fetch('/api/admin/agendamentos-experimentais')
      ])
      
      const matriculasData = await matriculasRes.json()
      const agendamentosData = await agendamentosRes.json()
      
      if (matriculasData.success) {
        setMatriculas(matriculasData.matriculas)
      }
      
      if (agendamentosData.success) {
        setAgendamentos(agendamentosData.agendamentos)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const processarSolicitacao = async (id: string, status: string, tipo: 'matricula' | 'agendamento') => {
    try {
      setProcessing(true)
      
      const endpoint = tipo === 'matricula' 
        ? `/api/admin/matriculas-publicas/${id}` 
        : `/api/admin/agendamentos-experimentais/${id}`
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          observacoesAdmin: observacoesAdmin || undefined
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await carregarDados()
        setSelectedMatricula(null)
        setSelectedAgendamento(null)
        setObservacoesAdmin('')
        alert('Solicitação processada com sucesso!')
      } else {
        alert(data.message || 'Erro ao processar solicitação')
      }
    } catch (error) {
      console.error('Erro ao processar solicitação:', error)
      alert('Erro ao processar solicitação')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      aprovada: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejeitada: { color: 'bg-red-100 text-red-800', icon: XCircle },
      processada: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      confirmado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      realizado: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelado: { color: 'bg-red-100 text-red-800', icon: XCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cepin-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando solicitações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitações do Site</h1>
          <p className="text-gray-600 mt-2">
            Gerencie matrículas e agendamentos feitos pelo site público
          </p>
        </div>

        <Tabs defaultValue="matriculas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matriculas" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Matrículas ({matriculas.filter(m => m.status === 'pendente').length} pendentes)
            </TabsTrigger>
            <TabsTrigger value="agendamentos" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendamentos ({agendamentos.filter(a => a.status === 'pendente').length} pendentes)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matriculas" className="space-y-4">
            {matriculas.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma matrícula encontrada
                  </h3>
                  <p className="text-gray-600">
                    As matrículas feitas pelo site aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {matriculas.map((matricula) => (
                  <Card key={matricula.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {matricula.nomeAluno}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Responsável: {matricula.nomeResponsavel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(matricula.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMatricula(matricula)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{matricula.telefoneResponsavel}</span>
                        </div>
                        {matricula.emailResponsavel && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{matricula.emailResponsavel}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{matricula.modalidadeNome}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        Solicitado em: {formatDate(matricula.criadoEm)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-4">
            {agendamentos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum agendamento encontrado
                  </h3>
                  <p className="text-gray-600">
                    Os agendamentos de aulas experimentais aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {agendamento.nomeCrianca}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Responsável: {agendamento.clienteNome}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(agendamento.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAgendamento(agendamento)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{agendamento.clienteTelefone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{agendamento.clienteEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{agendamento.modalidadeInteresse}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        Agendado em: {formatDate(agendamento.criadoEm)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal de detalhes da matrícula */}
        {selectedMatricula && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes da Matrícula</CardTitle>
                <CardDescription>
                  {selectedMatricula.nomeAluno} - {selectedMatricula.modalidadeNome}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nome do Aluno</Label>
                    <p className="text-gray-600">{selectedMatricula.nomeAluno}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Data de Nascimento</Label>
                    <p className="text-gray-600">{selectedMatricula.dataNascimento}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Responsável</Label>
                    <p className="text-gray-600">{selectedMatricula.nomeResponsavel}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Telefone</Label>
                    <p className="text-gray-600">{selectedMatricula.telefoneResponsavel}</p>
                  </div>
                  {selectedMatricula.emailResponsavel && (
                    <div>
                      <Label className="font-semibold">Email</Label>
                      <p className="text-gray-600">{selectedMatricula.emailResponsavel}</p>
                    </div>
                  )}
                  {selectedMatricula.endereco && (
                    <div>
                      <Label className="font-semibold">Endereço</Label>
                      <p className="text-gray-600">{selectedMatricula.endereco}</p>
                    </div>
                  )}
                </div>
                
                {selectedMatricula.observacoes && (
                  <div>
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-gray-600">{selectedMatricula.observacoes}</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="observacoes-admin">Observações Admin</Label>
                  <textarea
                    id="observacoes-admin"
                    value={observacoesAdmin}
                    onChange={(e) => setObservacoesAdmin(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    placeholder="Adicione observações sobre o processamento..."
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => processarSolicitacao(selectedMatricula.id, 'aprovada', 'matricula')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => processarSolicitacao(selectedMatricula.id, 'rejeitada', 'matricula')}
                    disabled={processing}
                    variant="destructive"
                  >
                    Rejeitar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedMatricula(null)
                      setObservacoesAdmin('')
                    }}
                    variant="outline"
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de detalhes do agendamento */}
        {selectedAgendamento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes do Agendamento</CardTitle>
                <CardDescription>
                  {selectedAgendamento.nomeCrianca} - {selectedAgendamento.modalidadeInteresse}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nome da Criança</Label>
                    <p className="text-gray-600">{selectedAgendamento.nomeCrianca}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Idade</Label>
                    <p className="text-gray-600">{selectedAgendamento.idadeCrianca} anos</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Responsável</Label>
                    <p className="text-gray-600">{selectedAgendamento.clienteNome}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Telefone</Label>
                    <p className="text-gray-600">{selectedAgendamento.clienteTelefone}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Email</Label>
                    <p className="text-gray-600">{selectedAgendamento.clienteEmail}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Modalidade</Label>
                    <p className="text-gray-600">{selectedAgendamento.modalidadeInteresse}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Data Preferencial</Label>
                    <p className="text-gray-600">{selectedAgendamento.dataPreferencia}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Horário Selecionado</Label>
                    <p className="text-gray-600">{selectedAgendamento.horarioSelecionado}</p>
                  </div>
                </div>
                
                {selectedAgendamento.observacoes && (
                  <div>
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-gray-600">{selectedAgendamento.observacoes}</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="observacoes-admin-agendamento">Observações Admin</Label>
                  <textarea
                    id="observacoes-admin-agendamento"
                    value={observacoesAdmin}
                    onChange={(e) => setObservacoesAdmin(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    placeholder="Adicione observações sobre o processamento..."
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => processarSolicitacao(selectedAgendamento.id, 'confirmado', 'agendamento')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmar
                  </Button>
                  <Button
                    onClick={() => processarSolicitacao(selectedAgendamento.id, 'cancelado', 'agendamento')}
                    disabled={processing}
                    variant="destructive"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAgendamento(null)
                      setObservacoesAdmin('')
                    }}
                    variant="outline"
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


