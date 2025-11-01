'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovaTurmaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    modalidade: '',
    professor: '',
    horario: '',
    dias: [] as string[],
    capacidade: '',
    sala: '',
    observacoes: ''
  })

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Dados da turma:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/turmas')
    } catch (error) {
      console.error('Erro ao criar turma:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDiaChange = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova Turma</h1>
              <p className="text-gray-600">Criar nova turma e horário</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/turmas">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-blue">Informações da Turma</CardTitle>
              <CardDescription>Dados básicos da turma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Turma *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Baby Class - 2 a 4 anos"
                  />
                </div>
                <div>
                  <Label htmlFor="modalidade">Modalidade *</Label>
                  <select
                    id="modalidade"
                    name="modalidade"
                    value={formData.modalidade}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                  >
                    <option value="">Selecione</option>
                    <option value="Dança">Dança</option>
                    <option value="Ginástica">Ginástica</option>
                    <option value="Artes Marciais">Artes Marciais</option>
                    <option value="Esportes">Esportes</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="professor">Professor *</Label>
                  <Input
                    id="professor"
                    name="professor"
                    value={formData.professor}
                    onChange={handleChange}
                    required
                    placeholder="Nome do professor"
                  />
                </div>
                <div>
                  <Label htmlFor="sala">Sala *</Label>
                  <Input
                    id="sala"
                    name="sala"
                    value={formData.sala}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Sala 1"
                  />
                </div>
                <div>
                  <Label htmlFor="capacidade">Capacidade Máxima *</Label>
                  <Input
                    id="capacidade"
                    name="capacidade"
                    type="number"
                    min="1"
                    value={formData.capacidade}
                    onChange={handleChange}
                    required
                    placeholder="Número de alunos"
                  />
                </div>
                <div>
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 09:00 - 10:00"
                  />
                </div>
              </div>
              <div>
                <Label>Dias da Semana *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {diasSemana.map(dia => (
                    <label key={dia} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.dias.includes(dia)}
                        onChange={() => handleDiaChange(dia)}
                        className="w-4 h-4 text-cepin-blue rounded focus:ring-cepin-blue"
                      />
                      <span>{dia}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                  placeholder="Observações sobre a turma..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/turmas">
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
                  Criar Turma
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


