import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Users, MapPin, Phone } from 'lucide-react'

// Mock data - em produção viria do banco de dados
const horarios = [
  {
    dia: 'Segunda-feira',
    turmas: [
      {
        nome: 'Futebol Sub-10',
        horario: '14:00 - 15:00',
        faixaEtaria: '6-10 anos',
        professor: 'Maria Silva',
        capacidade: 15,
        vagas: 3
      },
      {
        nome: 'Natação Iniciante',
        horario: '16:30 - 17:30',
        faixaEtaria: '4-8 anos',
        professor: 'Carlos Santos',
        capacidade: 12,
        vagas: 5
      },
      {
        nome: 'Dança e Ballet',
        horario: '16:00 - 17:00',
        faixaEtaria: '4-14 anos',
        professor: 'Ana Costa',
        capacidade: 10,
        vagas: 2
      },
      {
        nome: 'Artes Marciais',
        horario: '18:00 - 19:00',
        faixaEtaria: '5-15 anos',
        professor: 'Roberto Lima',
        capacidade: 12,
        vagas: 4
      }
    ]
  },
  {
    dia: 'Terça-feira',
    turmas: [
      {
        nome: 'Natação Iniciante',
        horario: '15:00 - 16:00',
        faixaEtaria: '4-8 anos',
        professor: 'Carlos Santos',
        capacidade: 12,
        vagas: 5
      },
      {
        nome: 'Dança e Ballet',
        horario: '17:30 - 18:30',
        faixaEtaria: '4-14 anos',
        professor: 'Ana Costa',
        capacidade: 10,
        vagas: 2
      },
      {
        nome: 'Artes Marciais',
        horario: '17:00 - 18:00',
        faixaEtaria: '5-15 anos',
        professor: 'Roberto Lima',
        capacidade: 12,
        vagas: 4
      }
    ]
  },
  {
    dia: 'Quarta-feira',
    turmas: [
      {
        nome: 'Futebol Sub-10',
        horario: '14:00 - 15:00',
        faixaEtaria: '6-10 anos',
        professor: 'Maria Silva',
        capacidade: 15,
        vagas: 3
      },
      {
        nome: 'Natação Iniciante',
        horario: '16:30 - 17:30',
        faixaEtaria: '4-8 anos',
        professor: 'Carlos Santos',
        capacidade: 12,
        vagas: 5
      },
      {
        nome: 'Dança e Ballet',
        horario: '16:00 - 17:00',
        faixaEtaria: '4-14 anos',
        professor: 'Ana Costa',
        capacidade: 10,
        vagas: 2
      },
      {
        nome: 'Artes Marciais',
        horario: '18:00 - 19:00',
        faixaEtaria: '5-15 anos',
        professor: 'Roberto Lima',
        capacidade: 12,
        vagas: 4
      }
    ]
  },
  {
    dia: 'Quinta-feira',
    turmas: [
      {
        nome: 'Natação Iniciante',
        horario: '15:00 - 16:00',
        faixaEtaria: '4-8 anos',
        professor: 'Carlos Santos',
        capacidade: 12,
        vagas: 5
      },
      {
        nome: 'Dança e Ballet',
        horario: '17:30 - 18:30',
        faixaEtaria: '4-14 anos',
        professor: 'Ana Costa',
        capacidade: 10,
        vagas: 2
      },
      {
        nome: 'Artes Marciais',
        horario: '17:00 - 18:00',
        faixaEtaria: '5-15 anos',
        professor: 'Roberto Lima',
        capacidade: 12,
        vagas: 4
      }
    ]
  },
  {
    dia: 'Sexta-feira',
    turmas: [
      {
        nome: 'Artes Marciais',
        horario: '18:00 - 19:00',
        faixaEtaria: '5-15 anos',
        professor: 'Roberto Lima',
        capacidade: 12,
        vagas: 4
      }
    ]
  }
]

const contraturno = [
  {
    periodo: 'Manhã',
    horario: '07:30 - 12:00',
    atividades: [
      'Acompanhamento de lição de casa',
      'Atividades lúdicas',
      'Lanche da manhã',
      'Atividades recreativas',
      'Almoço'
    ]
  },
  {
    periodo: 'Tarde',
    horario: '13:30 - 18:00',
    atividades: [
      'Lanche da tarde',
      'Atividades recreativas',
      'Acompanhamento de lição de casa',
      'Atividades lúdicas',
      'Momento livre'
    ]
  }
]

export default function HorariosPage() {
  const getVagasColor = (vagas: number) => {
    if (vagas === 0) return 'bg-red-100 text-red-800'
    if (vagas <= 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getVagasText = (vagas: number) => {
    if (vagas === 0) return 'Lotada'
    if (vagas <= 2) return `${vagas} vagas`
    return `${vagas} vagas`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Academia Infantil
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/matricula">
                <Button>Matricular-se</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Horários das Atividades
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Confira os horários de todas as nossas modalidades e escolha a melhor opção 
            para o seu filho.
          </p>
        </div>
      </section>

      {/* Modalidades */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Modalidades Esportivas
            </h2>
            <p className="text-lg text-gray-600">
              Horários das aulas por dia da semana
            </p>
          </div>

          <div className="space-y-8">
            {horarios.map((dia) => (
              <Card key={dia.dia}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {dia.dia}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {dia.turmas.map((turma, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{turma.nome}</h3>
                              <div className="text-sm text-gray-500">
                                {turma.horario} • {turma.faixaEtaria} • Prof. {turma.professor}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Capacidade: {turma.capacidade} alunos
                            </div>
                            <Badge className={getVagasColor(turma.vagas)}>
                              {getVagasText(turma.vagas)}
                            </Badge>
                          </div>
                          <Link href={`/matricula?turma=${turma.nome}`}>
                            <Button size="sm">
                              Matricular
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contraturno */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contraturno Escolar
            </h2>
            <p className="text-lg text-gray-600">
              Acompanhamento pedagógico completo com atividades recreativas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {contraturno.map((periodo) => (
              <Card key={periodo.periodo}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {periodo.periodo}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">
                    {periodo.horario}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {periodo.atividades.map((atividade, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {atividade}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <Link href="/matricula?modalidade=contraturno">
                      <Button className="w-full">
                        Matricular no Contraturno
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Training */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Personal Training
            </h2>
            <p className="text-lg text-gray-600">
              Atendimento individualizado com horários flexíveis
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Segunda a Sexta</div>
                    <div className="text-sm text-gray-500">
                      Horários flexíveis conforme disponibilidade
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Disponível
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Sábado</div>
                    <div className="text-sm text-gray-500">
                      08:00 - 12:00 (agendamento)
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Disponível
                  </Badge>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link href="/matricula?modalidade=personal">
                  <Button className="w-full">
                    Agendar Personal Training
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Informações */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Localização</h3>
              <p className="text-blue-100">
                Rua das Flores, 123<br />
                Centro - São Paulo/SP<br />
                CEP: 01234-567
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contato</h3>
              <p className="text-blue-100">
                (11) 99999-9999<br />
                contato@academiainfantil.com<br />
                WhatsApp disponível
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funcionamento</h3>
              <p className="text-blue-100">
                Segunda a Sexta: 07:30 - 19:00<br />
                Sábado: 08:00 - 12:00<br />
                Domingo: Fechado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Escolha a modalidade ideal e faça a matrícula do seu filho
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/matricula">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Fazer Matrícula
              </Button>
            </Link>
            <Link href="/experimental">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900">
                Aula Experimental
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
