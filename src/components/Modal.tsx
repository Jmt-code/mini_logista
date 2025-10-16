import { useState } from 'react'
import './Modal.css'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string | undefined
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm, 
  onCancel,
  isDanger = false
}: ConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {cancelText && (
            <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button 
            className={`modal-btn ${isDanger ? 'modal-btn-danger' : 'modal-btn-confirm'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ImportModalProps {
  isOpen: boolean
  onImport: (code: string) => void
  onCancel: () => void
}

export const ImportModal = ({ isOpen, onImport, onCancel }: ImportModalProps) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleImport = () => {
    if (!code.trim()) {
      setError('Por favor, introduce un código')
      return
    }
    
    try {
      // Validar que sea base64 válido
      atob(code)
      onImport(code)
      setCode('')
      setError('')
    } catch (e) {
      setError('Código inválido. Por favor, verifica el código e intenta de nuevo.')
    }
  }

  const handleCancel = () => {
    setCode('')
    setError('')
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Cargar Datos</h3>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            Pega el código de exportación para cargar tus datos:
          </p>
          <textarea
            className="modal-textarea"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setError('')
            }}
            placeholder="Pega aquí el código de exportación..."
            rows={6}
          />
          {error && <p className="modal-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={handleImport}>
            Cargar Datos
          </button>
        </div>
      </div>
    </div>
  )
}

interface ExportModalProps {
  isOpen: boolean
  code: string
  onClose: () => void
}

export const ExportModal = ({ isOpen, code, onClose }: ExportModalProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Exportar Datos</h3>
        </div>
        <div className="modal-body">
          <p className="modal-description">
            Copia este código para importar tus datos más tarde:
          </p>
          <textarea
            className="modal-textarea"
            value={code}
            readOnly
            rows={6}
            onClick={(e) => e.currentTarget.select()}
          />
          <button className="copy-button" onClick={handleCopy}>
            {copied ? '✓ Copiado' : '📋 Copiar código'}
          </button>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-confirm" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

interface SuccessModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
}

export const SuccessModal = ({ isOpen, title, message, onClose }: SuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">✓ {title}</h3>
        </div>
        <div className="modal-body">
          <p className="modal-success-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-confirm" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
