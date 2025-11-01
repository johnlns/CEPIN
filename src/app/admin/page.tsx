import { getSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './admin-client'
import { Header } from '@/components/ui/header'

export default async function AdminDashboardPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  if (!['admin', 'gestor'].includes(user.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Painel Administrativo"
        subtitle="Gestão completa do sistema CEPIN"
        user={{
          name: user.name,
          email: user.email,
          role: user.role
        }}
        showBackButton={true}
        backHref="/dashboard"
      />
      <AdminDashboardClient user={user} />
    </div>
  )
}