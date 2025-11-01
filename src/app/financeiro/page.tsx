import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, TrendingUp, TrendingDown, FileText, Calendar, CreditCard } from 'lucide-react'

// Mock data - em produção viria dos serviços financeiros
const cobrancas = [
  {
    id: '1',
    aluno: 'Ana Clara Silva',
    referencia: '2024-01 - Futebol Sub-10',
    origem: 'modalidade',
    valorCents: 12000,
    status: 'pago',
    createdAt: '2024-01-15',
    paidAt: '2024-01-16'
  },
  {
    id: '2',
    aluno: 'Pedro Henrique Costa',
    referencia: 'Personal Unimed - Janeiro',
    origem: 'personal',
    valorCents: 24000,
    status: 'pendente',
    createdAt: '2024-01-20',
    paidAt: null
  }
]

const boletimCaixa = [
  {
    id: '1',
    data: '2024-01-20',
    descricao: 'Recebimento mensalidade Ana Clara',
    categoria: 'receita',
    subcategoria: 'Modalidades',
    origem: 'contrato',
    valorCents: 12000,
    forma: 'pix'
  },
  {
    id: '2',
    data: '2024-01-20',
    descricao: 'Pagamento energia elétrica',
    categoria: 'despesa',
    subcategoria: 'Utilidades',
    origem: 'outros',
    valorCents: 80000,
    forma: 'boleto'
  }
]

const contasFixas = [
  {
    id: '1',
    nome: 'Aluguel do Espaço',
    valorCents: 250000,
    vencimento: '2024-02-05',
    status: 'aberto'
  },
  {
    id: '2',
    nome: 'Energia Elétrica',
    valorCents: 80000,
    vencimento: '2024-02-15',
    status: 'pago'
  }
]

export default function FinanceiroPage() {
  const hoje = new Date().toISOString().split('T')[0]
  const mesAtual = hoje.substring(0, 7) // YYYY-MM

  const totalReceitas = boletimCaixa
    .filter(item => item.categoria === 'receita')
    .reduce((sum, item) => sum + item.valorCents, 0)

  const totalDespesas = boletimCaixa
    .filter(item => item.categoria === 'despesa')
    .reduce((sum, item) => sum + item.valorCents, 0)

  const saldo = totalReceitas - totalDespesas

  const cobrancasPendentes = cobrancas.filter(c => c.status === 'pendente').length
  const valorPendente = cobrancas
    .filter(c => c.status === 'pendente')
    .reduce((sum, c) => sum + c.valorCents, 0)

  const contasVencidas = contasFixas.filter(c => c.status === 'aberto').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
              <p className="text-gray-600">Gestão financeira e controle de caixa</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Voltar</Button>
              <Button>
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
                R$ {(totalReceitas / 100).toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-gray-500">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {(totalDespesas / 100).toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-gray-500">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                -5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(saldo / 100).toLocaleString('pt-BR')}
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
                R$ {(valorPendente / 100).toLocaleString('pt-BR')}
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
              <div className="flex space-x-2">
                <Button variant="outline">
                  Gerar Cobranças do Mês
                </Button>
                <Button>
                  Nova Cobrança
                </Button>
              </div>
            </div>

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
                        <div className="font-medium text-gray-900">{cobranca.aluno}</div>
                        <div className="text-sm text-gray-500">{cobranca.referencia}</div>
                        <div className="text-xs text-gray-400">
                          Criada em {new Date(cobranca.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            R$ {(cobranca.valorCents / 100).toLocaleString('pt-BR')}
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pendente
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Gerar Link PIX
                          </Button>
                          <Button variant="outline" size="sm">
                            Marcar Pago
                          </Button>
                        </div>
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
                        <div className="font-medium text-gray-900">{cobranca.aluno}</div>
                        <div className="text-sm text-gray-500">{cobranca.referencia}</div>
                        <div className="text-xs text-gray-400">
                          Pago em {new Date(cobranca.paidAt!).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            R$ {(cobranca.valorCents / 100).toLocaleString('pt-BR')}
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
          </TabsContent>

          {/* Caixa Tab */}
          <TabsContent value="caixa" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Boletim de Caixa</h2>
              <Button>
                Novo Lançamento
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Movimentações Recentes</CardTitle>
                <CardDescription>
                  Entradas e saídas de caixa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boletimCaixa.map((item) => (
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
                          {item.categoria === 'receita' ? '+' : '-'}R$ {(item.valorCents / 100).toLocaleString('pt-BR')}
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
          </TabsContent>

          {/* Contas Fixas Tab */}
          <TabsContent value="contas-fixas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Contas Fixas</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  Gerar Contas do Mês
                </Button>
                <Button>
                  Nova Conta Fixa
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contas do Mês</CardTitle>
                <CardDescription>
                  Contas fixas para {mesAtual}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contasFixas.map((conta) => (
                    <div key={conta.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{conta.nome}</div>
                        <div className="text-sm text-gray-500">
                          Vencimento: {new Date(conta.vencimento).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">
                            R$ {(conta.valorCents / 100).toLocaleString('pt-BR')}
                          </div>
                          <Badge className={
                            conta.status === 'pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }>
                            {conta.status === 'pago' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                        {conta.status !== 'pago' && (
                          <Button variant="outline" size="sm">
                            Marcar Pago
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      R$ {(totalReceitas / 100).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">Receitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      R$ {(totalDespesas / 100).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">Despesas</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {(saldo / 100).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">Saldo Líquido</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
