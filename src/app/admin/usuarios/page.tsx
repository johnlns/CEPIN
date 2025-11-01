'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Plus, Edit, Trash2, Save, Users, Shield } from 'lucide-react'
import Link from 'next/link'

interface Usuario {
  id: string
  name: string
  email: string
  role: 'admin' | 'gestor' | 'professor' | 'recepcionista'
  permissoes: {
    alunos: boolean
    turmas: boolean
    vendas: boolean
    presencas: boolean
    financeiro: boolean
    personal: boolean
    relatorios: boolean
  }
  ativo: boolean
}

const PERMISSOES_PADRAO = {
  admin: {
    alunos: true,
    turmas: true,
    vendas: true,
    presencas: true,
    financeiro: true,
    personal: true,
    relatorios: true
  },
  gestor: {
    alunos: true,
    turmas: true,
    vendas: true,
    presencas: true,
    financeiro: true,
    personal: true,
    relatorios: true
  },
  professor: {
    alunos: true,
    turmas: true,
    vendas: false,
    presencas: true,
    financeiro: false,
    personal: true,
    relatorios: false
  },
  recepcionista: {
    alunos: true,
    turmas: false,
    vendas: true,
    presencas: true,
    financeiro: false,
    personal: false,
    relatorios: false
  }
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'professor' as Usuario['role'],
    permissoes: PERMISSOES_PADRAO.professor,
    ativo: true
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('/api/admin/usuarios')
      const data = await response.json()
      
      if (data.success) {
        setUsuarios(data.usuarios)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      alert('Erro ao carregar usuários')
    }
  }

  const handleRoleChange = (role: Usuario['role']) => {
    setFormData({
      ...formData,
      role,
      permissoes: PERMISSOES_PADRAO[role]
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        // Atualizar usuário existente
        const response = await fetch(`/api/admin/usuarios/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
          }),
        })
        
        const data = await response.json()
        
        if (!data.success) {
          alert(data.message || 'Erro ao atualizar usuário')
          return
        }
        
        setEditingId(null)
      } else {
        // Criar novo usuário
        const response = await fetch('/api/admin/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
          }),
        })
        
        const data = await response.json()
        
        if (!data.success) {
          alert(data.message || 'Erro ao criar usuário')
          return
        }
      }

      setFormData({
        name: '',
        email: '',
        role: 'professor',
        permissoes: PERMISSOES_PADRAO.professor,
        ativo: true
      })
      setShowForm(false)
      alert('Usuário salvo com sucesso!')
      
      // Recarregar lista
      await carregarUsuarios()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      alert('Erro ao salvar usuário')
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setFormData(usuario)
    setEditingId(usuario.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await fetch(`/api/admin/usuarios/${id}`, {
          method: 'DELETE',
        })
        
        const data = await response.json()
        
        if (data.success) {
          alert('Usuário excluído com sucesso!')
          await carregarUsuarios()
        } else {
          alert(data.message || 'Erro ao excluir usuário')
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        alert('Erro ao excluir usuário')
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      role: 'professor',
      permissoes: PERMISSOES_PADRAO.professor,
      ativo: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      gestor: 'bg-blue-100 text-blue-800',
      professor: 'bg-green-100 text-green-800',
      recepcionista: 'bg-yellow-100 text-yellow-800'
    }
    return <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{role}</Badge>
  }

  return (
    <div className="min-h-screen bg-cepin-light">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-cepin-dark">Cadastro de Usuários</h1>
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
            Novo Usuário
          </Button>
        </div>

        {(showForm || editingId) && (
          <Card className="mb-6 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingId ? 'Editar Usuário' : 'Novo Usuário'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações e permissões do usuário.' : 'Cadastre um novo usuário do sistema.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Função *</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value as Usuario['role'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="admin">Administrador</option>
                      <option value="gestor">Gestor</option>
                      <option value="professor">Professor</option>
                      <option value="recepcionista">Recepcionista</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="ativo"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                      className="h-4 w-4 text-cepin-blue focus:ring-cepin-blue border-gray-300 rounded"
                    />
                    <Label htmlFor="ativo">Usuário Ativo</Label>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Permissões do Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.permissoes).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: {
                              ...formData.permissoes,
                              [key]: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-cepin-blue focus:ring-cepin-blue border-gray-300 rounded"
                        />
                        <Label htmlFor={key} className="capitalize">{key}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-cepin-blue hover:bg-cepin-blue/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">Usuários Cadastrados</CardTitle>
            <CardDescription>Gerencie todos os usuários do sistema e suas permissões.</CardDescription>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <p className="text-gray-600">Nenhum usuário cadastrado ainda. Clique em &quot;Novo Usuário&quot; para começar.</p>
            ) : (
              <div className="space-y-4">
                {usuarios.map(usuario => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-cepin-dark">{usuario.name}</h3>
                        {getRoleBadge(usuario.role)}
                        {!usuario.ativo && <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Permissões: {Object.entries(usuario.permissoes).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(usuario)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(usuario.id)}>
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


