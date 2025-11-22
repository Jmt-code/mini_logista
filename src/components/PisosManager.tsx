import { useState } from 'react'
import { ConfirmModal } from './Modal'
import './PisosManager.css'

interface PisosManagerProps {
  pisos: Array<{ id: string; nombre: string; descripcion: string; cama: number; bano: number; cocina: number }>
  pisoActivo: string
  onSelectPiso: (pisoId: string) => void
  onAddPiso: (nombre: string, descripcion: string, cama: number, bano: number, cocina: number) => void
  onDeletePiso: (pisoId: string) => void
  onUpdatePiso: (pisoId: string, nombre: string, descripcion: string, cama: number, bano: number, cocina: number) => void
  onClose: () => void
}

const PisosManager = ({ 
  pisos, 
  pisoActivo, 
  onSelectPiso, 
  onAddPiso, 
  onDeletePiso,
  onUpdatePiso,
  onClose 
}: PisosManagerProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showPisoForm, setShowPisoForm] = useState(false)
  const [editingPisoId, setEditingPisoId] = useState<string | null>(null)
  const [pisoFormData, setPisoFormData] = useState({ 
    nombre: '', 
    descripcion: '', 
    cama: 0, 
    bano: 0, 
    cocina: 0 
  })

  const handleOpenNewPiso = () => {
    setPisoFormData({ nombre: '', descripcion: '', cama: 0, bano: 0, cocina: 0 })
    setEditingPisoId(null)
    setShowPisoForm(true)
  }

  const handleOpenEditPiso = (piso: { id: string; nombre: string; descripcion: string; cama: number; bano: number; cocina: number }) => {
    setPisoFormData({ 
      nombre: piso.nombre, 
      descripcion: piso.descripcion,
      cama: piso.cama,
      bano: piso.bano,
      cocina: piso.cocina
    })
    setEditingPisoId(piso.id)
    setShowPisoForm(true)
  }

  const handleSavePiso = () => {
    if (pisoFormData.nombre.trim()) {
      if (editingPisoId) {
        onUpdatePiso(
          editingPisoId, 
          pisoFormData.nombre.trim(), 
          pisoFormData.descripcion.trim(),
          pisoFormData.cama,
          pisoFormData.bano,
          pisoFormData.cocina
        )
      } else {
        onAddPiso(
          pisoFormData.nombre.trim(), 
          pisoFormData.descripcion.trim(),
          pisoFormData.cama,
          pisoFormData.bano,
          pisoFormData.cocina
        )
      }
      setShowPisoForm(false)
      setPisoFormData({ nombre: '', descripcion: '', cama: 0, bano: 0, cocina: 0 })
      setEditingPisoId(null)
    }
  }

  const handleCancelPisoForm = () => {
    setShowPisoForm(false)
    setPisoFormData({ nombre: '', descripcion: '', cama: 0, bano: 0, cocina: 0 })
    setEditingPisoId(null)
  }

  const handleDeleteClick = (pisoId: string) => {
    if (pisos.length > 1) {
      setShowDeleteConfirm(pisoId)
    }
  }

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      onDeletePiso(showDeleteConfirm)
      setShowDeleteConfirm(null)
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content pisos-modal" onClick={(e) => e.stopPropagation()}>
          <div className="pisos-modal-header">
            <h2 className="modal-title">Gestión de Pisos</h2>
            <button className="close-modal-btn" onClick={onClose}>✕</button>
          </div>

          <div className="pisos-list">
            {pisos.map((piso) => (
              <div 
                key={piso.id} 
                className={`piso-item ${piso.id === pisoActivo ? 'active' : ''}`}
              >
                <div 
                  className="piso-info"
                  onClick={() => {
                    onSelectPiso(piso.id)
                    onClose()
                  }}
                >
                  <div className="piso-content">
                    <span className="piso-nombre">{piso.nombre}</span>
                    {piso.descripcion && (
                      <span className="piso-descripcion">{piso.descripcion}</span>
                    )}
                  </div>
                </div>
                <div className="piso-side">
                  {(piso.cama > 0 || piso.bano > 0 || piso.cocina > 0) && (
                    <div className="piso-stats-mini">
                      {piso.cama > 0 && <span className="stat-mini">🛏️{piso.cama}</span>}
                      {piso.bano > 0 && <span className="stat-mini">🚿{piso.bano}</span>}
                      {piso.cocina > 0 && <span className="stat-mini">🍳{piso.cocina}</span>}
                    </div>
                  )}
                  <div className="piso-actions">
                    <button
                      className="btn-edit-piso"
                      onClick={() => handleOpenEditPiso(piso)}
                      title="Editar piso"
                    >
                      ✏️
                    </button>
                    {pisos.length > 1 && (
                      <button
                        className="btn-delete-piso"
                        onClick={() => handleDeleteClick(piso.id)}
                        title="Eliminar piso"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="add-piso-section">
            <button 
              className="btn-add-piso"
              onClick={handleOpenNewPiso}
            >
              <span className="add-icon">+</span>
              Añadir Nuevo Piso
            </button>
          </div>

          <ConfirmModal
            isOpen={showDeleteConfirm !== null}
            title="⚠️ Eliminar Piso"
            message="CUIDADO: Se eliminarán TODOS los datos de este piso (peticiones de compra, registros de trabajo, compras realizadas e inventario). Esta acción es IRREVERSIBLE y no se podrá recuperar la información."
            confirmText="Eliminar Piso"
            cancelText="Cancelar"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(null)}
            isDanger={true}
          />
        </div>
      </div>

      {showPisoForm && (
        <div className="modal-overlay" onClick={handleCancelPisoForm}>
          <div className="modal-content piso-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="piso-form-header">
              <h2 className="piso-form-title">
                {editingPisoId ? 'Editar Piso' : 'Nuevo Piso'}
              </h2>
              <button className="close-btn" onClick={handleCancelPisoForm}>✕</button>
            </div>

            <div className="piso-form-body">
              <div className="form-group">
                <label htmlFor="piso-nombre" className="form-label">
                  Nombre del Piso <span className="required">*</span>
                </label>
                <input
                  id="piso-nombre"
                  type="text"
                  className="form-input"
                  placeholder="Ej: Piso 2, Planta Baja, etc."
                  value={pisoFormData.nombre}
                  onChange={(e) => setPisoFormData({ ...pisoFormData, nombre: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="piso-descripcion" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="piso-descripcion"
                  className="form-textarea"
                  placeholder="Descripción opcional del piso..."
                  value={pisoFormData.descripcion}
                  onChange={(e) => setPisoFormData({ ...pisoFormData, descripcion: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-row">
                <div className="form-group-small">
                  <label htmlFor="piso-cama" className="form-label-small">
                    🛏️ Cama
                  </label>
                  <input
                    id="piso-cama"
                    type="number"
                    inputMode="numeric"
                    className="form-input-small"
                    min="0"
                    max="25"
                    value={pisoFormData.cama}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setPisoFormData({ ...pisoFormData, cama: Math.min(value, 25) })
                    }}
                  />
                </div>

                <div className="form-group-small">
                  <label htmlFor="piso-bano" className="form-label-small">
                    🚿 Baño
                  </label>
                  <input
                    id="piso-bano"
                    type="number"
                    inputMode="numeric"
                    className="form-input-small"
                    min="0"
                    max="25"
                    value={pisoFormData.bano}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setPisoFormData({ ...pisoFormData, bano: Math.min(value, 25) })
                    }}
                  />
                </div>

                <div className="form-group-small">
                  <label htmlFor="piso-cocina" className="form-label-small">
                    🍳 Cocina
                  </label>
                  <input
                    id="piso-cocina"
                    type="number"
                    inputMode="numeric"
                    className="form-input-small"
                    min="0"
                    max="25"
                    value={pisoFormData.cocina}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      setPisoFormData({ ...pisoFormData, cocina: Math.min(value, 25) })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="piso-form-footer">
              <button 
                className="btn-cancel"
                onClick={handleCancelPisoForm}
              >
                Cancelar
              </button>
              <button 
                className="btn-save"
                onClick={handleSavePiso}
                disabled={!pisoFormData.nombre.trim()}
              >
                {editingPisoId ? 'Guardar' : 'Crear Piso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PisosManager
