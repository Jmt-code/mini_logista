import { jsPDF } from 'jspdf'
import { FormData } from '../types/FormTypes'
import './PDFGenerator.css'

interface PDFGeneratorProps {
  formData: FormData
}

const PDFGenerator = ({ formData }: PDFGeneratorProps) => {
  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(102, 126, 234)
    doc.text('Mini Logista - Formulario', 105, 20, { align: 'center' })
    
    // Line separator
    doc.setDrawColor(102, 126, 234)
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)
    
    let yPosition = 40
    
    // Section 1: Personal Data
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Datos Personales', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Nombre: ${formData.seccion1.nombre || 'N/A'}`, 25, yPosition)
    yPosition += 8
    doc.text(`Email: ${formData.seccion1.email || 'N/A'}`, 25, yPosition)
    yPosition += 8
    doc.text(`Teléfono: ${formData.seccion1.telefono || 'N/A'}`, 25, yPosition)
    yPosition += 15
    
    // Section 2: Address
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Dirección', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(`Dirección: ${formData.seccion2.direccion || 'N/A'}`, 25, yPosition)
    yPosition += 8
    doc.text(`Ciudad: ${formData.seccion2.ciudad || 'N/A'}`, 25, yPosition)
    yPosition += 8
    doc.text(`Código Postal: ${formData.seccion2.codigoPostal || 'N/A'}`, 25, yPosition)
    yPosition += 15
    
    // Section 3: Additional Info
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Información Adicional', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    
    // Handle long text for observations
    const observaciones = formData.seccion3.observaciones || 'N/A'
    const splitObservaciones = doc.splitTextToSize(observaciones, 160)
    doc.text(splitObservaciones, 25, yPosition)
    
    // Footer
    const date = new Date().toLocaleDateString('es-ES')
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(`Generado el ${date}`, 105, 280, { align: 'center' })
    
    // Save PDF
    doc.save('mini-logista-formulario.pdf')
  }

  return (
    <button onClick={generatePDF} className="btn btn-primary pdf-button">
      Generar PDF
    </button>
  )
}

export default PDFGenerator
