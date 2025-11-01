'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovaSessaoPersonalPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const novaSessao = {
        aluno: formData.get('aluno') as string,
        profissional: formData.get('profissional') as string,
        data: formData.get('data') as string,
        horario: formData.get('horario') as string,
        pagador: formData.get('pagador') as string,
        valorCents: Math.round(parseFloat(formData.get('valor') as string) * 100),
        observacoes: formData.get('observacoes') as string || undefined
      }
      
      console.log('Nova sessão:', novaSessao)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Sessão criada com sucesso!')
      // window.location.href = '/personal'
    } catch (error) {
      console.error('Erro ao criar sessão:', error)
      alert('Erro ao criar sessão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cepin-light">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex items-center gap-4">
              <Link href="/personal">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-cepin-blue">
          <CardHeader>
            <CardTitle className="text-cepin-blue">Nova Sessão de Personal</CardTitle>
            <CardDescription>
              Cadastre uma nova sessão de personal training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aluno">Aluno *</Label>
                  <Input
                    id="aluno"
                    name="aluno"
                    required
                    placeholder="Nome do aluno"
                  />
                </div>
                <div>
                  <Label htmlFor="profissional">Profissional *</Label>
                  <Input
                    id="profissional"
                    name="profissional"
                    required
                    placeholder="Nome do profissional"
                  />
                </div>
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    name="horario"
                    required
                    placeholder="Ex: 09:00 - 10:00"
                  />
                </div>
                <div>
                  <Label htmlFor="pagador">Pagador *</Label>
                  <select
                    id="pagador"
                    name="pagador"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                  >
                    <option value="">Selecione</option>
                    <option value="unimed">Unimed</option>
                    <option value="particular">Particular</option>
                    <option value="reembolso">Reembolso</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="valor">Valor da Sessão (R$) *</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                  placeholder="Observações sobre a sessão..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <Link href="/personal">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="bg-cepin-blue hover:bg-cepin-blue/90">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Sessão'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


