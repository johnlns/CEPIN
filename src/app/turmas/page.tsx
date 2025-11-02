'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Users, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Turma {
  id: string
  esporte: string
  nome: string
  faixaEtaria: string
  capacidade: number
  professorId: string
  professor?: {
    id: string
    name: string
    email: string
  }
  horarios: {
    id: string
    weekday: number
    startTime: string
    endTime: string
  }[]
  createdAt: Date | string
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModalidade, setFilterModalidade] = useState('todas')

  useEffect(() => {
    carregarTurmas()
  }, [])

  const carregarTurmas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/turmas')
      const data = await response.json()
      
      if (data.success) {
        setTurmas(data.turmas)
      } else {
        alert(data.message || 'Erro ao carregar turmas')
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error)
      alert('Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }

  const filteredTurmas = turmas.filter(turma => {
    const matchesSearch = turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turma.professor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModalidade = filterModalidade === 'todas' || turma.esporte === filterModalidade
    return matchesSearch && matchesModalidade
  })

  const modalidades = ['todas', ...Array.from(new Set(turmas.map(t => t.esporte)))]

  const formatHorarios = (horarios: Turma['horarios']) => {
    if (!horarios || horarios.length === 0) return 'Sem horários'
    
    // Agrupar por horário
    const horariosUnicos = Array.from(new Set(horarios.map(h => `${h.startTime} - ${h.endTime}`)))
    const dias = Array.from(new Set(horarios.map(h => WEEKDAYS[h.weekday]))).join(', ')
    
    return `${horariosUnicos[0]} • ${dias}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Turmas e Horários</h1>
              <p className="text-gray-600">Gerenciar modalidades e horários das aulas</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Link href="/turmas/nova">
                <Button className="bg-cepin-blue hover:bg-cepin-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Turma
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar turma
              </label>
              <input
                type="text"
                placeholder="Nome da turma ou professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <select
                value={filterModalidade}
                onChange={(e) => setFilterModalidade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
              >
                {modalidades.map(modalidade => (
                  <option key={modalidade} value={modalidade}>
                    {modalidade === 'todas' ? 'Todas as modalidades' : modalidade}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setFilterModalidade('todas')
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cepin-blue/10 rounded-lg">
                  <Users className="h-6 w-6 text-cepin-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                  <p className="text-2xl font-bold text-gray-900">{turmas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cepin-green/10 rounded-lg">
                  <Users className="h-6 w-6 text-cepin-green" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Capacidade Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {turmas.reduce((acc, turma) => acc + turma.capacidade, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cepin-yellow/10 rounded-lg">
                  <Clock className="h-6 w-6 text-cepin-yellow" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Modalidades</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.from(new Set(turmas.map(t => t.esporte))).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cepin-red/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-cepin-red" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Professores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.from(new Set(turmas.map(t => t.professorId))).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Turmas */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando turmas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTurmas.map(turma => (
              <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{turma.nome}</CardTitle>
                      <CardDescription className="mt-1">
                        {turma.esporte} • {turma.professor?.name || 'Professor não definido'}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ativa
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatHorarios(turma.horarios)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Faixa etária: {turma.faixaEtaria}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Capacidade: {turma.capacidade} alunos
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Link href={`/turmas/${turma.id}/editar`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/turmas/${turma.id}/alunos`}>
                      <Button size="sm" className="bg-cepin-blue hover:bg-cepin-blue/90">
                        Ver Alunos
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTurmas.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  )
}
