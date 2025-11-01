import { getSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './admin-client'

export default async function AdminDashboardPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  if (!['admin', 'gestor'].includes(user.role)) {
    redirect('/dashboard')
  }

  return <AdminDashboardClient user={user} />
}


