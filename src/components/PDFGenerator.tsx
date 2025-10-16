import { jsPDF } from 'jspdf'
import { FormData } from '../types/FormTypes'
import './PDFGenerator.css'

interface PDFGeneratorProps {
  formData: FormData
}

const PDFGenerator = ({ formData }: PDFGeneratorProps) => {
  const generatePDF = () => {
    const doc = new jsPDF()
    let pageNumber = 1
    const pageHeight = 297 // A4 height in mm
    const marginBottom = 20
    const marginTop = 15
    
    // Colores profesionales
    const primaryColor = { r: 102, g: 126, b: 234 } // #667eea
    const accentColor = { r: 118, g: 75, b: 162 } // #764ba2
    const successColor = { r: 17, g: 153, b: 142 } // #11998e
    //const headerBg = { r: 248, g: 249, b: 250 } // #f8f9fa
    
    // Función para añadir header y footer en cada página
    const addHeaderFooter = (pageNum: number, totalPages: number) => {
      // Header con gradiente simulado
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.rect(0, 0, 210, 15, 'F')
      
      // Decoración con círculos translúcidos
      doc.setFillColor(accentColor.r, accentColor.g, accentColor.b)
      // @ts-ignore - jsPDF GState type not fully defined
      doc.setGState(new doc.GState({ opacity: 0.3 }))
      doc.circle(200, 7.5, 8, 'F')
      doc.circle(10, 7.5, 6, 'F')
      // @ts-ignore
      doc.setGState(new doc.GState({ opacity: 1 }))
      
      // Título
      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('María Morán', 20, 10)
      
      // Fecha en la esquina superior derecha
      const date = new Date().toLocaleDateString('es-ES', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(date, 190, 10, { align: 'right' })
      
      // Footer
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(`Página ${pageNum} de ${totalPages}`, 105, pageHeight - 10, { align: 'center' })
    }
    
    // Función para verificar si necesitamos nueva página
    const checkNewPage = (requiredSpace: number): number => {
      if (yPosition + requiredSpace > pageHeight - marginBottom) {
        doc.addPage()
        pageNumber++
        return marginTop + 18 // Reset position con espacio para header
      }
      return yPosition
    }
    
    let yPosition = marginTop + 18
    
    // Filtrar datos con contenido
    const hasContent = {
      peticionCompras: formData.peticionesCompra.some(item => 
        item.nombreArticulo || item.cantidad
      ),
      registroTrabajo: formData.registrosTrabajo.some(item => 
        item.fechaTrabajo || item.lugar || item.tipoTrabajo
      ),
      comprasRealizadas: formData.comprasRealizadas.some(item => 
        item.numeroTicket || item.fecha || item.nombreArticulo
      ),
      inventario: formData.inventario.some(item => 
        item.nombreArticulo || item.cantidad
      )
    }
    
    // PETICIÓN DE COMPRAS
    if (hasContent.peticionCompras) {
      yPosition = checkNewPage(40)
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.setFont('helvetica', 'bold')
      doc.text('Petición de Compras', 20, yPosition)
      yPosition += 2
      
      doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
      doc.setLineWidth(0.8)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 8
      
      // Encabezado de tabla con estilo moderno
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.roundedRect(20, yPosition, 170, 9, 2, 2, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('#', 25, yPosition + 6)
      doc.text('Artículo', 40, yPosition + 6)
      doc.text('Cantidad', 160, yPosition + 6)
      yPosition += 9
      
      // Filas de datos con estilo mejorado
      let alternate = false
      let contador = 1
      formData.peticionesCompra.forEach((item) => {
        if (item.nombreArticulo || item.cantidad) {
          yPosition = checkNewPage(10)
          
          // Fondo alternado con bordes redondeados
          if (alternate) {
            doc.setFillColor(250, 251, 252)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          } else {
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          }
          
          doc.setFontSize(9)
          doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.setFont('helvetica', 'normal')
          doc.text(`${contador}`, 25, yPosition + 5)
          doc.text(item.nombreArticulo || 'Sin especificar', 40, yPosition + 5)
          doc.text(item.cantidad || '0', 160, yPosition + 5)
          
          yPosition += 7
          alternate = !alternate
          contador++
        }
      })
      
      yPosition += 15 // Mayor separación entre tablas
    }
    
    // REGISTRO DE TRABAJO
    if (hasContent.registroTrabajo) {
      yPosition = checkNewPage(40)
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.setFont('helvetica', 'bold')
      doc.text('Registro de Trabajo', 20, yPosition)
      yPosition += 2
      
      doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
      doc.setLineWidth(0.8)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 8
      
      // Encabezado de tabla con estilo moderno
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.roundedRect(20, yPosition, 170, 9, 2, 2, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('#', 25, yPosition + 6)
      doc.text('Fecha', 40, yPosition + 6)
      doc.text('Lugar', 80, yPosition + 6)
      doc.text('Tipo de Trabajo', 135, yPosition + 6)
      yPosition += 9
      
      // Filas de datos con estilo mejorado
      let alternate = false
      let contador = 1
      formData.registrosTrabajo.forEach((item) => {
        if (item.fechaTrabajo || item.lugar || item.tipoTrabajo) {
          yPosition = checkNewPage(10)
          
          // Fondo alternado con bordes redondeados
          if (alternate) {
            doc.setFillColor(250, 251, 252)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          } else {
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          }
          
          doc.setFontSize(9)
          doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.setFont('helvetica', 'normal')
          doc.text(`${contador}`, 25, yPosition + 5)
          
          if (item.fechaTrabajo) {
            const fecha = new Date(item.fechaTrabajo + 'T00:00:00').toLocaleDateString('es-ES')
            doc.text(fecha, 40, yPosition + 5)
          }
          
          doc.text(item.lugar || '-', 80, yPosition + 5)
          doc.text(item.tipoTrabajo || '-', 135, yPosition + 5)
          
          yPosition += 7
          alternate = !alternate
          contador++
        }
      })
      
      yPosition += 15 // Mayor separación entre tablas
    }
    
    // COMPRAS REALIZADAS
    if (hasContent.comprasRealizadas) {
      yPosition = checkNewPage(40)
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.setFont('helvetica', 'bold')
      doc.text('Compras Realizadas', 20, yPosition)
      yPosition += 2
      
      doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
      doc.setLineWidth(0.8)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 8
      
      // Encabezado de tabla con estilo moderno
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.roundedRect(20, yPosition, 170, 9, 2, 2, 'F')
      
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('#', 25, yPosition + 6)
      doc.text('Ticket', 35, yPosition + 6)
      doc.text('Fecha', 65, yPosition + 6)
      doc.text('Artículo', 95, yPosition + 6)
      doc.text('Cant.', 140, yPosition + 6)
      doc.text('P/u', 160, yPosition + 6)
      doc.text('Total', 178, yPosition + 6)
      yPosition += 9
      
      let totalGeneral = 0
      let alternate = false
      
      // Filas de datos con estilo mejorado
      let contador = 1
      formData.comprasRealizadas.forEach((item) => {
        if (item.numeroTicket || item.fecha || item.nombreArticulo) {
          yPosition = checkNewPage(10)
          
          // Fondo alternado con bordes redondeados
          if (alternate) {
            doc.setFillColor(250, 251, 252)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          } else {
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          }
          
          doc.setFontSize(8)
          doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.setFont('helvetica', 'normal')
          doc.text(`${contador}`, 25, yPosition + 5)
          doc.text(item.numeroTicket || '-', 35, yPosition + 5)
          
          if (item.fecha) {
            const fecha = new Date(item.fecha + 'T00:00:00').toLocaleDateString('es-ES')
            doc.text(fecha, 65, yPosition + 5)
          } else {
            doc.text('-', 65, yPosition + 5)
          }
          
          const articulo = item.nombreArticulo || '-'
          const articuloCorto = articulo.length > 20 ? articulo.substring(0, 17) + '...' : articulo
          doc.text(articuloCorto, 95, yPosition + 5)
          
          doc.text(item.cantidad || '0', 140, yPosition + 5)
          doc.text(`${parseFloat(item.precioUnidad || '0').toFixed(2)}€`, 160, yPosition + 5)
          
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(successColor.r, successColor.g, successColor.b)
          const totalValue = parseFloat(item.total || '0')
          doc.text(`${totalValue.toFixed(2)}€`, 178, yPosition + 5)
          
          totalGeneral += totalValue
          
          yPosition += 7
          alternate = !alternate
          contador++
        }
      })
      
      // Total general con estilo moderno
      if (totalGeneral > 0) {
        yPosition = checkNewPage(12)
        
        // Línea separadora con gradiente visual
        doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b)
        doc.setLineWidth(1)
        doc.line(140, yPosition, 190, yPosition)
        yPosition += 6
        
        // Fondo para el total con bordes redondeados
        doc.setFillColor(successColor.r, successColor.g, successColor.b)
        doc.roundedRect(140, yPosition - 4, 50, 9, 2, 2, 'F')
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('TOTAL:', 145, yPosition + 2)
        doc.text(`${totalGeneral.toFixed(2)}€`, 185, yPosition + 2, { align: 'right' })
        yPosition += 10
      }
      
      yPosition += 15 // Mayor separación entre tablas
    }
    
    // INVENTARIO
    if (hasContent.inventario) {
      yPosition = checkNewPage(40)
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.setFont('helvetica', 'bold')
      doc.text('Inventario', 20, yPosition)
      yPosition += 2
      
      doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
      doc.setLineWidth(0.8)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 8
      
      // Encabezado de tabla con estilo moderno
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.roundedRect(20, yPosition, 170, 9, 2, 2, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('#', 25, yPosition + 6)
      doc.text('Artículo', 40, yPosition + 6)
      doc.text('Cantidad', 115, yPosition + 6)
      doc.text('Prenda', 145, yPosition + 6)
      doc.text('Estado', 170, yPosition + 6)
      yPosition += 9
      
      // Filas de datos con estilo mejorado
      let alternate = false
      let contador = 1
      formData.inventario.forEach((item) => {
        if (item.nombreArticulo || item.cantidad) {
          yPosition = checkNewPage(10)
          
          // Fondo alternado con bordes redondeados
          if (alternate) {
            doc.setFillColor(250, 251, 252)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          } else {
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(20, yPosition, 170, 7, 1, 1, 'F')
          }
          
          doc.setFontSize(9)
          doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.setFont('helvetica', 'normal')
          doc.text(`${contador}`, 25, yPosition + 5)
          
          const articulo = item.nombreArticulo || 'Sin especificar'
          const articuloCorto = articulo.length > 30 ? articulo.substring(0, 27) + '...' : articulo
          doc.text(articuloCorto, 40, yPosition + 5)
          
          doc.text(item.cantidad || '0', 115, yPosition + 5)
          doc.text(item.prenda ? item.prenda.charAt(0).toUpperCase() + item.prenda.slice(1) : '-', 145, yPosition + 5)
          doc.text(item.estado ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1) : '-', 170, yPosition + 5)
          
          yPosition += 7
          alternate = !alternate
          contador++
        }
      })
    }
    
    // Añadir headers y footers a todas las páginas
    const totalPages = pageNumber
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addHeaderFooter(i, totalPages)
    }
    
    // Guardar PDF
    const fileName = `logista_informe_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <button onClick={generatePDF} className="btn btn-primary pdf-button">
      📄 Generar PDF
    </button>
  )
}

export default PDFGenerator
