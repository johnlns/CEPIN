'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Users, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

// Mock data - em produção viria de queries reais
const modalidades = [
  {
    id: 1,
    nome: 'Baby Class',
    descricao: 'Dança para crianças de 2 a 4 anos',
    idadeMinima: 2,
    idadeMaxima: 4,
    precoMensal: 12000, // em centavos
    diasSemana: ['Segunda', 'Quarta'],
    horario: '09:00 - 10:00',
    capacidade: 12,
    vagasDisponiveis: 4,
    professor: 'Ana Silva'
  },
  {
    id: 2,
    nome: 'Jazz Infantil',
    descricao: 'Dança jazz para crianças de 5 a 8 anos',
    idadeMinima: 5,
    idadeMaxima: 8,
    precoMensal: 15000,
    diasSemana: ['Terça', 'Quinta'],
    horario: '14:00 - 15:00',
    capacidade: 15,
    vagasDisponiveis: 3,
    professor: 'Carlos Santos'
  },
  {
    id: 3,
    nome: 'Ballet Clássico',
    descricao: 'Ballet clássico para crianças de 6 a 10 anos',
    idadeMinima: 6,
    idadeMaxima: 10,
    precoMensal: 18000,
    diasSemana: ['Segunda', 'Quarta', 'Sexta'],
    horario: '16:00 - 17:00',
    capacidade: 10,
    vagasDisponiveis: 0,
    professor: 'Maria Oliveira'
  },
  {
    id: 4,
    nome: 'Hip Hop Teen',
    descricao: 'Hip hop para adolescentes de 11 a 15 anos',
    idadeMinima: 11,
    idadeMaxima: 15,
    precoMensal: 20000,
    diasSemana: ['Terça', 'Quinta'],
    horario: '18:00 - 19:00',
    capacidade: 20,
    vagasDisponiveis: 5,
    professor: 'João Costa'
  },
  {
    id: 5,
    nome: 'Ginástica Rítmica',
    descricao: 'Ginástica rítmica para crianças de 7 a 12 anos',
    idadeMinima: 7,
    idadeMaxima: 12,
    precoMensal: 16000,
    diasSemana: ['Segunda', 'Quarta'],
    horario: '10:00 - 11:00',
    capacidade: 8,
    vagasDisponiveis: 2,
    professor: 'Patricia Lima'
  }
]

export default function MatriculaPage() {
  const [selectedModalidade, setSelectedModalidade] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nomeAluno: '',
    dataNascimento: '',
    nomeResponsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    endereco: '',
    observacoes: ''
  })

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100)
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getAvailableModalidades = () => {
    const age = calculateAge(formData.dataNascimento)
    return modalidades.filter(mod => 
      mod.vagasDisponiveis > 0 && 
      age >= mod.idadeMinima && 
      age <= mod.idadeMaxima
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModalidade) return

    const modalidade = modalidades.find(m => m.id === selectedModalidade)
    if (!modalidade) return

    try {
      const response = await fetch('/api/matriculas-publicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          modalidadeId: selectedModalidade.toString(),
          modalidadeNome: modalidade.nome
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Matrícula solicitada com sucesso! Entraremos em contato em breve.')
        // Limpar formulário
        setFormData({
          nomeAluno: '',
          dataNascimento: '',
          nomeResponsavel: '',
          telefoneResponsavel: '',
          emailResponsavel: '',
          endereco: '',
          observacoes: ''
        })
        setSelectedModalidade(null)
      } else {
        alert(data.message || 'Erro ao realizar matrícula. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao realizar matrícula:', error)
      alert('Erro ao realizar matrícula. Tente novamente.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const availableModalidades = getAvailableModalidades()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Matrícula Online</h1>
              <p className="text-gray-600">Faça a matrícula do seu filho na CEPIN</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-cepin-blue">Dados para Matrícula</CardTitle>
                <CardDescription>Preencha os dados do aluno e responsável</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nomeAluno">Nome do Aluno *</Label>
                    <Input
                      id="nomeAluno"
                      name="nomeAluno"
                      value={formData.nomeAluno}
                      onChange={handleChange}
                      required
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      required
                    />
                    {formData.dataNascimento && (
                      <p className="text-sm text-gray-600 mt-1">
                        Idade: {calculateAge(formData.dataNascimento)} anos
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
                    <Input
                      id="nomeResponsavel"
                      name="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={handleChange}
                      required
                      placeholder="Nome completo do responsável"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneResponsavel">Telefone do Responsável *</Label>
                    <Input
                      id="telefoneResponsavel"
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailResponsavel">E-mail do Responsável</Label>
                    <Input
                      id="emailResponsavel"
                      name="emailResponsavel"
                      type="email"
                      value={formData.emailResponsavel}
                      onChange={handleChange}
                      placeholder="responsavel@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
                      placeholder="Alergias, restrições, observações médicas, etc."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Modalidades Disponíveis */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-cepin-green">Modalidades Disponíveis</CardTitle>
                <CardDescription>
                  {formData.dataNascimento 
                    ? `Modalidades adequadas para ${calculateAge(formData.dataNascimento)} anos`
                    : 'Selecione a data de nascimento para ver as modalidades'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.dataNascimento ? (
                  <div className="space-y-4">
                    {availableModalidades.length > 0 ? (
                      availableModalidades.map(modalidade => (
                        <div
                          key={modalidade.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedModalidade === modalidade.id
                              ? 'border-cepin-blue bg-cepin-blue/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedModalidade(modalidade.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{modalidade.nome}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              {modalidade.vagasDisponiveis} vagas
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{modalidade.descricao}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {modalidade.horario} • {modalidade.diasSemana.join(', ')}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Prof. {modalidade.professor}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              {formatPrice(modalidade.precoMensal)}/mês
                            </div>
                          </div>
                          {selectedModalidade === modalidade.id && (
                            <div className="mt-2 flex items-center text-cepin-blue">
                              <Check className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Selecionada</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhuma modalidade disponível
                        </h3>
                        <p className="text-gray-600">
                          Não há vagas disponíveis para a idade informada.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecione a data de nascimento
                    </h3>
                    <p className="text-gray-600">
                      Para ver as modalidades disponíveis, informe a data de nascimento do aluno.
                    </p>
                  </div>
                )}

                {selectedModalidade && (
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      onClick={handleSubmit}
                      className="w-full bg-cepin-blue hover:bg-cepin-blue/90"
                      disabled={!formData.nomeAluno || !formData.dataNascimento || !formData.nomeResponsavel || !formData.telefoneResponsavel}
                    >
                      Realizar Matrícula
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
