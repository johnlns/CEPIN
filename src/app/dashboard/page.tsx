import { getSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, GraduationCap, Calendar, DollarSign, Activity, UserCheck, Shield } from 'lucide-react'
import { Header } from '@/components/ui/header'

export default async function DashboardPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  // Mock data - em produção viria de queries reais
  const stats = {
    alunos: 127,
    turmas: 15,
    matriculas: 142,
    receitaMes: 45600,
    sessoesPersonal: 23,
    aulasHoje: 8
  }

  const quickActions = [
    {
      title: 'Gerenciar Alunos',
      description: 'Cadastrar e editar alunos',
      href: '/alunos',
      icon: Users,
      color: 'bg-cepin-blue'
    },
    {
      title: 'Turmas e Horários',
      description: 'Gerenciar modalidades',
      href: '/turmas',
      icon: GraduationCap,
      color: 'bg-cepin-green'
    },
    {
      title: 'Presenças Hoje',
      description: 'Marcar presenças',
      href: '/presencas/hoje',
      icon: UserCheck,
      color: 'bg-cepin-yellow'
    },
    {
      title: 'Personal Training',
      description: 'Agenda e fechamentos',
      href: '/personal',
      icon: Activity,
      color: 'bg-cepin-red'
    },
    {
      title: 'Financeiro',
      description: 'Cobranças e caixa',
      href: '/financeiro',
      icon: DollarSign,
      color: 'bg-cepin-blue'
    },
    {
      title: 'Vendas Avulsas',
      description: 'Diárias e pacotes',
      href: '/vendas/diarias',
      icon: Calendar,
      color: 'bg-cepin-green'
    }
  ]

  return (
    <div className="min-h-screen bg-cepin-light">
      <Header 
        user={{
          name: user.name,
          email: user.email,
          role: user.role
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cepin-dark mb-2">
            Bem-vindo, {user.name}
          </h1>
          <p className="text-lg text-gray-600">
            Dashboard principal do sistema CEPIN
          </p>
        </div>

        {/* Admin Access */}
        {user.role === 'admin' && (
          <Card className="mb-8 border-cepin-blue/20 bg-cepin-blue/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-cepin-blue" />
                <CardTitle className="text-cepin-blue">Acesso Administrativo</CardTitle>
              </div>
              <CardDescription>
                Controle total do sistema administrativo e financeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="bg-cepin-blue hover:bg-cepin-blue/90">
                  <Shield className="w-4 h-4 mr-2" />
                  Acessar Painel Administrativo
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-cepin-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-blue">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-cepin-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{stats.alunos}</div>
              <p className="text-xs text-gray-600">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-cepin-green/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-green">Turmas Ativas</CardTitle>
              <GraduationCap className="h-4 w-4 text-cepin-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{stats.turmas}</div>
              <p className="text-xs text-gray-600">
                {stats.matriculas} matrículas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="border-cepin-yellow/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-yellow">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-cepin-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">
                R$ {(stats.receitaMes / 100).toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-gray-600">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-cepin-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cepin-red">Aulas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-cepin-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cepin-dark">{stats.aulasHoje}</div>
              <p className="text-xs text-gray-600">
                {stats.sessoesPersonal} sessões personal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-cepin-dark mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-cepin-blue/20">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-cepin-dark">{action.title}</CardTitle>
                        <CardDescription className="text-gray-600">{action.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-cepin-blue/20">
            <CardHeader>
              <CardTitle className="text-cepin-dark">Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-cepin-green rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova matrícula criada</p>
                    <p className="text-xs text-gray-500">João Silva - Futebol Sub-10</p>
                  </div>
                  <span className="text-xs text-gray-400">2h atrás</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-cepin-blue rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sessão de personal realizada</p>
                    <p className="text-xs text-gray-500">Ana Clara - Prof. Maria</p>
                  </div>
                  <span className="text-xs text-gray-400">4h atrás</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-cepin-yellow rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pagamento recebido</p>
                    <p className="text-xs text-gray-500">Pedro Henrique - R$ 120,00</p>
                  </div>
                  <span className="text-xs text-gray-400">1d atrás</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cepin-green/20">
            <CardHeader>
              <CardTitle className="text-cepin-dark">Próximas Aulas</CardTitle>
              <CardDescription>Aulas agendadas para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Futebol Sub-10</p>
                    <p className="text-xs text-gray-500">14:00 - 15:00</p>
                  </div>
                  <span className="text-xs bg-cepin-blue/20 text-cepin-blue px-2 py-1 rounded">
                    12 alunos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Natação Iniciante</p>
                    <p className="text-xs text-gray-500">15:00 - 16:00</p>
                  </div>
                  <span className="text-xs bg-cepin-green/20 text-cepin-green px-2 py-1 rounded">
                    8 alunos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Personal - Ana Clara</p>
                    <p className="text-xs text-gray-500">09:00 - 10:00</p>
                  </div>
                  <span className="text-xs bg-cepin-yellow/20 text-cepin-yellow px-2 py-1 rounded">
                    Unimed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
