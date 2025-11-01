import { getSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import AlunosList from './alunos-list'
import { Header } from '@/components/ui/header'

export default async function AlunosPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  if (!['admin', 'gestor', 'professor'].includes(user.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Gerenciar Alunos"
        subtitle="Cadastro e gestão de alunos"
        user={{
          name: user.name,
          email: user.email,
          role: user.role
        }}
        showBackButton={true}
        backHref="/dashboard"
      >
        <Link href="/alunos/novo">
          <Button className="bg-cepin-blue hover:bg-cepin-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
        </Link>
      </Header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome do aluno..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              Filtrar
            </Button>
          </div>
        </div>

        {/* Stats e Lista de Alunos */}
        <AlunosList />
      </div>
    </div>
  )
}
