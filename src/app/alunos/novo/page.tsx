'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovoAlunoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    nomeResponsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    observacoes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Buscar alunos existentes do localStorage
      const alunosExistentes = JSON.parse(localStorage.getItem('alunos') || '[]')
      
      // Criar novo aluno com estrutura compatível com o admin
      const novoAluno = {
        id: crypto.randomUUID(),
        fullName: formData.nome,
        birthdate: formData.dataNascimento,
        notes: formData.observacoes || undefined,
        saude: {
          possuiProblema: false,
          alergias: '',
          convenio: '',
          tipoSanguineo: ''
        },
        autorizados: [{
          nome: formData.nomeResponsavel,
          parentesco: 'Responsável',
          telefone: formData.telefoneResponsavel
        }]
      }
      
      // Adicionar novo aluno à lista
      const alunosAtualizados = [...alunosExistentes, novoAluno]
      
      // Salvar no localStorage
      localStorage.setItem('alunos', JSON.stringify(alunosAtualizados))
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      alert('Aluno cadastrado com sucesso!')
      
      // Redirecionar para a lista de alunos
      router.push('/alunos')
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error)
      alert('Erro ao cadastrar aluno')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Aluno</h1>
              <p className="text-gray-600">Cadastrar novo aluno na CEPIN</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/alunos">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-blue">Dados Pessoais</CardTitle>
              <CardDescription>Informações básicas do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Digite o nome completo"
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
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aluno@email.com"
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
              </div>
            </CardContent>
          </Card>

          {/* Dados do Responsável */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-green">Dados do Responsável</CardTitle>
              <CardDescription>Informações do responsável legal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-yellow">Observações</CardTitle>
              <CardDescription>Informações adicionais sobre o aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
                  placeholder="Alergias, restrições, observações médicas, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Link href="/alunos">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-cepin-blue hover:bg-cepin-blue/90">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Aluno
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
