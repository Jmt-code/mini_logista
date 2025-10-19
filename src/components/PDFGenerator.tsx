import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { ConfirmModal } from './Modal'
import { AppData, FormData } from '../types/FormTypes'
import './PDFGenerator.css'

interface PDFGeneratorProps {
  appData: AppData
}

interface SectionAvailability {
  peticionCompras: boolean
  registroTrabajo: boolean
  comprasRealizadas: boolean
  inventario: boolean
}

const PDFGenerator = ({ appData }: PDFGeneratorProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [selectedSections, setSelectedSections] = useState<SectionAvailability>({
    peticionCompras: true,
    registroTrabajo: true,
    comprasRealizadas: true,
    inventario: true
  })

  const getAvailableSections = (): SectionAvailability => {
    // Check if any floor has data in each section
    const hasSomeData = (checkFn: (formData: FormData) => boolean) => {
      return appData.pisos.some(piso => checkFn(piso.formData))
    }

    return {
      peticionCompras: hasSomeData(fd => fd.peticionesCompra.some(item => 
        item.nombreArticulo || item.cantidad
      )),
      registroTrabajo: hasSomeData(fd => fd.registrosTrabajo.some(item => 
        item.fechaTrabajo || item.lugar || item.tipoTrabajo
      )),
      comprasRealizadas: hasSomeData(fd => fd.comprasRealizadas.some(item => 
        item.numeroTicket || item.fecha || item.fotoTicket ||
        item.articulos?.some(art => art.nombreArticulo || art.cantidad || art.total)
      )),
      inventario: hasSomeData(fd => fd.inventario.some(item => 
        item.nombreArticulo || item.cantidad
      ))
    }
  }

  const countRecords = () => {
    let total = 0
    
    appData.pisos.forEach(piso => {
      const formData = piso.formData
      const counts = {
        peticionesCompra: formData.peticionesCompra.filter(item => 
          item.nombreArticulo || item.cantidad
        ).length,
        registrosTrabajo: formData.registrosTrabajo.filter(item => 
          item.fechaTrabajo || item.lugar || item.tipoTrabajo
        ).length,
        comprasRealizadas: formData.comprasRealizadas.filter(item => 
          item.numeroTicket || item.fecha || item.fotoTicket ||
          item.articulos?.some(art => art.nombreArticulo || art.cantidad || art.total)
        ).length,
        inventario: formData.inventario.filter(item => 
          item.nombreArticulo || item.cantidad
        ).length
      }
      
      total += counts.peticionesCompra + counts.registrosTrabajo + 
               counts.comprasRealizadas + counts.inventario
    })
    
    return total
  }

  const generatePDF = (sections: SectionAvailability = selectedSections) => {
    const doc = new jsPDF()
    let pageNumber = 1
    const pageHeight = 297 // A4 height in mm
    const marginBottom = 20
    const marginTop = 15
    
    // Colores profesionales
    const primaryColor = { r: 102, g: 126, b: 234 } // #667eea
    const accentColor = { r: 118, g: 75, b: 162 } // #764ba2
    const successColor = { r: 17, g: 153, b: 142 } // #11998e
    
    let yPosition = marginTop + 18
    
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

    // Render functions for each section
    const renderPeticionCompras = (formData: FormData) => {
      const hasData = formData.peticionesCompra.some(item => item.nombreArticulo || item.cantidad)
      if (!hasData) return

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
      
      // Encabezado de tabla
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.roundedRect(20, yPosition, 170, 9, 2, 2, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text('#', 25, yPosition + 6)
      doc.text('Artículo', 40, yPosition + 6)
      doc.text('Cantidad', 160, yPosition + 6)
      yPosition += 9
      
      // Filas
      let alternate = false
      let contador = 1
      formData.peticionesCompra.forEach((item) => {
        if (item.nombreArticulo || item.cantidad) {
          yPosition = checkNewPage(10)
          
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
      
      yPosition += 15
    }

    const renderRegistroTrabajo = (formData: FormData) => {
      const hasData = formData.registrosTrabajo.some(item => item.fechaTrabajo || item.lugar || item.tipoTrabajo)
      if (!hasData) return

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
      
      // Encabezado de tabla
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
      
      // Filas
      let alternate = false
      let contador = 1
      formData.registrosTrabajo.forEach((item) => {
        if (item.fechaTrabajo || item.lugar || item.tipoTrabajo) {
          yPosition = checkNewPage(10)
          
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
      
      yPosition += 15
    }

    const renderComprasRealizadas = (formData: FormData) => {
      const hasData = formData.comprasRealizadas.some(item => 
        item.numeroTicket || item.fecha || item.fotoTicket ||
        item.articulos?.some(art => art.nombreArticulo || art.cantidad || art.total)
      )
      if (!hasData) return

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
      
      let totalGeneral = 0
      let ticketCounter = 1
      
      formData.comprasRealizadas.forEach((ticket) => {
        const hasData = ticket.numeroTicket || ticket.fecha || 
                       ticket.articulos?.some(art => art.nombreArticulo || art.cantidad || art.total)
        
        if (hasData) {
          yPosition = checkNewPage(30)
          
          // Encabezado del ticket
          doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.roundedRect(20, yPosition, 170, 8, 2, 2, 'F')
          
          doc.setFontSize(10)
          doc.setTextColor(255, 255, 255)
          doc.setFont('helvetica', 'bold')
          doc.text(`Ticket #${ticketCounter}`, 25, yPosition + 5.5)
          
          if (ticket.numeroTicket) {
            doc.text(`Nº: ${ticket.numeroTicket}`, 70, yPosition + 5.5)
          }
          
          if (ticket.fecha) {
            const fecha = new Date(ticket.fecha + 'T00:00:00').toLocaleDateString('es-ES')
            doc.text(`Fecha: ${fecha}`, 135, yPosition + 5.5)
          }
          
          yPosition += 10
          
          // Tabla de artículos
          if (ticket.articulos && ticket.articulos.length > 0) {
            doc.setFillColor(245, 247, 250)
            doc.rect(20, yPosition, 170, 7, 'F')
            
            doc.setFontSize(8)
            doc.setTextColor(100, 100, 100)
            doc.setFont('helvetica', 'bold')
            doc.text('Artículo', 25, yPosition + 4.5)
            doc.text('Cant.', 115, yPosition + 4.5)
            doc.text('P/u', 140, yPosition + 4.5)
            doc.text('Total', 170, yPosition + 4.5)
            yPosition += 7
            
            let totalTicket = 0
            let alternate = false
            
            ticket.articulos.forEach((articulo) => {
              if (articulo.nombreArticulo || articulo.cantidad || articulo.total) {
                yPosition = checkNewPage(8)
                
                if (alternate) {
                  doc.setFillColor(250, 251, 252)
                  doc.rect(20, yPosition, 170, 6, 'F')
                }
                
                doc.setFontSize(8)
                doc.setTextColor(60, 60, 60)
                doc.setFont('helvetica', 'normal')
                
                const articuloNombre = articulo.nombreArticulo || '-'
                const articuloCorto = articuloNombre.length > 35 ? articuloNombre.substring(0, 32) + '...' : articuloNombre
                doc.text(articuloCorto, 25, yPosition + 4)
                
                doc.text(articulo.cantidad || '0', 115, yPosition + 4)
                doc.text(`${parseFloat(articulo.precioUnidad || '0').toFixed(2)}€`, 140, yPosition + 4)
                
                const totalArticulo = parseFloat(articulo.total || '0')
                doc.setFont('helvetica', 'bold')
                doc.text(`${totalArticulo.toFixed(2)}€`, 170, yPosition + 4)
                
                totalTicket += totalArticulo
                
                yPosition += 6
                alternate = !alternate
              }
            })
            
            // Total del ticket
            if (totalTicket > 0) {
              yPosition = checkNewPage(10)
              
              doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b)
              doc.setLineWidth(0.5)
              doc.line(115, yPosition, 190, yPosition)
              yPosition += 5
              
              doc.setFillColor(successColor.r, successColor.g, successColor.b)
              doc.roundedRect(115, yPosition - 3, 75, 7, 1.5, 1.5, 'F')
              
              doc.setFontSize(9)
              doc.setFont('helvetica', 'bold')
              doc.setTextColor(255, 255, 255)
              doc.text('Total Ticket:', 120, yPosition + 1.5)
              doc.text(`${totalTicket.toFixed(2)}€`, 185, yPosition + 1.5, { align: 'right' })
              
              totalGeneral += totalTicket
              yPosition += 7
            }
          }
          
          yPosition += 8
          ticketCounter++
        }
      })
      
      // Total general de todas las compras
      if (totalGeneral > 0) {
        yPosition = checkNewPage(15)
        
        doc.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b)
        doc.setLineWidth(1.5)
        doc.line(20, yPosition, 190, yPosition)
        yPosition += 7
        
        doc.setFillColor(successColor.r, successColor.g, successColor.b)
        doc.roundedRect(20, yPosition - 4, 170, 10, 2, 2, 'F')
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text('TOTAL GENERAL:', 25, yPosition + 2)
        doc.setFontSize(14)
        doc.text(`${totalGeneral.toFixed(2)}€`, 185, yPosition + 2, { align: 'right' })
        yPosition += 12
      }
      
      // Fotos de tickets
      const ticketsConFoto = formData.comprasRealizadas.filter(t => t.fotoTicket)
      if (ticketsConFoto.length > 0) {
        yPosition = checkNewPage(30)
        
        doc.setFontSize(14)
        doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
        doc.setFont('helvetica', 'bold')
        doc.text('Fotos de Tickets', 20, yPosition)
        yPosition += 2
        
        doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b)
        doc.setLineWidth(0.8)
        doc.line(20, yPosition, 190, yPosition)
        yPosition += 8
        
        ticketsConFoto.forEach((ticket, index) => {
          yPosition = checkNewPage(90)
          
          doc.setFontSize(10)
          doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
          doc.setFont('helvetica', 'bold')
          const tituloFoto = ticket.numeroTicket 
            ? `Foto Ticket: ${ticket.numeroTicket}`
            : `Foto Ticket ${index + 1}`
          doc.text(tituloFoto, 20, yPosition)
          yPosition += 5
          
          try {
            const maxWidth = 170
            const maxHeight = 80
            doc.addImage(ticket.fotoTicket!, 'JPEG', 20, yPosition, maxWidth, maxHeight)
            yPosition += maxHeight + 10
          } catch (error) {
            doc.setFontSize(8)
            doc.setTextColor(200, 0, 0)
            doc.text('Error al cargar la imagen', 20, yPosition)
            yPosition += 10
          }
        })
      }
      
      yPosition += 10
    }

    const renderInventario = (formData: FormData) => {
      const hasData = formData.inventario.some(item => item.nombreArticulo || item.cantidad)
      if (!hasData) return

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
      
      // Encabezado de tabla
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
      
      // Filas
      let alternate = false
      let contador = 1
      formData.inventario.forEach((item) => {
        if (item.nombreArticulo || item.cantidad) {
          yPosition = checkNewPage(10)
          
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

    // Main generation logic - loop through pisos
    appData.pisos.forEach((piso, pisoIndex) => {
      const formData = piso.formData
      
      // Check if this piso has any data
      const pisoHasData = (
        (sections.peticionCompras && formData.peticionesCompra.some(item => item.nombreArticulo || item.cantidad)) ||
        (sections.registroTrabajo && formData.registrosTrabajo.some(item => item.fechaTrabajo || item.lugar || item.tipoTrabajo)) ||
        (sections.comprasRealizadas && formData.comprasRealizadas.some(item => 
          item.numeroTicket || item.fecha || item.fotoTicket ||
          item.articulos?.some(art => art.nombreArticulo || art.cantidad || art.total)
        )) ||
        (sections.inventario && formData.inventario.some(item => item.nombreArticulo || item.cantidad))
      )

      if (!pisoHasData) return

      // Add floor header
      if (pisoIndex > 0 || appData.pisos.length > 1) {
        yPosition = checkNewPage(30)
        
        // Línea decorativa superior
        doc.setDrawColor(118, 75, 162) // accentColor
        doc.setLineWidth(2)
        doc.line(20, yPosition, 190, yPosition)
        yPosition += 5
        
        // Calcular altura necesaria para el texto
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        const maxWidth = 160 // Ancho disponible para el texto
        const textLines = doc.splitTextToSize(piso.nombre, maxWidth)
        const lineHeight = 6
        const textHeight = textLines.length * lineHeight
        const boxHeight = Math.max(textHeight + 8, 14) // Mínimo 14mm de altura
        
        // Dibujar el fondo
        doc.setFillColor(245, 243, 250) // Color muy claro morado
        doc.rect(20, yPosition, 170, boxHeight, 'F')
        
        // Barra lateral izquierda de color
        doc.setFillColor(118, 75, 162) // accentColor
        doc.rect(20, yPosition, 4, boxHeight, 'F')
        
        // Borde sutil
        doc.setDrawColor(200, 195, 220)
        doc.setLineWidth(0.5)
        doc.rect(20, yPosition, 170, boxHeight, 'S')
        
        // Texto centrado verticalmente en la caja
        const textStartY = yPosition + (boxHeight - textHeight) / 2 + 4
        doc.setFontSize(13)
        doc.setTextColor(118, 75, 162)
        doc.setFont('helvetica', 'bold')
        
        // Dibujar cada línea del texto
        textLines.forEach((line: string, index: number) => {
          doc.text(line, 28, textStartY + (index * lineHeight))
        })
        
        yPosition += boxHeight + 5
        
        // Línea decorativa inferior
        doc.setDrawColor(118, 75, 162)
        doc.setLineWidth(1)
        doc.line(20, yPosition, 190, yPosition)
        yPosition += 10
      }

      // Render each selected section for this piso
      if (sections.peticionCompras) renderPeticionCompras(formData)
      if (sections.registroTrabajo) renderRegistroTrabajo(formData)
      if (sections.comprasRealizadas) renderComprasRealizadas(formData)
      if (sections.inventario) renderInventario(formData)
    })
    
    // Añadir headers y footers a todas las páginas
    const totalPages = pageNumber
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addHeaderFooter(i, totalPages)
    }
    
    // Guardar PDF
    const fileName = `logista_informe_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
    // Cerrar modales
    setShowConfirmModal(false)
    setShowSelectionModal(false)
  }

  const handleGenerateClick = () => {
    const totalRecords = countRecords()
    
    if (totalRecords === 0) {
      // Si no hay registros, mostrar mensaje de error
      setShowConfirmModal(true)
    } else {
      // Si hay registros, mostrar modal de selección
      const available = getAvailableSections()
      setSelectedSections(available) // Seleccionar todas las disponibles por defecto
      setShowSelectionModal(true)
    }
  }

  const handleSelectAll = () => {
    const available = getAvailableSections()
    setSelectedSections(available)
  }

  const handleToggleSection = (section: keyof SectionAvailability) => {
    const available = getAvailableSections()
    if (available[section]) {
      setSelectedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }))
    }
  }

  const hasAnySelected = () => {
    return selectedSections.peticionCompras || 
           selectedSections.registroTrabajo || 
           selectedSections.comprasRealizadas || 
           selectedSections.inventario
  }

  const getSectionLabel = (section: keyof SectionAvailability): string => {
    const labels = {
      peticionCompras: 'Petición de Compras',
      registroTrabajo: 'Registro de Trabajo',
      comprasRealizadas: 'Compras Realizadas',
      inventario: 'Inventario'
    }
    return labels[section]
  }

  const availableSections = getAvailableSections()

  return (
    <>
      <button onClick={handleGenerateClick} className="btn btn-primary pdf-button">
        📄 Generar PDF
      </button>
      
      {/* Modal de error cuando no hay datos */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Sin datos para generar PDF"
        message="Complete algún campo antes de generar el PDF."
        confirmText="Entendido"
        onConfirm={() => setShowConfirmModal(false)}
        onCancel={() => setShowConfirmModal(false)}
        isDanger={false}
      />
      
      {/* Modal de selección de secciones */}
      {showSelectionModal && (
        <div className="modal-overlay" onClick={() => setShowSelectionModal(false)}>
          <div className="modal-content pdf-selection-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Seleccionar secciones para el PDF</h2>
            <p className="modal-message">
              Selecciona las secciones que deseas incluir en el PDF:
            </p>
            
            <div className="sections-list">
              {(Object.keys(availableSections) as Array<keyof SectionAvailability>).map((section) => {
                const isAvailable = availableSections[section]
                const isSelected = selectedSections[section]
                
                return (
                  <label 
                    key={section}
                    className={`section-checkbox ${!isAvailable ? 'disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isAvailable}
                      onChange={() => handleToggleSection(section)}
                    />
                    <span className="checkbox-label">
                      {getSectionLabel(section)}
                      {!isAvailable && <span className="no-data-badge">Sin datos</span>}
                    </span>
                  </label>
                )
              })}
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary select-all-btn"
                onClick={handleSelectAll}
              >
                Seleccionar todas
              </button>
              <div className="action-buttons">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowSelectionModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirm"
                  onClick={() => generatePDF(selectedSections)}
                  disabled={!hasAnySelected()}
                >
                  Generar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PDFGenerator
