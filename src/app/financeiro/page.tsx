'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, TrendingUp, TrendingDown, FileText, Calendar, CreditCard, ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

interface Cobranca {
  id: string
  alunoId: string
  referencia: string
  origem: string
  valorCents: number
  status: string
  createdAt: Date
  paidAt: Date | null
  aluno?: {
    fullName: string
  }
}

interface BoletimItem {
  id: string
  data: Date
  descricao: string
  categoria: string
  subcategoria: string
  origem: string
  valorCents: number
  forma: string
}

interface DespesaFixa {
  id: string
  nome: string
  valorCents: number
  diavencimento: number
  ativa: boolean
}

export default function FinanceiroPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [boletim, setBoletim] = useState<BoletimItem[]>([])
  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([])
  const [loading, setLoading] = useState(false)
  const [showFormCobranca, setShowFormCobranca] = useState(false)
  const [showFormLancamento, setShowFormLancamento] = useState(false)
  const [showFormDespesa, setShowFormDespesa] = useState(false)
  
  const hoje = new Date().toISOString().split('T')[0]
  const mesAtual = hoje.substring(0, 7) // YYYY-MM

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    // Por enquanto, dados mockados até integrar com as APIs
    setCobrancas([])
    setBoletim([])
    setDespesasFixas([])
  }

  const totalReceitas = boletim
    .filter(item => item.categoria === 'receita')
    .reduce((sum, item) => sum + item.valorCents, 0)

  const totalDespesas = boletim
    .filter(item => item.categoria === 'despesa')
    .reduce((sum, item) => sum + item.valorCents, 0)

  const saldo = totalReceitas - totalDespesas

  const cobrancasPendentes = cobrancas.filter(c => c.status === 'pendente').length
  const valorPendente = cobrancas
    .filter(c => c.status === 'pendente')
    .reduce((sum, c) => sum + c.valorCents, 0)

  const handleGerarCobrancas = async () => {
    if (!confirm('Deseja gerar as cobranças do mês para todos os alunos ativos?')) return
    
    setLoading(true)
    try {
      alert('Funcionalidade em desenvolvimento. Em breve as cobranças serão geradas automaticamente.')
    } catch (error) {
      console.error('Erro ao gerar cobranças:', error)
      alert('Erro ao gerar cobranças')
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarPago = async (cobrancaId: string) => {
    if (!confirm('Confirmar pagamento desta cobrança?')) return
    
    try {
      alert('Funcionalidade em desenvolvimento. Em breve você poderá marcar cobranças como pagas.')
      await carregarDados()
    } catch (error) {
      console.error('Erro ao marcar como pago:', error)
      alert('Erro ao processar pagamento')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
                <p className="text-gray-600">Gestão financeira e controle de caixa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleGerarCobrancas} disabled={loading}>
                <DollarSign className="h-4 w-4 mr-2" />
                Gerar Cobranças
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {(totalReceitas / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Total recebido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {(totalDespesas / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                Total gasto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(saldo / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500">
                {saldo >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cobranças Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{cobrancasPendentes}</div>
              <p className="text-xs text-gray-500">
                R$ {(valorPendente / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cobrancas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="cobrancas">
              <CreditCard className="h-4 w-4 mr-2" />
              Cobranças
            </TabsTrigger>
            <TabsTrigger value="caixa">
              <DollarSign className="h-4 w-4 mr-2" />
              Boletim de Caixa
            </TabsTrigger>
            <TabsTrigger value="contas-fixas">
              <Calendar className="h-4 w-4 mr-2" />
              Contas Fixas
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Cobranças Tab */}
          <TabsContent value="cobrancas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cobranças</h2>
              <Button onClick={() => setShowFormCobranca(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Cobrança
              </Button>
            </div>

            {cobrancas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhuma cobrança cadastrada ainda.</p>
                  <p className="text-sm">Clique em &quot;Nova Cobrança&quot; ou &quot;Gerar Cobranças&quot; para começar.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Cobranças Pendentes</CardTitle>
                    <CardDescription>
                      Cobranças aguardando pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cobrancas.filter(c => c.status === 'pendente').map((cobranca) => (
                        <div key={cobranca.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{cobranca.aluno?.fullName || 'Aluno'}</div>
                            <div className="text-sm text-gray-500">{cobranca.referencia}</div>
                            <div className="text-xs text-gray-400">
                              Criada em {new Date(cobranca.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium">
                                R$ {(cobranca.valorCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Pendente
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarcarPago(cobranca.id)}
                            >
                              Marcar Pago
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cobranças Pagas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cobrancas.filter(c => c.status === 'pago').map((cobranca) => (
                        <div key={cobranca.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{cobranca.aluno?.fullName || 'Aluno'}</div>
                            <div className="text-sm text-gray-500">{cobranca.referencia}</div>
                            <div className="text-xs text-gray-400">
                              Pago em {cobranca.paidAt ? new Date(cobranca.paidAt).toLocaleDateString('pt-BR') : '-'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium">
                                R$ {(cobranca.valorCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Pago
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Caixa Tab */}
          <TabsContent value="caixa" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Boletim de Caixa</h2>
              <Button onClick={() => setShowFormLancamento(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Lançamento
              </Button>
            </div>

            {boletim.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhuma movimentação registrada ainda.</p>
                  <p className="text-sm">Clique em &quot;Novo Lançamento&quot; para começar.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Movimentações Recentes</CardTitle>
                  <CardDescription>
                    Entradas e saídas de caixa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {boletim.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.descricao}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(item.data).toLocaleDateString('pt-BR')} • {item.subcategoria}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.origem} • {item.forma}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`text-right font-medium ${
                            item.categoria === 'receita' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.categoria === 'receita' ? '+' : '-'}R$ {(item.valorCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <Badge className={
                            item.categoria === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }>
                            {item.categoria === 'receita' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contas Fixas Tab */}
          <TabsContent value="contas-fixas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Despesas Fixas</h2>
              <Button onClick={() => setShowFormDespesa(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa Fixa
              </Button>
            </div>

            {despesasFixas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhuma despesa fixa cadastrada ainda.</p>
                  <p className="text-sm">Clique em &quot;Nova Despesa Fixa&quot; para começar.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Despesas Fixas Mensais</CardTitle>
                  <CardDescription>
                    Contas que se repetem mensalmente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {despesasFixas.filter(d => d.ativa).map((despesa) => (
                      <div key={despesa.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{despesa.nome}</div>
                          <div className="text-sm text-gray-500">
                            Vencimento: dia {despesa.diavencimento}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">
                              R$ {(despesa.valorCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              Mensal
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
                <CardDescription>
                  Relatórios e análises financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Fluxo de Caixa
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Receitas por Origem
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    Inadimplência
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    DRE Mensal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {(totalReceitas / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">Receitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      R$ {(totalDespesas / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">Despesas</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {(saldo / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">Saldo Líquido</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Placeholder */}
        {(showFormCobranca || showFormLancamento || showFormDespesa) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  {showFormCobranca && 'Nova Cobrança'}
                  {showFormLancamento && 'Novo Lançamento'}
                  {showFormDespesa && 'Nova Despesa Fixa'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Funcionalidade em desenvolvimento. Em breve você poderá cadastrar diretamente aqui.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowFormCobranca(false)
                      setShowFormLancamento(false)
                      setShowFormDespesa(false)
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
