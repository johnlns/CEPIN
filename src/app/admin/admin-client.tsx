'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  ShoppingBag,
  GraduationCap,
  UserCheck,
  BookOpen,
  Bell
} from 'lucide-react'

interface AdminDashboardClientProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const adminModules = [
    {
      title: 'Despesas Fixas',
      description: 'Controle mensal das despesas fixas da CEPIN',
      icon: DollarSign,
      href: '/admin/despesas-fixas',
      color: 'cepin-red',
      stats: '32 categorias'
    },
    {
      title: 'Receitas Mensais',
      description: 'Gestão de receitas e cobranças mensais',
      icon: TrendingUp,
      href: '/admin/receitas-mensais',
      color: 'cepin-green',
      stats: 'R$ 45.600'
    },
    {
      title: 'Boletim de Caixa',
      description: 'Controle detalhado de entradas e saídas',
      icon: FileText,
      href: '/admin/boletim-caixa',
      color: 'cepin-blue',
      stats: 'R$ 12.300'
    },
    {
      title: 'Modalidades',
      description: 'Gerencie as modalidades disponíveis para os alunos',
      icon: GraduationCap,
      href: '/admin/modalidades',
      color: 'cepin-blue',
      stats: 'Esportes'
    },
    {
      title: 'Professores',
      description: 'Gerencie o cadastro de professores e profissionais',
      icon: UserCheck,
      href: '/admin/professores',
      color: 'cepin-green',
      stats: 'Profissionais'
    },
    {
      title: 'Alunos',
      description: 'Gerencie o cadastro completo de alunos',
      icon: BookOpen,
      href: '/admin/alunos',
      color: 'cepin-blue',
      stats: 'Estudantes'
    },
    {
      title: 'Solicitações do Site',
      description: 'Gerencie matrículas e agendamentos do site público',
      icon: Bell,
      href: '/admin/solicitacoes',
      color: 'cepin-yellow',
      stats: 'Pendentes'
    },
    {
      title: 'Usuários do Sistema',
      description: 'Gerencie usuários e suas permissões',
      icon: Shield,
      href: '/admin/usuarios',
      color: 'cepin-red',
      stats: 'Controle'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-cepin-dark mb-2">
          Bem-vindo ao Controle Administrativo CEPIN
        </h2>
        <p className="text-lg text-gray-600">
          Gerencie todas as operações financeiras e administrativas da academia
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-cepin-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cepin-blue">Mês Atual</CardTitle>
            <Calendar className="h-4 w-4 text-cepin-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cepin-dark">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-cepin-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cepin-green">Status Sistema</CardTitle>
            <Shield className="h-4 w-4 text-cepin-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cepin-dark">Online</div>
          </CardContent>
        </Card>

        <Card className="border-cepin-yellow/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cepin-yellow">Módulos</CardTitle>
            <Settings className="h-4 w-4 text-cepin-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cepin-dark">8</div>
          </CardContent>
        </Card>

        <Card className="border-cepin-red/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cepin-red">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-cepin-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cepin-dark">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminModules.map((module) => {
          const IconComponent = module.icon
          return (
            <Link key={module.title} href={module.href}>
              <Card className={`border-${module.color}/20 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-${module.color}/10 group-hover:bg-${module.color}/20 transition-colors`}>
                      <IconComponent className={`h-6 w-6 text-${module.color}`} />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium text-${module.color}`}>
                        {module.stats}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-900 group-hover:text-gray-700">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* System Info */}
      <Card className="border-cepin-blue/20">
        <CardHeader>
          <CardTitle className="text-cepin-blue flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
          <CardDescription>
            Visão geral das funcionalidades e recursos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recursos Financeiros</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Controle de Despesas Fixas</li>
                <li>• Gestão de Receitas Mensais</li>
                <li>• Boletim de Caixa Detalhado</li>
                <li>• Relatórios Financeiros</li>
                <li>• Cobranças Automáticas</li>
                <li>• Projeções e Análises</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recursos Administrativos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestão de Usuários</li>
                <li>• Controle de Acessos</li>
                <li>• Relatórios Avançados</li>
                <li>• Exportação de Dados</li>
                <li>• Notificações Automáticas</li>
                <li>• Backup Automático</li>
                <li>• Integração com Pagamentos</li>
                <li>• Dashboard Analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}