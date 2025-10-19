import { useState } from 'react'
import { ConfirmModal } from './Modal'
import './TableView.css'

interface TableViewProps {
  tabId: string
  data: any[]
  onAddRow: () => void
  onDeleteRow: (rowId: string) => void
  onUpdateRow: (rowId: string, field: string, value: any) => void
  onClearTab: () => void
  onConfirmarInventario?: () => void
}

const TableView = ({ tabId, data, onAddRow, onDeleteRow, onUpdateRow, onClearTab, onConfirmarInventario }: TableViewProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, rowId: string | null }>({
    isOpen: false,
    rowId: null
  })
  const [clearTabConfirm, setClearTabConfirm] = useState(false)
  
  const checkRowHasData = (row: any): boolean => {
    return Object.entries(row).some(([key, value]) => {
      if (key === 'id') return false
      if (typeof value === 'string') return value.trim() !== '' && value !== '0.00'
      return value !== null && value !== undefined
    })
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
  
  const getTabName = () => {
    switch(tabId) {
      case 'peticionCompras': return 'Petición de Compras'
      case 'registroTrabajo': return 'Registro de Trabajo'
      case 'comprasRealizadas': return 'Compras Realizadas'
      case 'inventario': return 'Inventario'
      default: return 'esta pestaña'
    }
  }
  
  const renderFields = (row: any) => {
    switch(tabId) {
      case 'peticionCompras':
        return (
          <>
            <div className="form-field">
              <label className="field-label">Nombre de artículo</label>
              <input
                type="text"
                className="field-input"
                value={row.nombreArticulo || ''}
                onChange={(e) => onUpdateRow(row.id, 'nombreArticulo', e.target.value)}
                placeholder="Ej: Camisa blanca"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Cantidad</label>
              <input
                type="number"
                className="field-input"
                value={row.cantidad || ''}
                onChange={(e) => onUpdateRow(row.id, 'cantidad', e.target.value)}
                placeholder="0"
              />
            </div>
          </>
        )
      
      case 'registroTrabajo':
        return (
          <>
            <div className="form-field">
              <label className="field-label">Fecha de trabajo</label>
              <input
                type="date"
                className="field-input"
                value={row.fechaTrabajo || ''}
                onChange={(e) => onUpdateRow(row.id, 'fechaTrabajo', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Lugar</label>
              <input
                type="text"
                className="field-input"
                value={row.lugar || ''}
                onChange={(e) => onUpdateRow(row.id, 'lugar', e.target.value)}
                placeholder="Ej: Oficina central"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Tipo de trabajo</label>
              <input
                type="text"
                className="field-input"
                value={row.tipoTrabajo || ''}
                onChange={(e) => onUpdateRow(row.id, 'tipoTrabajo', e.target.value)}
                placeholder="Ej: Mantenimiento"
              />
            </div>
          </>
        )
      
      case 'comprasRealizadas':
        return (
          <>
            <div className="form-field">
              <label className="field-label">Nº Ticket</label>
              <input
                type="text"
                className="field-input"
                value={row.numeroTicket || ''}
                onChange={(e) => onUpdateRow(row.id, 'numeroTicket', e.target.value)}
                placeholder="Ej: T-12345"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Fecha</label>
              <input
                type="date"
                className="field-input"
                value={row.fecha || ''}
                onChange={(e) => onUpdateRow(row.id, 'fecha', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="field-label">Nombre artículo</label>
              <input
                type="text"
                className="field-input"
                value={row.nombreArticulo || ''}
                onChange={(e) => onUpdateRow(row.id, 'nombreArticulo', e.target.value)}
                placeholder="Ej: Detergente"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Cantidad</label>
              <input
                type="number"
                className="field-input"
                value={row.cantidad || ''}
                onChange={(e) => onUpdateRow(row.id, 'cantidad', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Total (€)</label>
              <input
                type="number"
                step="0.01"
                className="field-input"
                value={row.total || ''}
                onChange={(e) => onUpdateRow(row.id, 'total', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Precio/u (€)</label>
              <input
                type="text"
                className="field-input field-readonly"
                value={row.precioUnidad || '0.00'}
                readOnly
              />
            </div>
          </>
        )
      
      case 'inventario':
        const cantidadActual = parseFloat(row.cantidadActual || '0')
        const cantidadAnterior = parseFloat(row.cantidadAnterior || '0')
        const diferenciaNum = cantidadActual - cantidadAnterior
        const diferencia = diferenciaNum > 0 ? `+${diferenciaNum}` : diferenciaNum.toString()
        return (
          <>
            <div className="form-field">
              <label className="field-label">Nombre artículo</label>
              <input
                type="text"
                className="field-input"
                value={row.nombreArticulo || ''}
                onChange={(e) => onUpdateRow(row.id, 'nombreArticulo', e.target.value)}
                placeholder="Ej: Uniforme"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Cantidad Actual</label>
              <input
                type="number"
                className="field-input"
                value={row.cantidadActual || ''}
                onChange={(e) => onUpdateRow(row.id, 'cantidadActual', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-field-row">
              <div className="form-field form-field-half">
                <label className="field-label">Cantidad Anterior</label>
                <input
                  type="text"
                  className="field-input field-readonly"
                  value={row.cantidadAnterior || '0'}
                  readOnly
                />
              </div>
              <div className="form-field form-field-half">
                <label className="field-label">Diferencia</label>
                <input
                  type="text"
                  className="field-input field-readonly"
                  value={diferencia}
                  readOnly
                />
              </div>
            </div>
            <div className="form-field">
              <label className="field-label">Prenda</label>
              <select
                className="field-input"
                value={row.prenda || ''}
                onChange={(e) => onUpdateRow(row.id, 'prenda', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="nuevo">Nuevo</option>
                <option value="viejo">Viejo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Estado</label>
              <select
                className="field-input"
                value={row.estado || ''}
                onChange={(e) => onUpdateRow(row.id, 'estado', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="limpio">Limpio</option>
                <option value="manchado">Manchado</option>
                <option value="roto">Roto</option>
              </select>
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="table-view">
      <div className="table-header">
        {tabId === 'inventario' && onConfirmarInventario && (
          <button className="confirm-button-small" onClick={onConfirmarInventario}>
            <span className="confirm-icon">✓</span>
            Confirmar
          </button>
        )}
        <div className="header-buttons">
          <button className="clear-button" onClick={() => setClearTabConfirm(true)}>
            <span className="clear-icon">🗑️</span>
            Borrar
          </button>
          <button className="add-button" onClick={onAddRow}>
            <span className="add-icon">+</span>
            Añadir
          </button>
        </div>
      </div>

      <div className="table-content">
        {data.length === 0 ? (
          <div className="empty-state">
            <p>No hay registros. Pulsa el botón "Añadir" para crear uno.</p>
          </div>
        ) : (
          <div className="table-rows">
            {data.map((row, index) => (
              <div key={row.id} className="table-row">
                <div className="row-header">
                  <span className="row-number">#{data.length - index}</span>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(row.id)}
                    aria-label="Eliminar"
                  />
                </div>
                <div className="row-fields">
                  {renderFields(row)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Confirmar eliminación"
        message="Este registro contiene datos. ¿Estás seguro de que quieres eliminarlo?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, rowId: null })}
        isDanger={true}
      />
      
      <ConfirmModal
        isOpen={clearTabConfirm}
        title={`Borrar todos los datos de ${getTabName()}`}
        message={`¿Estás seguro de que quieres borrar todos los datos de ${getTabName()}? Esta acción no se puede deshacer.`}
        confirmText="Borrar todo"
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

export default TableView
