import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, Clock, Star, ArrowRight } from 'lucide-react'

// Mock data - em produção viria do banco de dados
const modalidades = [
  {
    id: '1',
    tipo: 'contraturno',
    nome: 'Contraturno Completo',
    descricao: 'Acompanhamento pedagógico completo com atividades recreativas, lição de casa e refeições balanceadas.',
    beneficios: [
      'Acompanhamento de lição de casa',
      'Atividades lúdicas e recreativas',
      'Refeições balanceadas',
      'Horário flexível (manhã ou tarde)',
      'Relatórios semanais'
    ],
    faixaEtaria: '4-12 anos',
    horarios: ['07:30-12:00', '13:30-18:00'],
    valor: 35000, // R$ 350,00 em centavos
    popular: true
  },
  {
    id: '2',
    tipo: 'personal',
    nome: 'Personal Training',
    descricao: 'Atendimento individualizado com profissionais especializados em desenvolvimento infantil.',
    beneficios: [
      'Atendimento 1:1 com professor',
      'Plano personalizado',
      'Foco em necessidades específicas',
      'Convênio com Unimed aceito',
      'Relatórios detalhados'
    ],
    faixaEtaria: '3-16 anos',
    horarios: ['08:00-18:00 (agendamento)'],
    valor: 8000, // R$ 80,00 por sessão
    popular: false
  },
  {
    id: '3',
    tipo: 'modalidade',
    nome: 'Futebol Infantil',
    descricao: 'Aulas de futebol desenvolvidas especialmente para crianças, focando em diversão e desenvolvimento motor.',
    beneficios: [
      'Desenvolvimento motor',
      'Trabalho em equipe',
      'Coordenação e agilidade',
      'Valores esportivos',
      'Jogos e brincadeiras'
    ],
    faixaEtaria: '6-12 anos',
    horarios: ['14:00-15:00 (Seg/Qua)', '15:30-16:30 (Ter/Qui)'],
    valor: 12000, // R$ 120,00 mensal
    popular: true
  },
  {
    id: '4',
    tipo: 'modalidade',
    nome: 'Natação Iniciante',
    descricao: 'Aulas de natação para iniciantes, com foco na segurança e confiança na água.',
    beneficios: [
      'Segurança na água',
      'Coordenação motora',
      'Respiração adequada',
      'Confiança e autonomia',
      'Atividade de baixo impacto'
    ],
    faixaEtaria: '4-10 anos',
    horarios: ['15:00-16:00 (Ter/Qui)', '16:30-17:30 (Seg/Qua)'],
    valor: 15000, // R$ 150,00 mensal
    popular: false
  },
  {
    id: '5',
    tipo: 'modalidade',
    nome: 'Dança e Ballet',
    descricao: 'Aulas de dança e ballet clássico, desenvolvendo expressão corporal e musicalidade.',
    beneficios: [
      'Expressão corporal',
      'Musicalidade e ritmo',
      'Flexibilidade',
      'Postura e elegância',
      'Apresentações anuais'
    ],
    faixaEtaria: '4-14 anos',
    horarios: ['16:00-17:00 (Seg/Qua)', '17:30-18:30 (Ter/Qui)'],
    valor: 10000, // R$ 100,00 mensal
    popular: false
  },
  {
    id: '6',
    tipo: 'modalidade',
    nome: 'Artes Marciais',
    descricao: 'Aulas de artes marciais adaptadas para crianças, focando em disciplina e respeito.',
    beneficios: [
      'Disciplina e autocontrole',
      'Respeito e hierarquia',
      'Defesa pessoal básica',
      'Coordenação motora',
      'Concentração'
    ],
    faixaEtaria: '5-15 anos',
    horarios: ['18:00-19:00 (Seg/Qua/Sex)', '17:00-18:00 (Ter/Qui)'],
    valor: 13000, // R$ 130,00 mensal
    popular: false
  }
]

export default function ModalidadesPage() {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'contraturno': return 'bg-blue-100 text-blue-800'
      case 'personal': return 'bg-purple-100 text-purple-800'
      case 'modalidade': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'contraturno': return 'Contraturno'
      case 'personal': return 'Personal'
      case 'modalidade': return 'Modalidade'
      default: return 'Outros'
    }
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
            Nossas Modalidades
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Oferecemos uma variedade completa de atividades para o desenvolvimento integral 
            do seu filho, desde o contraturno escolar até modalidades esportivas especializadas.
          </p>
        </div>
      </section>

      {/* Modalidades Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modalidades.map((modalidade) => (
              <Card key={modalidade.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {modalidade.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTipoColor(modalidade.tipo)}>
                      {getTipoText(modalidade.tipo)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{modalidade.nome}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {modalidade.descricao}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Faixa Etária e Horários */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Faixa etária: {modalidade.faixaEtaria}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 mt-0.5" />
                      <div>
                        {modalidade.horarios.map((horario, index) => (
                          <div key={index}>{horario}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Benefícios */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Principais benefícios:</h4>
                    <ul className="space-y-1">
                      {modalidade.beneficios.slice(0, 3).map((beneficio, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {beneficio}
                        </li>
                      ))}
                      {modalidade.beneficios.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{modalidade.beneficios.length - 3} outros benefícios
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Preço */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(modalidade.valor)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {modalidade.tipo === 'personal' ? 'por sessão' : 'mensal'}
                        </div>
                      </div>
                      <Link href={`/matricula?modalidade=${modalidade.id}`}>
                        <Button className="flex items-center">
                          Matricular
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não sabe qual modalidade escolher?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Agende uma aula experimental gratuita e conheça nossa estrutura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experimental">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Aula Experimental Gratuita
              </Button>
            </Link>
            <Link href="/horarios">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Ver Horários Completos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professores Qualificados</h3>
              <p className="text-gray-600">
                Nossa equipe é formada por profissionais especializados em educação infantil e esportes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Horários Flexíveis</h3>
              <p className="text-gray-600">
                Oferecemos horários que se adaptam à rotina da sua família e do seu filho.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Metodologia Comprovada</h3>
              <p className="text-gray-600">
                Utilizamos métodos pedagógicos modernos focados no desenvolvimento integral da criança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Academia Infantil</h4>
              <p className="text-gray-400">
                Desenvolvendo o futuro através do esporte e educação.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Modalidades</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contraturno</li>
                <li>Personal Training</li>
                <li>Futebol</li>
                <li>Natação</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/horarios">Horários</Link></li>
                <li><Link href="/matricula">Matrícula</Link></li>
                <li><Link href="/experimental">Aula Experimental</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400">
                (11) 99999-9999<br />
                contato@academiainfantil.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Academia Infantil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
