import { useState } from 'react'
import { ConfirmModal } from './Modal'
import './PisosManager.css'

interface PisosManagerProps {
  pisos: Array<{ id: string; nombre: string }>
  pisoActivo: string
  onSelectPiso: (pisoId: string) => void
  onAddPiso: (nombre: string) => void
  onDeletePiso: (pisoId: string) => void
  onUpdateNombre: (pisoId: string, nombre: string) => void
  onClose: () => void
}

const PisosManager = ({ 
  pisos, 
  pisoActivo, 
  onSelectPiso, 
  onAddPiso, 
  onDeletePiso,
  onUpdateNombre,
  onClose 
}: PisosManagerProps) => {
  const [newPisoName, setNewPisoName] = useState('')
  const [editingPiso, setEditingPiso] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleAddPiso = () => {
    if (newPisoName.trim()) {
      onAddPiso(newPisoName.trim())
      setNewPisoName('')
    }
  }

  const handleStartEdit = (piso: { id: string; nombre: string }) => {
    setEditingPiso(piso.id)
    setEditName(piso.nombre)
  }

  const handleSaveEdit = () => {
    if (editingPiso && editName.trim()) {
      onUpdateNombre(editingPiso, editName.trim())
      setEditingPiso(null)
      setEditName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingPiso(null)
    setEditName('')
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
              {editingPiso === piso.id ? (
                <div className="piso-edit-mode">
                  <input
                    type="text"
                    className="piso-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                  <div className="piso-edit-actions">
                    <button className="btn-save-edit" onClick={handleSaveEdit}>
                      ✓
                    </button>
                    <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="piso-info"
                    onClick={() => {
                      onSelectPiso(piso.id)
                      onClose()
                    }}
                  >
                    <span className="piso-icon">🏢</span>
                    <span className="piso-nombre">{piso.nombre}</span>
                  </div>
                  <div className="piso-actions">
                    <button
                      className="btn-edit-piso"
                      onClick={() => handleStartEdit(piso)}
                      title="Editar nombre"
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
                </>
              )}
            </div>
          ))}
        </div>

        <div className="add-piso-section">
          <h3 className="add-piso-title">Añadir Nuevo Piso</h3>
          <div className="add-piso-form">
            <input
              type="text"
              className="add-piso-input"
              placeholder="Nombre del piso (ej: Piso 2)"
              value={newPisoName}
              onChange={(e) => setNewPisoName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPiso()}
            />
            <button 
              className="btn-add-piso"
              onClick={handleAddPiso}
              disabled={!newPisoName.trim()}
            >
              <span className="add-icon">+</span>
              Añadir Piso
            </button>
          </div>
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
  )
}

export default PisosManager
