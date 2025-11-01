'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function TurmaAlunosPage() {
  // Mock data - em produção viria de queries reais
  const alunos = [
    { id: 1, nome: 'Ana Clara Silva', idade: 7, responsavel: 'Maria Silva', telefone: '(11) 99999-9999' },
    { id: 2, nome: 'Pedro Santos', idade: 8, responsavel: 'João Santos', telefone: '(11) 88888-8888' },
    { id: 3, nome: 'Julia Oliveira', idade: 7, responsavel: 'Carlos Oliveira', telefone: '(11) 77777-7777' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alunos da Turma</h1>
              <p className="text-gray-600">Baby Class - 2 a 4 anos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/turmas">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-cepin-blue mr-2" />
              <h2 className="text-lg font-semibold">
                {alunos.length} {alunos.length === 1 ? 'aluno matriculado' : 'alunos matriculados'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Idade</th>
                    <th className="text-left py-3 px-4">Responsável</th>
                    <th className="text-left py-3 px-4">Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(aluno => (
                    <tr key={aluno.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{aluno.nome}</td>
                      <td className="py-3 px-4">{aluno.idade} anos</td>
                      <td className="py-3 px-4">{aluno.responsavel}</td>
                      <td className="py-3 px-4">{aluno.telefone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


