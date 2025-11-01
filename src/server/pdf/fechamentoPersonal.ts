import jsPDF from 'jspdf'
import { formatCurrency, formatDate } from '@/lib/utils'

interface SessaoPersonal {
  id: string
  data: string
  startTime: string
  endTime: string
  valorCents: number
  observacoes?: string
  profissional: {
    name: string
  }
  aluno: {
    fullName: string
  }
}

interface FechamentoPersonalData {
  referenciaMes: string
  pagador: 'unimed' | 'particular'
  totalSessoes: number
  valorTotalCents: number
  sessoes: SessaoPersonal[]
}

export async function gerarPDFFechamentoPersonal(data: FechamentoPersonalData): Promise<Buffer> {
  const doc = new jsPDF()
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const lineHeight = 7
  let yPosition = margin

  // Função para adicionar texto
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

  // Título do relatório
  addText('RELATÓRIO DE FECHAMENTO - PERSONAL TRAINING', 16, true)
  addText('', 12)

  // Informações do fechamento
  addText(`Período: ${data.referenciaMes}`, 12, true)
  addText(`Pagador: ${data.pagador === 'unimed' ? 'Unimed' : 'Particular'}`, 12, true)
  addText(`Total de Sessões: ${data.totalSessoes}`, 12, true)
  addText(`Valor Total: ${formatCurrency(data.valorTotalCents)}`, 12, true)
  addText('', 12)

  // Tabela de sessões
  addText('DETALHAMENTO DAS SESSÕES', 14, true)
  addText('', 12)

  // Cabeçalho da tabela
  const tableTop = yPosition
  const colWidths = [25, 30, 40, 35, 40] // Data, Hora, Aluno, Profissional, Valor
  const colHeaders = ['Data', 'Horário', 'Aluno', 'Profissional', 'Valor']
  
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, tableTop, pageWidth - 2 * margin, 15, 'F')
  
  let xPos = margin
  colHeaders.forEach((header, index) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(header, xPos + 2, tableTop + 10)
    xPos += colWidths[index]
  })

  yPosition = tableTop + 20

  // Dados da tabela
  data.sessoes.forEach((sessao, index) => {
    // Verificar se precisa de nova página
    if (yPosition > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPosition = margin
    }

    xPos = margin
    const rowData = [
      formatDate(sessao.data),
      `${sessao.startTime}-${sessao.endTime}`,
      sessao.aluno.fullName,
      sessao.profissional.name,
      formatCurrency(sessao.valorCents)
    ]

    rowData.forEach((cell, cellIndex) => {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      
      // Quebrar texto se necessário
      const lines = doc.splitTextToSize(cell, colWidths[cellIndex] - 4)
      doc.text(lines, xPos + 2, yPosition)
      xPos += colWidths[cellIndex]
    })

    yPosition += 15

    // Linha separadora
    if (index < data.sessoes.length - 1) {
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)
    }
  })

  // Resumo no final
  yPosition += 20
  addText('RESUMO FINANCEIRO', 14, true)
  addText('', 12)
  
  addText(`Total de Sessões Realizadas: ${data.totalSessoes}`, 12)
  addText(`Valor Total: ${formatCurrency(data.valorTotalCents)}`, 12, true)
  
  const valorMedio = data.totalSessoes > 0 ? data.valorTotalCents / data.totalSessoes : 0
  addText(`Valor Médio por Sessão: ${formatCurrency(Math.round(valorMedio))}`, 12)

  // Rodapé
  const footerY = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Relatório gerado automaticamente em ' + new Date().toLocaleString('pt-BR'), 
    pageWidth / 2, footerY, { align: 'center' })

  return Buffer.from(doc.output('arraybuffer'))
}
