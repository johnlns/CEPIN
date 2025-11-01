'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Plus, Edit, Trash2, Save, Users } from 'lucide-react'
import Link from 'next/link'

interface Aluno {
  id: string
  fullName: string
  birthdate: string
  notes?: string
  saude: {
    possuiProblema: boolean
    laudo?: string
    apoioEspecial?: string
    alergias?: string
    convenio?: string
    tipoSanguineo?: string
  }
  autorizados: Array<{
    nome: string
    parentesco: string
    telefone: string
  }>
}

export default function AdminAlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    birthdate: '',
    notes: '',
    possuiProblema: false,
    laudo: '',
    apoioEspecial: '',
    alergias: '',
    convenio: '',
    tipoSanguineo: '',
    autorizadoNome: '',
    autorizadoParentesco: '',
    autorizadoTelefone: ''
  })
  const [autorizados, setAutorizados] = useState<Array<{ nome: string; parentesco: string; telefone: string }>>([])

  useEffect(() => {
    const saved = localStorage.getItem('alunos')
    if (saved) {
      setAlunos(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    if (!formData.fullName || !formData.birthdate) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (editingId) {
      const updated = alunos.map(a =>
        a.id === editingId ? {
          ...a,
          fullName: formData.fullName,
          birthdate: formData.birthdate,
          notes: formData.notes,
          saude: {
            possuiProblema: formData.possuiProblema,
            laudo: formData.laudo,
            apoioEspecial: formData.apoioEspecial,
            alergias: formData.alergias,
            convenio: formData.convenio,
            tipoSanguineo: formData.tipoSanguineo
          },
          autorizados: autorizados
        } : a
      )
      setAlunos(updated)
      localStorage.setItem('alunos', JSON.stringify(updated))
      setEditingId(null)
    } else {
      const novo: Aluno = {
        id: crypto.randomUUID(),
        fullName: formData.fullName,
        birthdate: formData.birthdate,
        notes: formData.notes,
        saude: {
          possuiProblema: formData.possuiProblema,
          laudo: formData.laudo,
          apoioEspecial: formData.apoioEspecial,
          alergias: formData.alergias,
          convenio: formData.convenio,
          tipoSanguineo: formData.tipoSanguineo
        },
        autorizados: autorizados
      }
      const updated = [...alunos, novo]
      setAlunos(updated)
      localStorage.setItem('alunos', JSON.stringify(updated))
    }

    // Reset form
    setFormData({
      fullName: '',
      birthdate: '',
      notes: '',
      possuiProblema: false,
      laudo: '',
      apoioEspecial: '',
      alergias: '',
      convenio: '',
      tipoSanguineo: '',
      autorizadoNome: '',
      autorizadoParentesco: '',
      autorizadoTelefone: ''
    })
    setAutorizados([])
    setShowForm(false)
    alert('Aluno salvo com sucesso!')
  }

  const handleEdit = (aluno: Aluno) => {
    setFormData({
      fullName: aluno.fullName,
      birthdate: aluno.birthdate,
      notes: aluno.notes || '',
      possuiProblema: aluno.saude.possuiProblema,
      laudo: aluno.saude.laudo || '',
      apoioEspecial: aluno.saude.apoioEspecial || '',
      alergias: aluno.saude.alergias || '',
      convenio: aluno.saude.convenio || '',
      tipoSanguineo: aluno.saude.tipoSanguineo || '',
      autorizadoNome: '',
      autorizadoParentesco: '',
      autorizadoTelefone: ''
    })
    setAutorizados(aluno.autorizados)
    setEditingId(aluno.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      const updated = alunos.filter(a => a.id !== id)
      setAlunos(updated)
      localStorage.setItem('alunos', JSON.stringify(updated))
      alert('Aluno excluído com sucesso!')
    }
  }

  const handleAddAutorizado = () => {
    if (formData.autorizadoNome && formData.autorizadoParentesco && formData.autorizadoTelefone) {
      setAutorizados([...autorizados, {
        nome: formData.autorizadoNome,
        parentesco: formData.autorizadoParentesco,
        telefone: formData.autorizadoTelefone
      }])
      setFormData({ ...formData, autorizadoNome: '', autorizadoParentesco: '', autorizadoTelefone: '' })
    }
  }

  const handleRemoveAutorizado = (index: number) => {
    setAutorizados(autorizados.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setFormData({
      fullName: '',
      birthdate: '',
      notes: '',
      possuiProblema: false,
      laudo: '',
      apoioEspecial: '',
      alergias: '',
      convenio: '',
      tipoSanguineo: '',
      autorizadoNome: '',
      autorizadoParentesco: '',
      autorizadoTelefone: ''
    })
    setAutorizados([])
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
              <h1 className="text-2xl font-bold text-cepin-dark">Cadastro de Alunos</h1>
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
            Novo Aluno
          </Button>
        </div>

        {(showForm || editingId) && (
          <Card className="mb-6 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingId ? 'Editar Aluno' : 'Novo Aluno'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do aluno.' : 'Cadastre um novo aluno.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">Data de Nascimento *</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Observações</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Observações gerais sobre o aluno..."
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Informações de Saúde</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="possuiProblema"
                        checked={formData.possuiProblema}
                        onChange={(e) => setFormData({ ...formData, possuiProblema: e.target.checked })}
                        className="h-4 w-4 text-cepin-blue focus:ring-cepin-blue border-gray-300 rounded"
                      />
                      <Label htmlFor="possuiProblema">Possui problema de saúde</Label>
                    </div>
                    {formData.possuiProblema && (
                      <>
                        <div>
                          <Label htmlFor="laudo">Laudo Médico</Label>
                          <Input
                            id="laudo"
                            value={formData.laudo}
                            onChange={(e) => setFormData({ ...formData, laudo: e.target.value })}
                            placeholder="Descrição do problema"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apoioEspecial">Apoio Especial Necessário</Label>
                          <Input
                            id="apoioEspecial"
                            value={formData.apoioEspecial}
                            onChange={(e) => setFormData({ ...formData, apoioEspecial: e.target.value })}
                            placeholder="Ex: Inalador, medicamentos..."
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="alergias">Alergias</Label>
                      <Input
                        id="alergias"
                        value={formData.alergias}
                        onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                        placeholder="Ex: Nenhuma, Lactose..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="convenio">Convênio</Label>
                      <Input
                        id="convenio"
                        value={formData.convenio}
                        onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                        placeholder="Ex: Unimed, Particular..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                      <Input
                        id="tipoSanguineo"
                        value={formData.tipoSanguineo}
                        onChange={(e) => setFormData({ ...formData, tipoSanguineo: e.target.value })}
                        placeholder="Ex: A+, O-..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Pessoas Autorizadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="autorizadoNome">Nome</Label>
                      <Input
                        id="autorizadoNome"
                        value={formData.autorizadoNome}
                        onChange={(e) => setFormData({ ...formData, autorizadoNome: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="autorizadoParentesco">Parentesco</Label>
                      <Input
                        id="autorizadoParentesco"
                        value={formData.autorizadoParentesco}
                        onChange={(e) => setFormData({ ...formData, autorizadoParentesco: e.target.value })}
                        placeholder="Ex: Mãe, Pai..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="autorizadoTelefone">Telefone</Label>
                      <Input
                        id="autorizadoTelefone"
                        value={formData.autorizadoTelefone}
                        onChange={(e) => setFormData({ ...formData, autorizadoTelefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  <Button type="button" onClick={handleAddAutorizado} variant="outline" className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Autorizado
                  </Button>
                  {autorizados.length > 0 && (
                    <div className="space-y-2">
                      {autorizados.map((aut, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div>
                            <span className="font-medium">{aut.nome}</span> - {aut.parentesco} - {aut.telefone}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAutorizado(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-cepin-blue hover:bg-cepin-blue/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">Alunos Cadastrados</CardTitle>
            <CardDescription>Gerencie todos os alunos da academia.</CardDescription>
          </CardHeader>
          <CardContent>
            {alunos.length === 0 ? (
              <p className="text-gray-600">Nenhum aluno cadastrado ainda. Clique em "Novo Aluno" para começar.</p>
            ) : (
              <div className="space-y-4">
                {alunos.map(aluno => (
                  <div key={aluno.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div>
                      <h3 className="font-semibold text-cepin-dark">{aluno.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        Nascimento: {new Date(aluno.birthdate).toLocaleDateString('pt-BR')}
                      </p>
                      {aluno.saude.convenio && (
                        <p className="text-sm text-gray-500">Convênio: {aluno.saude.convenio}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(aluno)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(aluno.id)}>
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

