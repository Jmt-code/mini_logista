import { useState, useRef, useEffect } from 'react'
import './OptionsMenu.css'

interface OptionsMenuProps {
  onExport: () => void
  onImport: () => void
  onClearAll: () => void
}

const OptionsMenu = ({ onExport, onImport, onClearAll }: OptionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleOptionClick = (callback: () => void) => {
    callback()
    setIsOpen(false)
  }

  return (
    <div className="options-menu" ref={menuRef}>
      <button 
        className="options-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Opciones"
      >
        ⋮
      </button>
      
      {isOpen && (
        <div className="options-dropdown">
          <button 
            className="option-item"
            onClick={() => handleOptionClick(onExport)}
          >
            <span className="option-icon">📤</span>
            Exportar datos
          </button>
          
          <button 
            className="option-item"
            onClick={() => handleOptionClick(onImport)}
          >
            <span className="option-icon">📥</span>
            Cargar datos
          </button>
          
          <div className="option-divider"></div>
          
          <button 
            className="option-item option-danger"
            onClick={() => handleOptionClick(onClearAll)}
          >
            <span className="option-icon">🗑️</span>
            Borrar todos los datos
          </button>
        </div>
      )}
    </div>
  )
}

export default OptionsMenu
