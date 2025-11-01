'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface Modalidade {
  id: string
  tipo: 'contraturno' | 'personal' | 'modalidade'
  nome: string
  descricao: string
  beneficios: string[]
  faixaEtaria: string
  horarios: string[]
  valor: number // em centavos
  popular: boolean
}

export default function CadastroModalidadesPage() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tipo: 'modalidade' as Modalidade['tipo'],
    nome: '',
    descricao: '',
    beneficios: '',
    faixaEtaria: '',
    horarios: '',
    valor: '',
    popular: false
  })

  // Carregar modalidades do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('modalidades')
    if (saved) {
      setModalidades(JSON.parse(saved))
    }
  }, [])

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100)
  }

  const handleSave = () => {
    if (!formData.nome || !formData.descricao || !formData.valor) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const priceInCents = Math.round(parseFloat(formData.valor) * 100)
    const beneficios = formData.beneficios.split('\n').filter(b => b.trim())
    const horarios = formData.horarios.split('\n').filter(h => h.trim())

    if (editingId) {
      // Editar modalidade existente
      const updated = modalidades.map(mod =>
        mod.id === editingId ? {
          ...mod,
          tipo: formData.tipo,
          nome: formData.nome,
          descricao: formData.descricao,
          beneficios,
          faixaEtaria: formData.faixaEtaria,
          horarios,
          valor: priceInCents,
          popular: formData.popular
        } : mod
      )
      setModalidades(updated)
      localStorage.setItem('modalidades', JSON.stringify(updated))
      setEditingId(null)
    } else {
      // Criar nova modalidade
      const nova: Modalidade = {
        id: crypto.randomUUID(),
        tipo: formData.tipo,
        nome: formData.nome,
        descricao: formData.descricao,
        beneficios,
        faixaEtaria: formData.faixaEtaria,
        horarios,
        valor: priceInCents,
        popular: formData.popular
      }
      const updated = [...modalidades, nova]
      setModalidades(updated)
      localStorage.setItem('modalidades', JSON.stringify(updated))
    }

    setFormData({
      tipo: 'modalidade',
      nome: '',
      descricao: '',
      beneficios: '',
      faixaEtaria: '',
      horarios: '',
      valor: '',
      popular: false
    })
    setShowForm(false)
    alert('Modalidade salva com sucesso!')
  }

  const handleEdit = (modalidade: Modalidade) => {
    setFormData({
      tipo: modalidade.tipo,
      nome: modalidade.nome,
      descricao: modalidade.descricao,
      beneficios: modalidade.beneficios.join('\n'),
      faixaEtaria: modalidade.faixaEtaria,
      horarios: modalidade.horarios.join('\n'),
      valor: (modalidade.valor / 100).toString(),
      popular: modalidade.popular
    })
    setEditingId(modalidade.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta modalidade?')) {
      const updated = modalidades.filter(mod => mod.id !== id)
      setModalidades(updated)
      localStorage.setItem('modalidades', JSON.stringify(updated))
      alert('Modalidade excluída com sucesso!')
    }
  }

  const handleCancel = () => {
    setFormData({
      tipo: 'modalidade',
      nome: '',
      descricao: '',
      beneficios: '',
      faixaEtaria: '',
      horarios: '',
      valor: '',
      popular: false
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
              <h1 className="text-2xl font-bold text-cepin-dark">Cadastro de Modalidades</h1>
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
            Nova Modalidade
          </Button>
        </div>

        {(showForm || editingId) && (
          <Card className="mb-6 border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue">
                {editingId ? 'Editar Modalidade' : 'Nova Modalidade'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações da modalidade.' : 'Adicione uma nova modalidade disponível para os alunos.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo *</Label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Modalidade['tipo'] })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="modalidade">Modalidade</option>
                      <option value="contraturno">Contraturno</option>
                      <option value="personal">Personal Training</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="nome">Nome da Modalidade *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      placeholder="Ex: Natação Iniciante"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Descrição detalhada da modalidade..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="faixaEtaria">Faixa Etária</Label>
                    <Input
                      id="faixaEtaria"
                      name="faixaEtaria"
                      value={formData.faixaEtaria}
                      onChange={(e) => setFormData({ ...formData, faixaEtaria: e.target.value })}
                      placeholder="Ex: 4-12 anos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor Mensal (R$) *</Label>
                    <Input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="horarios">Horários (um por linha)</Label>
                    <textarea
                      id="horarios"
                      name="horarios"
                      value={formData.horarios}
                      onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Ex: 14:00-15:00 (Seg/Qua)&#10;15:30-16:30 (Ter/Qui)"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="beneficios">Benefícios (um por linha)</Label>
                    <textarea
                      id="beneficios"
                      name="beneficios"
                      value={formData.beneficios}
                      onChange={(e) => setFormData({ ...formData, beneficios: e.target.value })}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Ex: Desenvolvimento motor&#10;Trabalho em equipe&#10;Coordenação e agilidade"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-cepin-blue border-gray-300 rounded focus:ring-cepin-blue"
                    />
                    <Label htmlFor="popular">Marcar como popular</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-cepin-blue hover:bg-cepin-blue/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Salvar Alterações' : 'Adicionar Modalidade'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-cepin-dark">Modalidades Cadastradas</CardTitle>
            <CardDescription>Gerencie todas as modalidades disponíveis para os alunos.</CardDescription>
          </CardHeader>
          <CardContent>
            {modalidades.length === 0 ? (
              <p className="text-gray-600">Nenhuma modalidade cadastrada ainda. Clique em &quot;Nova Modalidade&quot; para começar.</p>
            ) : (
              <div className="space-y-4">
                {modalidades.map(mod => (
                  <div key={mod.id} className="p-4 rounded-lg border bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-cepin-dark text-lg">{mod.nome}</h3>
                        <p className="text-sm text-gray-600">{mod.descricao}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(mod)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(mod.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span> {mod.tipo}
                      </div>
                      <div>
                        <span className="font-medium">Faixa Etária:</span> {mod.faixaEtaria || 'Não especificado'}
                      </div>
                      <div>
                        <span className="font-medium">Valor:</span> {formatPrice(mod.valor)}
                      </div>
                    </div>
                    {mod.horarios.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-sm">Horários:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {mod.horarios.map((horario, idx) => (
                            <li key={idx}>{horario}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mod.beneficios.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-sm">Benefícios:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {mod.beneficios.map((beneficio, idx) => (
                            <li key={idx}>{beneficio}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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

