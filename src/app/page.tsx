import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cepin-light to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="lg" />
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/matricula">
                <Button className="bg-cepin-blue hover:bg-cepin-blue/90">Matricular-se</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-cepin-dark mb-6">
            Desenvolvendo o Futuro do seu Filho
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CEPIN - Academia para bebês, crianças e adolescentes. 
            Educação, esporte e diversão em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/experimental">
              <Button size="lg" className="text-lg px-8 py-4 bg-cepin-green hover:bg-cepin-green/90">
                Aula Experimental Gratuita
              </Button>
            </Link>
            <Link href="/modalidades">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-cepin-blue text-cepin-blue hover:bg-cepin-blue hover:text-white">
                Conhecer Modalidades
              </Button>
            </Link>
          </div>
          
          {/* Espaço para Fotos e Vídeos */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cepin-blue/10 to-cepin-green/10 rounded-lg p-8 border-2 border-dashed border-cepin-blue/30 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📸</div>
                <p className="text-gray-600 font-medium">Espaço para Fotos</p>
                <p className="text-sm text-gray-500 mt-2">Adicione fotos do seu trabalho aqui</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cepin-yellow/10 to-cepin-red/10 rounded-lg p-8 border-2 border-dashed border-cepin-yellow/30 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎥</div>
                <p className="text-gray-600 font-medium">Espaço para Vídeos</p>
                <p className="text-sm text-gray-500 mt-2">Adicione vídeos mostrando o trabalho aqui</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-cepin-dark mb-4">
              Nossos Serviços
            </h3>
            <p className="text-lg text-gray-600">
              Oferecemos uma estrutura completa para o desenvolvimento integral das crianças
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-cepin-blue/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-cepin-blue">Contraturno</CardTitle>
                <CardDescription>
                  Acompanhamento pedagógico completo com atividades recreativas e educativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Acompanhamento de lição de casa</li>
                  <li>• Atividades lúdicas</li>
                  <li>• Refeições balanceadas</li>
                  <li>• Horário flexível</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-cepin-green/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-cepin-green">Personal Training</CardTitle>
                <CardDescription>
                  Atendimento individualizado com profissionais especializados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Acompanhamento individual</li>
                  <li>• Foco em necessidades específicas</li>
                  <li>• Convênio com Unimed</li>
                  <li>• Relatórios detalhados</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-cepin-yellow/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-cepin-yellow">Modalidades Esportivas</CardTitle>
                <CardDescription>
                  Diversas opções de atividades físicas para todas as idades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Futebol, vôlei, basquete</li>
                  <li>• Natação</li>
                  <li>• Dança e ballet</li>
                  <li>• Artes marciais</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cepin-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Agende uma aula experimental gratuita e conheça nossa estrutura
          </p>
          <Link href="/experimental">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Agendar Aula Experimental
            </Button>
          </Link>
        </div>
      </section>

      {/* Localização em Destaque */}
      <section className="py-20 bg-gradient-to-br from-cepin-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-cepin-dark mb-4">
              Venha nos Visitar
            </h3>
            <p className="text-lg text-gray-600">
              Conheça nossa estrutura completa e veja de perto o trabalho da CEPIN
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-bold text-cepin-dark mb-4">CEPIN</h4>
                <p className="text-gray-600 mb-4">
                  Academia, Contraturno e Psicomotricidade para bebês, crianças e adolescentes.
                </p>
                <a 
                  href="https://www.google.com/maps/place/CEPIN+-+Academia,+Contraturno+e+Psicomotricidade/@-28.6886222,-49.3806704,764m/data=!3m2!1e3!4b1!4m6!3m5!1s0x9521833422f5e24f:0xb3d8250fa1cb7541!8m2!3d-28.6886222!4d-49.3806704!16s%2Fg%2F11smlj2cqw?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cepin-blue hover:text-cepin-green transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ver no Google Maps
                </a>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.123456789!2d-49.3806704!3d-28.6886222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9521833422f5e24f%3A0xb3d8250fa1cb7541!2sCEPIN%20-%20Academia%2C%20Contraturno%20e%20Psicomotricidade!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Localização da CEPIN"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cepin-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" />
              <p className="text-gray-400 mt-4">
                Desenvolvendo o futuro através do esporte e educação.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contraturno</li>
                <li>Personal Training</li>
                <li>Modalidades</li>
                <li>Colônia de Férias</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/horarios">Horários</Link></li>
                <li><Link href="/modalidades">Modalidades</Link></li>
                <li><Link href="/matricula">Matrícula</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400">
                (11) 99999-9999<br />
                contato@cepin.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CEPIN - Academia para Crianças. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
