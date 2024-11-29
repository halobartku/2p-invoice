import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { Invoice } from '@/types/invoice'

export async function generatePDF(invoice: Invoice) {
  const element = document.getElementById('invoice-preview')
  if (!element) return

  // Temporarily hide the buttons and other non-printable elements
  const nonPrintableElements = element.getElementsByClassName('no-print')
  for (const el of nonPrintableElements) {
    ;(el as HTMLElement).style.display = 'none'
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: document.body.classList.contains('dark') ? '#1a1a1a' : 'white',
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`invoice-${invoice.number}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    // Restore the visibility of non-printable elements
    for (const el of nonPrintableElements) {
      ;(el as HTMLElement).style.display = ''
    }
  }
}
