'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Aluno {
  id: string
  fullName: string
  birthdate: string
  notes?: string
  saude: {
    possuiProblema: boolean
    alergias?: string
    convenio?: string
    tipoSanguineo?: string
  }
  autorizados: Array<{
    nome: string
    parentesco: string
    telefone: string
  }>
}

export default function AlunosList() {
  const router = useRouter()
  const [alunosList, setAlunosList] = useState<Aluno[]>([])

  useEffect(() => {
    // Carregar alunos do localStorage
    const saved = localStorage.getItem('alunos')
    if (saved) {
      setAlunosList(JSON.parse(saved))
    }
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      const updated = alunosList.filter(a => a.id !== id)
      setAlunosList(updated)
      localStorage.setItem('alunos', JSON.stringify(updated))
      alert('Aluno excluído com sucesso!')
    }
  }

  const handleView = (id: string) => {
    alert(`Visualizando aluno ${id}`)
    // Aqui você pode implementar a navegação para detalhes do aluno
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/alunos`)
    // Aqui você pode implementar a navegação para edição do aluno
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunosList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Com Problemas de Saúde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alunosList.filter(a => a.saude?.possuiProblema).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Convenio Unimed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alunosList.filter(a => a.saude?.convenio === 'Unimed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Particular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alunosList.filter(a => a.saude?.convenio === 'Particular').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alunos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            {alunosList.length} aluno(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Idade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Convênio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Saúde</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Autorizados</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosList.map((aluno) => {
                const idade = new Date().getFullYear() - new Date(aluno.birthdate).getFullYear()
                return (
                  <tr key={aluno.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{aluno.fullName}</div>
                        {aluno.notes && (
                          <div className="text-sm text-gray-500">{aluno.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {idade} anos
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={aluno.saude?.convenio === 'Unimed' ? 'default' : 'secondary'}>
                        {aluno.saude?.convenio || 'Não informado'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {aluno.saude?.possuiProblema ? (
                        <Badge variant="destructive">Atenção</Badge>
                      ) : (
                        <Badge variant="outline">Normal</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {aluno.autorizados?.length || 0} pessoa(s)
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(aluno.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(aluno.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(aluno.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
      </Card>
    </>
  )
}

