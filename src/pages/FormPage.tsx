import { useState } from 'react'
import TabNavigation from '../components/TabNavigation'
import TableView from '../components/TableView'
import ComprasView from '../components/ComprasView'
import PDFGenerator from '../components/PDFGenerator'
import OptionsMenu from '../components/OptionsMenu'
import PisosManager from '../components/PisosManager'
import { ConfirmModal, ImportModal, ExportModal, SuccessModal } from '../components/Modal'
import { useFormStore } from '../store/formStore'
import './FormPage.css'

type TabType = 'peticionCompras' | 'registroTrabajo' | 'comprasRealizadas' | 'inventario'

const FormPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('peticionCompras')
  const { 
    appData,
    getFormData,
    updateFormData, 
    clearAllData, 
    clearTabData, 
    exportData, 
    importData,
    setPisoActivo,
    addPiso,
    deletePiso,
    updatePisoNombre
  } = useFormStore()
  
  const formData = getFormData()
  
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showClearAllModal, setShowClearAllModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showPisosManager, setShowPisosManager] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [exportCode, setExportCode] = useState('')

  const tabs = [
    { id: 'peticionCompras' as TabType, label: 'Petición de Compras' },
    { id: 'registroTrabajo' as TabType, label: 'Registro de Trabajo' },
    { id: 'comprasRealizadas' as TabType, label: 'Compras Realizadas' },
    { id: 'inventario' as TabType, label: 'Inventario' }
  ]

  const handleExport = () => {
    const code = exportData()
    setExportCode(code)
    setShowExportModal(true)
  }

  const handleImport = (code: string) => {
    try {
      const jsonString = decodeURIComponent(escape(atob(code)))
      const data = JSON.parse(jsonString)
      importData(data)
      setShowImportModal(false)
      setSuccessMessage('Datos cargados correctamente')
      setShowSuccessModal(true)
    } catch (error) {
      setShowImportModal(false)
      setErrorMessage('Error al cargar los datos. Por favor, verifica el código.')
      setShowErrorModal(true)
    }
  }

  const handleClearAll = () => {
    clearAllData()
    setShowClearAllModal(false)
  }

  const handleClearTab = () => {
    const tabMap = {
      peticionCompras: 'peticionesCompra',
      registroTrabajo: 'registrosTrabajo',
      comprasRealizadas: 'comprasRealizadas',
      inventario: 'inventario'
    }
    clearTabData(tabMap[activeTab] as keyof typeof formData)
  }

  const handleAddRow = (tabId: TabType) => {
    const newId = Date.now().toString()
    const tabMap = {
      peticionCompras: 'peticionesCompra',
      registroTrabajo: 'registrosTrabajo',
      comprasRealizadas: 'comprasRealizadas',
      inventario: 'inventario'
    }
    
    const key = tabMap[tabId] as keyof typeof formData
    
    switch(tabId) {
      case 'peticionCompras':
        updateFormData(key, [{ id: newId, nombreArticulo: '', cantidad: '' }, ...formData.peticionesCompra])
        break
      case 'registroTrabajo':
        updateFormData(key, [{ id: newId, fechaTrabajo: '', lugar: '', tipoTrabajo: '' }, ...formData.registrosTrabajo])
        break
      case 'comprasRealizadas':
        updateFormData(key, [{ 
          id: newId, 
          numeroTicket: '', 
          fecha: '', 
          fotoTicket: '',
          articulos: [{ id: '1', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }]
        }, ...formData.comprasRealizadas])
        break
      case 'inventario':
        updateFormData(key, [{ id: newId, nombreArticulo: '', cantidad: '', prenda: '', estado: '' }, ...formData.inventario])
        break
    }
  }

  const handleDeleteRow = (tabId: TabType, rowId: string) => {
    const tabMap = {
      peticionCompras: 'peticionesCompra',
      registroTrabajo: 'registrosTrabajo',
      comprasRealizadas: 'comprasRealizadas',
      inventario: 'inventario'
    }
    
    const key = tabMap[tabId] as keyof typeof formData
    
    switch(tabId) {
      case 'peticionCompras':
        updateFormData(key, formData.peticionesCompra.filter(item => item.id !== rowId))
        break
      case 'registroTrabajo':
        updateFormData(key, formData.registrosTrabajo.filter(item => item.id !== rowId))
        break
      case 'comprasRealizadas':
        updateFormData(key, formData.comprasRealizadas.filter(item => item.id !== rowId))
        break
      case 'inventario':
        updateFormData(key, formData.inventario.filter(item => item.id !== rowId))
        break
    }
  }

  const handleUpdateRow = (tabId: TabType, rowId: string, field: string, value: any) => {
    const tabMap = {
      peticionCompras: 'peticionesCompra',
      registroTrabajo: 'registrosTrabajo',
      comprasRealizadas: 'comprasRealizadas',
      inventario: 'inventario'
    }
    
    const key = tabMap[tabId] as keyof typeof formData
    
    switch(tabId) {
      case 'peticionCompras':
        updateFormData(key, formData.peticionesCompra.map(item => 
          item.id === rowId ? { ...item, [field]: value } : item
        ))
        break
      case 'registroTrabajo':
        updateFormData(key, formData.registrosTrabajo.map(item => 
          item.id === rowId ? { ...item, [field]: value } : item
        ))
        break
      case 'comprasRealizadas':
        updateFormData(key, formData.comprasRealizadas.map(item => {
          if (item.id === rowId) {
            return { ...item, [field]: value }
          }
          return item
        }))
        break
      case 'inventario':
        updateFormData(key, formData.inventario.map(item => 
          item.id === rowId ? { ...item, [field]: value } : item
        ))
        break
    }
  }

  const getCurrentData = () => {
    switch(activeTab) {
      case 'peticionCompras':
        return formData.peticionesCompra
      case 'registroTrabajo':
        return formData.registrosTrabajo
      case 'comprasRealizadas':
        return formData.comprasRealizadas
      case 'inventario':
        return formData.inventario
      default:
        return []
    }
  }

  const pisoActivo = appData.pisos.find(p => p.id === appData.pisoActivo)

  return (
    <div className="form-page">
      <div className="form-container">
        <header className="form-header">
          <div className="header-left">
            <button 
              className="pisos-button"
              onClick={() => setShowPisosManager(true)}
              title="Gestionar pisos"
            >
              <span className="pisos-icon">🏢</span>
              <span className="pisos-text">{pisoActivo?.nombre || 'Piso 1'}</span>
            </button>
          </div>
          <h1 className="form-title">Maria Moran - Logista</h1>
          <OptionsMenu
            onExport={handleExport}
            onImport={() => setShowImportModal(true)}
            onClearAll={() => setShowClearAllModal(true)}
          />
        </header>

        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="tab-content">
          {activeTab === 'comprasRealizadas' ? (
            <ComprasView
              data={formData.comprasRealizadas}
              onAddRow={() => handleAddRow(activeTab)}
              onDeleteRow={(rowId: string) => handleDeleteRow(activeTab, rowId)}
              onUpdateRow={(rowId: string, field: string, value: any) => handleUpdateRow(activeTab, rowId, field, value)}
              onClearTab={handleClearTab}
            />
          ) : (
            <TableView
              tabId={activeTab}
              data={getCurrentData()}
              onAddRow={() => handleAddRow(activeTab)}
              onDeleteRow={(rowId: string) => handleDeleteRow(activeTab, rowId)}
              onUpdateRow={(rowId: string, field: string, value: any) => handleUpdateRow(activeTab, rowId, field, value)}
              onClearTab={handleClearTab}
            />
          )}
        </div>

        <div className="footer-actions">
          <PDFGenerator appData={appData} />
        </div>
      </div>
      
      {showPisosManager && (
        <PisosManager
          pisos={appData.pisos}
          pisoActivo={appData.pisoActivo}
          onSelectPiso={setPisoActivo}
          onAddPiso={addPiso}
          onDeletePiso={deletePiso}
          onUpdateNombre={updatePisoNombre}
          onClose={() => setShowPisosManager(false)}
        />
      )}
      
      <ExportModal
        isOpen={showExportModal}
        code={exportCode}
        onClose={() => setShowExportModal(false)}
      />
      
      <ImportModal
        isOpen={showImportModal}
        onImport={handleImport}
        onCancel={() => setShowImportModal(false)}
      />
      
      <ConfirmModal
        isOpen={showClearAllModal}
        title="⚠️ Borrar todos los datos"
        message="CUIDADO: Se eliminarán todos los elementos de la aplicación. Esta acción es irreversible y no se podrá deshacer."
        confirmText="Borrar todo"
        cancelText="Cancelar"
        onConfirm={handleClearAll}
        onCancel={() => setShowClearAllModal(false)}
        isDanger={true}
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        title="Éxito"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
      
      <ConfirmModal
        isOpen={showErrorModal}
        title="Error"
        message={errorMessage}
        confirmText="Aceptar"
        cancelText={undefined}
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
        isDanger={true}
      />
    </div>
  )
}

export default FormPage
