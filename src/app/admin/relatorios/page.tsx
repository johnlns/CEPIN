'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, FileText, Download, BarChart3, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function RelatoriosPage() {
  const [periodoInicio, setPeriodoInicio] = useState('')
  const [periodoFim, setPeriodoFim] = useState('')
  const [tipoRelatorio, setTipoRelatorio] = useState('financeiro')
  const [dadosRelatorio, setDadosRelatorio] = useState<any>(null)
  const [carregando, setCarregando] = useState(false)

  const tiposRelatorio = [
    {
      id: 'financeiro',
      nome: 'Relatório Financeiro',
      descricao: 'Receitas, despesas e fluxo de caixa',
      icon: DollarSign,
      color: 'cepin-green'
    },
    {
      id: 'atendimentos',
      nome: 'Relatório de Atendimentos',
      descricao: 'Sessões realizadas por profissional',
      icon: Users,
      color: 'cepin-blue'
    },
    {
      id: 'alunos',
      nome: 'Relatório de Alunos',
      descricao: 'Cadastro e frequência de alunos',
      icon: Users,
      color: 'cepin-yellow'
    },
    {
      id: 'mensal',
      nome: 'Relatório Mensal',
      descricao: 'Visão geral do mês',
      icon: Calendar,
      color: 'cepin-red'
    }
  ]

  const buscarDadosRelatorio = async () => {
    setCarregando(true)
    
    try {
      // Simular busca de dados do localStorage
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let dados: any = {}
      
      if (tipoRelatorio === 'financeiro') {
        const alunosSaved = localStorage.getItem('alunos')
        const receitasSaved = localStorage.getItem('receitasMensais')
        const despesasSaved = localStorage.getItem('despesasFixas')
        
        dados = {
          totalAlunos: alunosSaved ? JSON.parse(alunosSaved).length : 0,
          totalReceitas: 50000,
          totalDespesas: 30000,
          saldo: 20000,
          periodo: `${periodoInicio} a ${periodoFim}`
        }
      } else if (tipoRelatorio === 'atendimentos') {
        dados = {
          totalAtendimentos: 45,
          totalValor: 45000,
          atendimentosUnimed: 30,
          atendimentosParticular: 15,
          periodo: `${periodoInicio} a ${periodoFim}`
        }
      } else if (tipoRelatorio === 'alunos') {
        const alunosSaved = localStorage.getItem('alunos')
        const alunos = alunosSaved ? JSON.parse(alunosSaved) : []
        
        dados = {
          totalAlunos: alunos.length,
          alunosAtivos: alunos.filter((a: any) => !a.inativo).length,
          alunosInativos: alunos.filter((a: any) => a.inativo).length,
          periodo: `${periodoInicio} a ${periodoFim}`
        }
      } else if (tipoRelatorio === 'mensal') {
        const alunosSaved = localStorage.getItem('alunos')
        const professoresSaved = localStorage.getItem('professores')
        
        dados = {
          totalAlunos: alunosSaved ? JSON.parse(alunosSaved).length : 0,
          totalProfessores: professoresSaved ? JSON.parse(professoresSaved).length : 0,
          periodo: `${periodoInicio} a ${periodoFim}`
        }
      }
      
      setDadosRelatorio(dados)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      alert('Erro ao gerar relatório')
    } finally {
      setCarregando(false)
    }
  }

  const handleGerarRelatorio = () => {
    if (!periodoInicio || !periodoFim) {
      alert('Por favor, selecione o período inicial e final')
      return
    }
    
    if (new Date(periodoInicio) > new Date(periodoFim)) {
      alert('A data inicial não pode ser maior que a data final')
      return
    }

    buscarDadosRelatorio()
  }

  const handleExportarPDF = () => {
    alert('Exportando relatório em PDF...')
  }

  const handleExportarExcel = () => {
    alert('Exportando relatório em Excel...')
  }

  return (
    <div className="min-h-screen bg-cepin-light">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-cepin-dark">Relatórios</h1>
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
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-cepin-dark">Configurar Relatório</CardTitle>
            <CardDescription>
              Selecione o tipo de relatório e o período desejado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tipoRelatorio">Tipo de Relatório *</Label>
                <select
                  id="tipoRelatorio"
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                >
                  {tiposRelatorio.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="periodoInicio">Data Inicial *</Label>
                <Input
                  id="periodoInicio"
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="periodoFim">Data Final *</Label>
                <Input
                  id="periodoFim"
                  type="date"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleGerarRelatorio}
                  disabled={carregando}
                  className="w-full bg-cepin-blue hover:bg-cepin-blue/90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {carregando ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Relatório */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tiposRelatorio.map(tipo => {
            const IconComponent = tipo.icon
            return (
              <Card 
                key={tipo.id} 
                className={`border-${tipo.color}/20 cursor-pointer hover:shadow-lg transition-all ${tipoRelatorio === tipo.id ? 'ring-2 ring-cepin-blue' : ''}`}
                onClick={() => setTipoRelatorio(tipo.id)}
              >
                <CardHeader>
                  <div className={`p-3 rounded-lg bg-${tipo.color}/10 w-fit mb-2`}>
                    <IconComponent className={`w-6 h-6 text-${tipo.color}`} />
                  </div>
                  <CardTitle className="text-cepin-dark">{tipo.nome}</CardTitle>
                  <CardDescription>{tipo.descricao}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Preview do Relatório */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-cepin-dark">Visualização do Relatório</CardTitle>
                <CardDescription>
                  {tiposRelatorio.find(t => t.id === tipoRelatorio)?.nome}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportarPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={handleExportarExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cepin-blue mx-auto mb-4"></div>
                  <p className="text-gray-600">Gerando relatório...</p>
                </div>
              </div>
            ) : dadosRelatorio ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-cepin-blue/10 to-cepin-green/10 rounded-lg p-6 border border-cepin-blue/20">
                  <h3 className="text-xl font-bold text-cepin-dark mb-2">
                    {tiposRelatorio.find(t => t.id === tipoRelatorio)?.nome}
                  </h3>
                  <p className="text-gray-600">Período: {dadosRelatorio.periodo}</p>
                </div>

                {tipoRelatorio === 'financeiro' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-cepin-green/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total Receitas</div>
                        <div className="text-2xl font-bold text-cepin-green">
                          R$ {dadosRelatorio.totalReceitas?.toLocaleString('pt-BR') || '0'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-red/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total Despesas</div>
                        <div className="text-2xl font-bold text-cepin-red">
                          R$ {dadosRelatorio.totalDespesas?.toLocaleString('pt-BR') || '0'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-blue/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Saldo</div>
                        <div className="text-2xl font-bold text-cepin-blue">
                          R$ {dadosRelatorio.saldo?.toLocaleString('pt-BR') || '0'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-yellow/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total Alunos</div>
                        <div className="text-2xl font-bold text-cepin-yellow">
                          {dadosRelatorio.totalAlunos || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {tipoRelatorio === 'atendimentos' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-cepin-blue/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total Atendimentos</div>
                        <div className="text-2xl font-bold text-cepin-blue">
                          {dadosRelatorio.totalAtendimentos || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-green/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Valor Total</div>
                        <div className="text-2xl font-bold text-cepin-green">
                          R$ {dadosRelatorio.totalValor?.toLocaleString('pt-BR') || '0'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-yellow/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">UNIMED</div>
                        <div className="text-2xl font-bold text-cepin-yellow">
                          {dadosRelatorio.atendimentosUnimed || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-red/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Particular</div>
                        <div className="text-2xl font-bold text-cepin-red">
                          {dadosRelatorio.atendimentosParticular || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {tipoRelatorio === 'alunos' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-cepin-blue/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total de Alunos</div>
                        <div className="text-2xl font-bold text-cepin-blue">
                          {dadosRelatorio.totalAlunos || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-green/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Alunos Ativos</div>
                        <div className="text-2xl font-bold text-cepin-green">
                          {dadosRelatorio.alunosAtivos || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-red/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Alunos Inativos</div>
                        <div className="text-2xl font-bold text-cepin-red">
                          {dadosRelatorio.alunosInativos || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {tipoRelatorio === 'mensal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-cepin-blue/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total de Alunos</div>
                        <div className="text-2xl font-bold text-cepin-blue">
                          {dadosRelatorio.totalAlunos || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-cepin-green/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-gray-600 mb-1">Total de Professores</div>
                        <div className="text-2xl font-bold text-cepin-green">
                          {dadosRelatorio.totalProfessores || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                <div>
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Selecione o período e clique em &quot;Gerar Relatório&quot; para visualizar os dados
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

