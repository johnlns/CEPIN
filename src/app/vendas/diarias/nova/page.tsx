'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

interface TipoVenda {
  id: string
  nome: string
  preco: number
}

const formasPagamento = [
  { id: 'dinheiro', nome: 'Dinheiro' },
  { id: 'pix', nome: 'PIX' },
  { id: 'cartao_debito', nome: 'Cartão de Débito' },
  { id: 'cartao_credito', nome: 'Cartão de Crédito' },
]

export default function NovaVendaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tiposVenda, setTiposVenda] = useState<TipoVenda[]>([])
  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    tipoVenda: '',
    quantidade: 1,
    formaPagamento: '',
    observacoes: '',
    desconto: 0
  })

  // Carregar tipos de venda do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tiposVenda')
    if (saved) {
      setTiposVenda(JSON.parse(saved))
    }
    // Não carregar tipos padrão - o cliente cadastra como quiser
  }, [])

  const selectedTipo = tiposVenda.find(t => t.id === formData.tipoVenda)
  const valorBase = selectedTipo ? selectedTipo.preco * formData.quantidade : 0
  const valorDesconto = Math.round(valorBase * (formData.desconto / 100))
  const valorTotal = valorBase - valorDesconto

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Aqui seria feita a chamada para a API
      console.log('Dados da venda:', {
        ...formData,
        valorBase,
        valorDesconto,
        valorTotal
      })
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a lista de vendas
      router.push('/vendas/diarias')
    } catch (error) {
      console.error('Erro ao registrar venda:', error)
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

  const handleQuantidadeChange = (delta: number) => {
    const newQuantidade = Math.max(1, formData.quantidade + delta)
    setFormData(prev => ({
      ...prev,
      quantidade: newQuantidade
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova Venda Avulsa</h1>
              <p className="text-gray-600">Registrar venda de diária ou pacote</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendas/diarias">
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
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-blue">Dados do Cliente</CardTitle>
              <CardDescription>Informações do cliente que está comprando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clienteNome">Nome do Cliente *</Label>
                  <Input
                    id="clienteNome"
                    name="clienteNome"
                    value={formData.clienteNome}
                    onChange={handleChange}
                    required
                    placeholder="Nome completo do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="clienteTelefone">Telefone *</Label>
                  <Input
                    id="clienteTelefone"
                    name="clienteTelefone"
                    value={formData.clienteTelefone}
                    onChange={handleChange}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="clienteEmail">E-mail</Label>
                  <Input
                    id="clienteEmail"
                    name="clienteEmail"
                    type="email"
                    value={formData.clienteEmail}
                    onChange={handleChange}
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produto/Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-green">Produto/Serviço</CardTitle>
              <CardDescription>Selecione o tipo de venda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tiposVenda.length === 0 ? (
                <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800 mb-2">
                    ⚠️ Nenhum tipo de venda cadastrado ainda.
                  </p>
                  <Link href="/admin/tipos-venda" className="text-sm text-cepin-blue hover:underline">
                    Cadastre tipos de venda aqui →
                  </Link>
                </div>
              ) : (
                <div>
                  <Label htmlFor="tipoVenda">Tipo de Venda *</Label>
                  <select
                    id="tipoVenda"
                    name="tipoVenda"
                    value={formData.tipoVenda}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
                  >
                    <option value="">Selecione o tipo de venda</option>
                    {tiposVenda.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome} - {formatPrice(tipo.preco)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedTipo && (
                <div>
                  <Label>Quantidade</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantidadeChange(-1)}
                      disabled={formData.quantidade <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantidadeChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-yellow">Pagamento</CardTitle>
              <CardDescription>Forma de pagamento e valores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <select
                  id="formaPagamento"
                  name="formaPagamento"
                  value={formData.formaPagamento}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue focus:border-transparent"
                >
                  <option value="">Selecione a forma de pagamento</option>
                  {formasPagamento.map(forma => (
                    <option key={forma.id} value={forma.id}>
                      {forma.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="desconto">Desconto (%)</Label>
                <Input
                  id="desconto"
                  name="desconto"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.desconto}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              {/* Resumo dos Valores */}
              {selectedTipo && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Valor Base:</span>
                    <span>{formatPrice(valorBase)}</span>
                  </div>
                  {formData.desconto > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto ({formData.desconto}%):</span>
                      <span>-{formatPrice(valorDesconto)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-cepin-blue">{formatPrice(valorTotal)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cepin-red">Observações</CardTitle>
              <CardDescription>Informações adicionais sobre a venda</CardDescription>
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
                  placeholder="Observações sobre a venda..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Link href="/vendas/diarias">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading || !formData.clienteNome || !formData.clienteTelefone || !formData.tipoVenda || !formData.formaPagamento} 
              className="bg-cepin-blue hover:bg-cepin-blue/90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Venda
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
