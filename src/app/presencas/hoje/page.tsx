'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Users, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data - em produção viria do serviço de presenças
const turmasHoje = [
  {
    id: '1',
    nome: 'Futebol Sub-10',
    horario: '14:00 - 15:00',
    professor: 'Maria Silva',
    alunos: [
      { id: '1', nome: 'Ana Clara Silva', presente: true, chegada: '13:55' },
      { id: '2', nome: 'Pedro Henrique Costa', presente: true, chegada: '13:58' },
      { id: '3', nome: 'João Santos', presente: false, chegada: null },
      { id: '4', nome: 'Maria Eduarda', presente: true, chegada: '14:02' },
    ]
  },
  {
    id: '2',
    nome: 'Natação Iniciante',
    horario: '15:00 - 16:00',
    professor: 'Carlos Santos',
    alunos: [
      { id: '5', nome: 'Lucas Oliveira', presente: null, chegada: null },
      { id: '6', nome: 'Sofia Lima', presente: null, chegada: null },
      { id: '7', nome: 'Gabriel Pereira', presente: null, chegada: null },
    ]
  }
]

type PresencaStatus = true | false | null

export default function PresencasHojePage() {
  const [turmas, setTurmas] = useState(turmasHoje)
  const [turmaSelecionada, setTurmaSelecionada] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const atualizarPresenca = (turmaId: string, alunoId: string, status: PresencaStatus) => {
    setTurmas(prev => prev.map(turma => {
      if (turma.id === turmaId) {
        return {
          ...turma,
          alunos: turma.alunos.map(aluno => {
            if (aluno.id === alunoId) {
              return {
                ...aluno,
                presente: status as boolean | null,
                chegada: status ? new Date().toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : null
              }
            }
            return aluno
          })
        }
      }
      return turma
    }) as typeof turmasHoje)
  }

  const handleSalvarPresencas = async () => {
    setLoading(true)
    try {
      // Aqui seria feita a chamada para a API
      console.log('Salvando presenças:', turmas)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Presenças salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar presenças:', error)
      alert('Erro ao salvar presenças. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleOutroDia = () => {
    setShowDatePicker(true)
  }

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setShowDatePicker(false)
    // Aqui seria feita a busca das presenças para o dia selecionado
    console.log('Carregando presenças para:', e.target.value)
  }

  const marcarTodasPresencas = (turmaId: string, status: PresencaStatus) => {
    setTurmas(prev => prev.map(turma => {
      if (turma.id === turmaId) {
        return {
          ...turma,
          alunos: turma.alunos.map(aluno => ({
            ...aluno,
            presente: status as boolean | null,
            chegada: status ? new Date().toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : null
          }))
        }
      }
      return turma
    }) as typeof turmasHoje)
  }

  const getStatusColor = (status: PresencaStatus) => {
    if (status === true) return 'bg-green-100 text-green-800'
    if (status === false) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: PresencaStatus) => {
    if (status === true) return <CheckCircle className="h-4 w-4" />
    if (status === false) return <XCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const getStatusText = (status: PresencaStatus) => {
    if (status === true) return 'Presente'
    if (status === false) return 'Faltou'
    return 'Pendente'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Presenças - Hoje</h1>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleOutroDia}>
                <Calendar className="h-4 w-4 mr-2" />
                Outro Dia
              </Button>
              {showDatePicker && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleChangeDate}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                />
              )}
              <Button onClick={handleSalvarPresencas} disabled={loading} className="bg-cepin-blue hover:bg-cepin-blue/90">
                {loading ? 'Salvando...' : 'Salvar Presenças'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Turmas Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turmas.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {turmas.reduce((sum, turma) => sum + turma.alunos.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Presentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {turmas.reduce((sum, turma) => 
                  sum + turma.alunos.filter(a => a.presente === true).length, 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Faltas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {turmas.reduce((sum, turma) => 
                  sum + turma.alunos.filter(a => a.presente === false).length, 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Turmas */}
        <div className="space-y-6">
          {turmas.map((turma) => (
            <Card key={turma.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      {turma.nome}
                    </CardTitle>
                    <CardDescription>
                      {turma.horario} • Professor: {turma.professor}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => marcarTodasPresencas(turma.id, true)}
                    >
                      Marcar Todos Presentes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => marcarTodasPresencas(turma.id, false)}
                    >
                      Marcar Todos Faltas
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {turma.alunos.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{aluno.nome}</div>
                        {aluno.chegada && (
                          <div className="text-sm text-gray-500">
                            Chegou às {aluno.chegada}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(aluno.presente)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(aluno.presente)}
                            <span>{getStatusText(aluno.presente)}</span>
                          </div>
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => atualizarPresenca(turma.id, aluno.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => atualizarPresenca(turma.id, aluno.id, false)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {turmas.map((turma) => {
                const presentes = turma.alunos.filter(a => a.presente === true).length
                const faltas = turma.alunos.filter(a => a.presente === false).length
                const pendentes = turma.alunos.filter(a => a.presente === null).length
                const total = turma.alunos.length

                return (
                  <div key={turma.id} className="text-center">
                    <h3 className="font-medium text-gray-900 mb-2">{turma.nome}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Presentes:</span>
                        <span className="font-medium text-green-600">{presentes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Faltas:</span>
                        <span className="font-medium text-red-600">{faltas}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pendentes:</span>
                        <span className="font-medium text-gray-600">{pendentes}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total:</span>
                          <span>{total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
