import { useState, useRef } from 'react'
import { ConfirmModal } from './Modal'
import { CompraRealizada, ArticuloCompra } from '../types/FormTypes'
import './ComprasView.css'

interface ComprasViewProps {
  data: CompraRealizada[]
  onAddRow: () => void
  onDeleteRow: (rowId: string) => void
  onUpdateRow: (rowId: string, field: string, value: any) => void
  onClearTab: () => void
}

const ComprasView = ({ data, onAddRow, onDeleteRow, onUpdateRow, onClearTab }: ComprasViewProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, rowId: string | null }>({
    isOpen: false,
    rowId: null
  })
  const [clearTabConfirm, setClearTabConfirm] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  
  const checkRowHasData = (row: CompraRealizada): boolean => {
    if (row.numeroTicket?.trim() || row.fecha || row.fotoTicket) return true
    return row.articulos?.some(art => 
      art.nombreArticulo?.trim() || art.cantidad || art.total
    ) || false
  }
  
  const handleDeleteClick = (rowId: string) => {
    const row = data.find(r => r.id === rowId)
    if (row && checkRowHasData(row)) {
      setDeleteConfirm({ isOpen: true, rowId })
    } else {
      onDeleteRow(rowId)
    }
  }
  
  const handleConfirmDelete = () => {
    if (deleteConfirm.rowId) {
      onDeleteRow(deleteConfirm.rowId)
    }
    setDeleteConfirm({ isOpen: false, rowId: null })
  }

  const handleAddArticulo = (ticketId: string) => {
    const ticket = data.find(t => t.id === ticketId)
    if (ticket) {
      const newArticulo: ArticuloCompra = {
        id: Date.now().toString(),
        nombreArticulo: '',
        cantidad: '',
        precioUnidad: '0.00',
        total: ''
      }
      const updatedArticulos = [newArticulo, ...(ticket.articulos || [])]
      onUpdateRow(ticketId, 'articulos', updatedArticulos)
    }
  }

  const handleDeleteArticulo = (ticketId: string, articuloId: string) => {
    const ticket = data.find(t => t.id === ticketId)
    if (ticket && ticket.articulos && ticket.articulos.length > 1) {
      const updatedArticulos = ticket.articulos.filter(art => art.id !== articuloId)
      onUpdateRow(ticketId, 'articulos', updatedArticulos)
    }
  }

  const handleUpdateArticulo = (ticketId: string, articuloId: string, field: string, value: any) => {
    const ticket = data.find(t => t.id === ticketId)
    if (ticket && ticket.articulos) {
      const updatedArticulos = ticket.articulos.map(art => {
        if (art.id === articuloId) {
          const updated = { ...art, [field]: value }
          
          // Calcular precio por unidad automáticamente
          if (field === 'total' || field === 'cantidad') {
            const cantidad = parseFloat(field === 'cantidad' ? value : updated.cantidad) || 0
            const total = parseFloat(field === 'total' ? value : updated.total) || 0
            
            if (cantidad > 0 && total > 0) {
              updated.precioUnidad = (total / cantidad).toFixed(2)
            } else {
              updated.precioUnidad = '0.00'
            }
          }
          
          return updated
        }
        return art
      })
      onUpdateRow(ticketId, 'articulos', updatedArticulos)
    }
  }

  const handleImageCapture = (ticketId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onUpdateRow(ticketId, 'fotoTicket', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (ticketId: string) => {
    onUpdateRow(ticketId, 'fotoTicket', '')
    if (fileInputRefs.current[ticketId]) {
      fileInputRefs.current[ticketId]!.value = ''
    }
  }

  const getTotalTicket = (ticket: CompraRealizada): number => {
    return ticket.articulos?.reduce((sum, art) => {
      return sum + (parseFloat(art.total) || 0)
    }, 0) || 0
  }

  return (
    <div className="table-view compras-view">
      <div className="table-header">
        <div className="header-buttons">
          <button className="clear-button" onClick={() => setClearTabConfirm(true)}>
            <span className="clear-icon">🗑️</span>
            Borrar
          </button>
          <button className="add-button" onClick={onAddRow}>
            <span className="add-icon">+</span>
            Añadir Ticket
          </button>
        </div>
      </div>

      <div className="table-content">
        {data.length === 0 ? (
          <div className="empty-state">
            <p>No hay registros. Pulsa el botón "Añadir Ticket" para crear uno.</p>
          </div>
        ) : (
          <div className="table-rows">
            {data.map((ticket, index) => (
              <div key={ticket.id} className="table-row ticket-card">
                <div className="row-header">
                  <span className="row-number">Ticket #{data.length - index}</span>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(ticket.id)}
                    aria-label="Eliminar"
                  />
                </div>
                
                <div className="row-fields">
                  <div className="form-field">
                    <label className="field-label">Nº Ticket</label>
                    <input
                      type="text"
                      className="field-input"
                      value={ticket.numeroTicket || ''}
                      onChange={(e) => onUpdateRow(ticket.id, 'numeroTicket', e.target.value)}
                      placeholder="Ej: T-12345"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label className="field-label">Fecha</label>
                    <input
                      type="date"
                      className="field-input"
                      value={ticket.fecha || ''}
                      onChange={(e) => onUpdateRow(ticket.id, 'fecha', e.target.value)}
                    />
                  </div>

                  <div className="form-field photo-field">
                    <label className="field-label">Foto del Ticket</label>
                    <div className="photo-container">
                      {ticket.fotoTicket ? (
                        <div className="photo-preview">
                          <img src={ticket.fotoTicket} alt="Ticket" />
                          <button 
                            className="remove-photo-btn"
                            onClick={() => handleRemoveImage(ticket.id)}
                            type="button"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="photo-upload-label">
                          <input
                            ref={(el) => fileInputRefs.current[ticket.id] = el}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="photo-input"
                            onChange={(e) => handleImageCapture(ticket.id, e)}
                          />
                          <div className="upload-placeholder">
                            <span className="camera-icon">📷</span>
                            <span>Capturar foto</span>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="articulos-section">
                    <div className="articulos-header">
                      <label className="field-label">Artículos</label>
                      <button 
                        className="add-articulo-btn"
                        onClick={() => handleAddArticulo(ticket.id)}
                        type="button"
                      >
                        <span>+</span> Añadir artículo
                      </button>
                    </div>
                    
                    <div className="articulos-list">
                      {ticket.articulos?.map((articulo, artIndex) => (
                        <div key={articulo.id} className="articulo-item">
                          <div className="articulo-header">
                            <span className="articulo-number">Art. {ticket.articulos!.length - artIndex}</span>
                            {ticket.articulos!.length > 1 && (
                              <button
                                className="delete-articulo-btn"
                                onClick={() => handleDeleteArticulo(ticket.id, articulo.id)}
                                type="button"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          <div className="articulo-fields">
                            <div className="form-field">
                              <label className="field-label-small">Nombre</label>
                              <input
                                type="text"
                                className="field-input field-input-small"
                                value={articulo.nombreArticulo || ''}
                                onChange={(e) => handleUpdateArticulo(ticket.id, articulo.id, 'nombreArticulo', e.target.value)}
                                placeholder="Ej: Detergente"
                              />
                            </div>
                            
                            <div className="form-field-inline">
                              <div className="form-field form-field-half">
                                <label className="field-label-small">Cant.</label>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  className="field-input field-input-small"
                                  value={articulo.cantidad || ''}
                                  onChange={(e) => handleUpdateArticulo(ticket.id, articulo.id, 'cantidad', e.target.value)}
                                  placeholder="0"
                                />
                              </div>
                              
                              <div className="form-field form-field-half">
                                <label className="field-label-small">Total (€)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  inputMode="decimal"
                                  className="field-input field-input-small"
                                  value={articulo.total || ''}
                                  onChange={(e) => handleUpdateArticulo(ticket.id, articulo.id, 'total', e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            
                            <div className="form-field">
                              <label className="field-label-small">Precio/u (€)</label>
                              <input
                                type="text"
                                className="field-input field-input-small field-readonly"
                                value={articulo.precioUnidad || '0.00'}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="ticket-total">
                      <strong>Total Ticket:</strong>
                      <span className="total-amount">{getTotalTicket(ticket).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Confirmar eliminación"
        message="Este ticket contiene datos. ¿Estás seguro de que quieres eliminarlo?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, rowId: null })}
        isDanger={true}
      />
      
      <ConfirmModal
        isOpen={clearTabConfirm}
        title="⚠️ Borrar todos los datos de Compras Realizadas"
        message="CUIDADO: Se eliminarán TODOS LOS DATOS de Compras Realizadas (tickets, artículos y fotos). Esta acción es IRREVERSIBLE y no se podrá recuperar la información borrada."
        confirmText="Borrar Todo"
        cancelText="Cancelar"
        onConfirm={() => {
          onClearTab()
          setClearTabConfirm(false)
        }}
        onCancel={() => setClearTabConfirm(false)}
        isDanger={true}
      />
    </div>
  )
}

export default ComprasView
