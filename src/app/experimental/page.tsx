'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface HorarioDisponivel {
  id: string
  profissionalId: string
  profissionalNome: string
  modalidade: string
  diaSemana: number
  horaInicio: string
  horaFim: string
  capacidade: number
  ocupados: number
  ativo: boolean
}

export default function ExperimentalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([])
  const [modalidadesDisponiveis, setModalidadesDisponiveis] = useState<string[]>([])
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    nomeCrianca: '',
    idadeCrianca: '',
    modalidadeInteresse: '',
    dataPreferencia: '',
    horarioSelecionado: '',
    observacoes: ''
  })

  const modalidades = [
    'Natação',
    'Futebol',
    'Vôlei',
    'Basquete',
    'Dança',
    'Ballet',
    'Artes Marciais',
    'Contraturno',
    'Personal Training',
    'Outro'
  ]

  // Carregar modalidades disponíveis ao montar o componente
  useEffect(() => {
    const carregarModalidades = async () => {
      try {
        const response = await fetch('/api/agenda/horarios-disponiveis')
        const data = await response.json()
        
        if (data.success && Array.isArray(data.horarios)) {
          const horarios: HorarioDisponivel[] = data.horarios as HorarioDisponivel[]
          const modalidadesUnicas: string[] = [...new Set(horarios.map((h) => h.modalidade))]
          setModalidadesDisponiveis(modalidadesUnicas.sort())
        }
      } catch (error) {
        console.error('Erro ao carregar modalidades:', error)
      }
    }
    
    carregarModalidades()
  }, [])

  // Consultar horários disponíveis quando modalidade ou data mudarem
  const consultarHorarios = async () => {
    if (!formData.modalidadeInteresse || !formData.dataPreferencia) {
      setHorariosDisponiveis([])
      return
    }

    setLoadingHorarios(true)
    try {
      const params = new URLSearchParams({
        modalidade: formData.modalidadeInteresse,
        data: formData.dataPreferencia
      })
      
      const response = await fetch(`/api/agenda/horarios-disponiveis?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setHorariosDisponiveis(data.horarios)
      } else {
        console.error('Erro ao consultar horários:', data.message)
        setHorariosDisponiveis([])
      }
    } catch (error) {
      console.error('Erro ao consultar horários:', error)
      setHorariosDisponiveis([])
    } finally {
      setLoadingHorarios(false)
    }
  }

  // Consultar horários quando modalidade ou data mudarem
  useEffect(() => {
    consultarHorarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.modalidadeInteresse, formData.dataPreferencia])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar se um horário foi selecionado
      if (!formData.horarioSelecionado) {
        alert('Por favor, selecione um horário disponível')
        return
      }

              const response = await fetch('/api/agendamentos-experimentais', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  clienteNome: formData.nome,
                  clienteEmail: formData.email,
                  clienteTelefone: formData.telefone,
                  nomeCrianca: formData.nomeCrianca,
                  idadeCrianca: formData.idadeCrianca,
                  modalidadeInteresse: formData.modalidadeInteresse,
                  dataPreferencia: formData.dataPreferencia,
                  horarioSelecionado: formData.horarioSelecionado,
                  observacoes: formData.observacoes
                })
              })

      const data = await response.json()
      
      if (data.success) {
        setFormSubmitted(true)
      } else {
        alert(data.message || 'Erro ao agendar aula experimental')
      }
    } catch (error) {
      console.error('Erro ao agendar aula experimental:', error)
      alert('Erro ao agendar aula experimental. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cepin-light to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-cepin-green">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-cepin-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-cepin-dark mb-2">
                Solicitação Enviada!
              </h2>
              <p className="text-gray-600 mb-6">
                Recebemos sua solicitação de aula experimental. Entraremos em contato em breve para confirmar o agendamento.
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push('/')} className="w-full bg-cepin-blue hover:bg-cepin-blue/90">
                  Voltar ao Início
                </Button>
                <Button onClick={() => setFormSubmitted(false)} variant="outline" className="w-full">
                  Fazer Nova Solicitação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cepin-light to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cepin-dark mb-4">
            Aula Experimental Gratuita
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Venha conhecer nossa estrutura e metodologia de ensino
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-cepin-blue rounded-full p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-cepin-dark">Agendamento</h3>
                <p className="text-sm text-gray-600">Escolha o melhor horário</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-cepin-green rounded-full p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-cepin-dark">1 hora de aula</h3>
                <p className="text-sm text-gray-600">Conheça nossa metodologia</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-cepin-yellow rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-cepin-dark">Sem compromisso</h3>
                <p className="text-sm text-gray-600">Totalmente gratuito</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border-cepin-blue">
          <CardHeader>
            <CardTitle className="text-cepin-blue">Dados de Contato</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para agendar sua aula experimental
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Responsável */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cepin-dark border-b pb-2">
                  Dados do Responsável
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Dados da Criança */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cepin-dark border-b pb-2">
                  Dados da Criança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeCrianca">Nome da Criança *</Label>
                    <Input
                      id="nomeCrianca"
                      name="nomeCrianca"
                      value={formData.nomeCrianca}
                      onChange={handleChange}
                      required
                      placeholder="Nome da criança"
                    />
                  </div>
                  <div>
                    <Label htmlFor="idadeCrianca">Idade *</Label>
                    <Input
                      id="idadeCrianca"
                      name="idadeCrianca"
                      type="number"
                      min="0"
                      max="18"
                      value={formData.idadeCrianca}
                      onChange={handleChange}
                      required
                      placeholder="Ex: 8"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="modalidadeInteresse">Modalidade de Interesse *</Label>
                    <select
                      id="modalidadeInteresse"
                      name="modalidadeInteresse"
                      value={formData.modalidadeInteresse}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                    >
                      <option value="">Selecione uma modalidade</option>
                      {modalidadesDisponiveis.length > 0 ? (
                        modalidadesDisponiveis.map(modalidade => (
                          <option key={modalidade} value={modalidade}>{modalidade}</option>
                        ))
                      ) : (
                        modalidades.map(modalidade => (
                          <option key={modalidade} value={modalidade}>{modalidade}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferências de Agendamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cepin-dark border-b pb-2">
                  Preferências de Agendamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dataPreferencia">Data Preferencial *</Label>
                    <Input
                      id="dataPreferencia"
                      name="dataPreferencia"
                      type="date"
                      value={formData.dataPreferencia}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Horários Disponíveis *</Label>
                    {loadingHorarios ? (
                      <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">Consultando horários...</span>
                      </div>
                    ) : horariosDisponiveis.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {horariosDisponiveis.map((horario) => (
                          <label
                            key={horario.id}
                            className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                              formData.horarioSelecionado === horario.id
                                ? 'bg-cepin-blue text-white'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name="horarioSelecionado"
                              value={horario.id}
                              checked={formData.horarioSelecionado === horario.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {horario.horaInicio} - {horario.horaFim}
                              </div>
                              <div className="text-xs opacity-75">
                                {horario.profissionalNome} • {horario.ocupados}/{horario.capacidade} vagas
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : formData.modalidadeInteresse && formData.dataPreferencia ? (
                      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Nenhum horário disponível para {formData.modalidadeInteresse} em {new Date(formData.dataPreferencia).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Tente selecionar outra data ou modalidade.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 border border-gray-300 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          Selecione uma modalidade e data para ver os horários disponíveis.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cepin-blue"
                      placeholder="Alguma informação adicional que gostaria de compartilhar?"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/')}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.horarioSelecionado} 
                  className="bg-cepin-green hover:bg-cepin-green/90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Agendando...
                    </>
                  ) : (
                    'Agendar Aula Experimental'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-cepin-blue">
            <CardHeader>
              <CardTitle className="text-cepin-blue flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Venha nos visitar na nossa academia e conheça de perto nossa estrutura completa.
              </p>
              <a 
                href="https://www.google.com/maps/place/CEPIN+-+Academia,+Contraturno+e+Psicomotricidade/@-28.6886222,-49.3806704,764m/data=!3m2!1e3!4b1!4m6!3m5!1s0x9521833422f5e24f:0xb3d8250fa1cb7541!8m2!3d-28.6886222!4d-49.3806704!16s%2Fg%2F11smlj2cqw?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cepin-blue hover:underline flex items-center gap-2"
              >
                Ver no Google Maps →
              </a>
            </CardContent>
          </Card>
          <Card className="border-cepin-green">
            <CardHeader>
              <CardTitle className="text-cepin-green flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Entre em Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dúvidas? Entre em contato conosco pelo telefone ou WhatsApp.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

