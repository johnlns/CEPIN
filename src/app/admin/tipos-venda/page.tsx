'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface TipoVenda {
  id: string
  nome: string
  preco: number
}

export default function TiposVendaPage() {
  const [tiposVenda, setTiposVenda] = useState<TipoVenda[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nome: '', preco: '' })
  const [showForm, setShowForm] = useState(false)

  // Carregar tipos de venda do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tiposVenda')
    if (saved) {
      setTiposVenda(JSON.parse(saved))
    }
    // Não carregar tipos padrão - o cliente cadastra como quiser
  }, [])

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100)
  }

  const handleSave = () => {
    if (!formData.nome || !formData.preco) {
      alert('Preencha todos os campos')
      return
    }

    const priceInCents = Math.round(parseFloat(formData.preco) * 100)

    if (editingId) {
      // Editar tipo existente
      const updated = tiposVenda.map(tipo =>
        tipo.id === editingId ? { ...tipo, nome: formData.nome, preco: priceInCents } : tipo
      )
      setTiposVenda(updated)
      localStorage.setItem('tiposVenda', JSON.stringify(updated))
      setEditingId(null)
    } else {
      // Criar novo tipo
      const novo: TipoVenda = {
        id: crypto.randomUUID(),
        nome: formData.nome,
        preco: priceInCents
      }
      const updated = [...tiposVenda, novo]
      setTiposVenda(updated)
      localStorage.setItem('tiposVenda', JSON.stringify(updated))
    }

    setFormData({ nome: '', preco: '' })
    setShowForm(false)
    alert('Tipo de venda salvo com sucesso!')
  }

  const handleEdit = (tipo: TipoVenda) => {
    setFormData({ nome: tipo.nome, preco: (tipo.preco / 100).toString() })
    setEditingId(tipo.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de venda?')) {
      const updated = tiposVenda.filter(tipo => tipo.id !== id)
      setTiposVenda(updated)
      localStorage.setItem('tiposVenda', JSON.stringify(updated))
      alert('Tipo de venda excluído com sucesso!')
    }
  }

  const handleCancel = () => {
    setFormData({ nome: '', preco: '' })
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
              <Link href="/admin">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Painel Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cepin-dark">Tipos de Venda</h1>
          <p className="text-gray-600">Cadastre e gerencie os tipos de produtos/serviços disponíveis para venda</p>
        </div>

        <Card className="mb-8 border-cepin-blue">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-cepin-blue">Lista de Tipos de Venda</CardTitle>
                <CardDescription>Tipos de produtos/serviços cadastrados</CardDescription>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-cepin-blue hover:bg-cepin-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Tipo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tiposVenda.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum tipo de venda cadastrado</p>
            ) : (
              <div className="space-y-2">
                {tiposVenda.map((tipo) => (
                  <div
                    key={tipo.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">{tipo.nome}</h3>
                      <p className="text-sm text-gray-600">{formatPrice(tipo.preco)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(tipo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(tipo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showForm && (
          <Card className="border-cepin-green">
            <CardHeader>
              <CardTitle className="text-cepin-green">
                {editingId ? 'Editar Tipo de Venda' : 'Novo Tipo de Venda'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do tipo de venda' : 'Adicione um novo tipo de produto/serviço'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Tipo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Diária, Pacote 5 aulas, etc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-cepin-green hover:bg-cepin-green/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Criar Tipo'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
