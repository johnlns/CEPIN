import jsPDF from 'jspdf'
import { alunos, users } from '../db/schema'

interface ContratoData {
  aluno: {
    id: string
    fullName: string
    birthdate: string
  }
  responsavel: {
    id: string
    name: string
    email: string
  }
  plano: {
    nome: string
    descricao: string
    valorCents: number
  }
  dataContrato: string
}

export async function gerarPDFContrato(data: ContratoData): Promise<Buffer> {
  const doc = new jsPDF()
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const lineHeight = 7
  let yPosition = margin

  // Função para adicionar texto com quebra de linha
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize)
    if (isBold) {
      doc.setFont('helvetica', 'bold')
    } else {
      doc.setFont('helvetica', 'normal')
    }
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
    doc.text(lines, margin, yPosition)
    yPosition += lines.length * lineHeight + 3
  }

  // Cabeçalho
  doc.setFillColor(37, 99, 235) // Blue-600
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ACADEMIA INFANTIL', pageWidth / 2, 25, { align: 'center' })
  
  // Resetar cor do texto
  doc.setTextColor(0, 0, 0)
  yPosition = 60

  // Título do contrato
  addText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', 16, true)
  addText('', 12)

  // Dados do contrato
  addText(`Data do Contrato: ${new Date(data.dataContrato).toLocaleDateString('pt-BR')}`, 12, true)
  addText('', 12)

  // Dados do Aluno
  addText('DADOS DO ALUNO', 14, true)
  addText(`Nome: ${data.aluno.fullName}`, 12)
  addText(`Data de Nascimento: ${new Date(data.aluno.birthdate).toLocaleDateString('pt-BR')}`, 12)
  addText('', 12)

  // Dados do Responsável
  addText('DADOS DO RESPONSÁVEL', 14, true)
  addText(`Nome: ${data.responsavel.name}`, 12)
  addText(`Email: ${data.responsavel.email}`, 12)
  addText('', 12)

  // Dados do Plano
  addText('PLANO CONTRATADO', 14, true)
  addText(`Nome: ${data.plano.nome}`, 12)
  addText(`Descrição: ${data.plano.descricao}`, 12)
  addText(`Valor: ${formatCurrency(data.plano.valorCents)}`, 12, true)
  addText('', 12)

  // Termos do contrato
  addText('TERMOS E CONDIÇÕES', 14, true)
  
  const termos = [
    '1. O presente contrato tem por objeto a prestação de serviços educacionais e esportivos pela Academia Infantil.',
    '2. Os serviços serão prestados conforme o plano contratado, respeitando os horários e modalidades estabelecidas.',
    '3. O pagamento será realizado conforme a periodicidade do plano contratado.',
    '4. O responsável se compromete a informar sobre qualquer condição de saúde especial do aluno.',
    '5. A Academia se reserva o direito de suspender os serviços em caso de inadimplência superior a 30 dias.',
    '6. Este contrato pode ser cancelado mediante aviso prévio de 30 dias.',
    '7. A Academia não se responsabiliza por objetos pessoais dos alunos.',
    '8. O responsável autoriza o uso da imagem do aluno para fins promocionais da academia.'
  ]

  termos.forEach(termo => addText(termo, 10))

  // Espaço para assinaturas
  yPosition += 20
  addText('ASSINATURAS', 14, true)
  addText('', 12)
  
  // Responsável
  addText('Responsável Legal:', 12, true)
  yPosition += 40
  addText('________________________________', 12)
  addText(`${data.responsavel.name}`, 12)
  addText('', 12)

  // Academia
  addText('Academia Infantil:', 12, true)
  yPosition += 40
  addText('________________________________', 12)
  addText('Representante Legal', 12)

  // Rodapé
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Documento gerado automaticamente em ' + new Date().toLocaleString('pt-BR'), 
    pageWidth / 2, footerY, { align: 'center' })

  return Buffer.from(doc.output('arraybuffer'))
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}
