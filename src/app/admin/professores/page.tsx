'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Plus, Edit, Trash2, Save, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'

interface Professor {
  id: string
  nome: string
  especialidade: string
  telefone: string
  email: string
  cpf: string
  rg: string
  endereco: string
  observacoes?: string
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    telefone: '',
    email: '',
    cpf: '',
    rg: '',
    endereco: '',
    observacoes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('professores')
    if (saved) {
      setProfessores(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    if (!formData.nome || !formData.especialidade) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (editingId) {
      const updated = professores.map(p =>
        p.id === editingId ? { ...p, ...formData } : p
      )
      setProfessores(updated)
      localStorage.setItem('professores', JSON.stringify(updated))
      setEditingId(null)
    } else {
      const novo: Professor = {
        id: crypto.randomUUID(),
        ...formData
      }
      const updated = [...professores, novo]
      setProfessores(updated)
      localStorage.setItem('professores', JSON.stringify(updated))
    }

    setFormData({
      nome: '',
      especialidade: '',
      telefone: '',
      email: '',
      cpf: '',
      rg: '',
      endereco: '',
      observacoes: ''
    })
    setShowForm(false)
    alert('Professor salvo com sucesso!')
  }

  const handleEdit = (professor: Professor) => {
    setFormData({
      nome: professor.nome,
      especialidade: professor.especialidade,
      telefone: professor.telefone,
      email: professor.email,
      cpf: professor.cpf,
      rg: professor.rg,
      endereco: professor.endereco,
      observacoes: professor.observacoes || ''
    })
    setEditingId(professor.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      const updated = professores.filter(p => p.id !== id)
      setProfessores(updated)
      localStorage.setItem('professores', JSON.stringify(updated))
      alert('Professor excluído com sucesso!')
    }
  }

  const handleCancel = () => {
    setFormData({
      nome: '',
      especialidade: '',
      telefone: '',
      email: '',
      cpf: '',
      rg: '',
      endereco: '',
      observacoes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-cepin-light">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-cepin-dark">Cadastro de Professores</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel Admin
            </Button>
          </Link>
          <Button onClick={() => setShowForm(true)} className="bg-cepin-blue hover:bg-cepin-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Professor
          </Button>
        </div>

        {(showForm || editingId) && (
          <Card className="mb-6 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingId ? 'Editar Professor' : 'Novo Professor'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do professor.' : 'Cadastre um novo professor.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="especialidade">Especialidade *</Label>
                    <Input
                      id="especialidade"
                      name="especialidade"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                      required
                      placeholder="Ex: Natação, Futebol, Personal..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      name="rg"
                      value={formData.rg}
                      onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      placeholder="Endereço completo"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Observações adicionais..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-cepin-blue hover:bg-cepin-blue/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Adicionar Professor'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">Professores Cadastrados</CardTitle>
            <CardDescription>Gerencie todos os professores da academia.</CardDescription>
          </CardHeader>
          <CardContent>
            {professores.length === 0 ? (
              <p className="text-gray-600">Nenhum professor cadastrado ainda. Clique em "Novo Professor" para começar.</p>
            ) : (
              <div className="space-y-4">
                {professores.map(professor => (
                  <div key={professor.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div>
                      <h3 className="font-semibold text-cepin-dark">{professor.nome}</h3>
                      <p className="text-sm text-gray-600">{professor.especialidade}</p>
                      <p className="text-sm text-gray-500">{professor.telefone} • {professor.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(professor)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(professor.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



