'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { LogOut, User, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  subtitle?: string
  user?: {
    name: string
    email: string
    role: string
  }
  showBackButton?: boolean
  backHref?: string
  children?: React.ReactNode
}

export function Header({ 
  title, 
  subtitle, 
  user, 
  showBackButton = false, 
  backHref = '/dashboard',
  children 
}: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/login')
        router.refresh()
      } else {
        console.error('Erro ao fazer logout')
        // Mesmo com erro, redireciona para login
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, redireciona para login
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            {(title || subtitle) && (
              <div>
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {children}
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="w-8 h-8 bg-cepin-blue rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}


