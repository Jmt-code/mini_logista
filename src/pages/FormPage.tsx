import { useState } from 'react'
import TabNavigation from '../components/TabNavigation'
import TableView from '../components/TableView'
import PDFGenerator from '../components/PDFGenerator'
import { FormData } from '../types/FormTypes'
import './FormPage.css'

type TabType = 'peticionCompras' | 'registroTrabajo' | 'comprasRealizadas' | 'inventario'

const FormPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('peticionCompras')
  const [formData, setFormData] = useState<FormData>({
    peticionesCompra: [{ id: '1', nombreArticulo: '', cantidad: '' }],
    registrosTrabajo: [{ id: '1', fechaTrabajo: '', lugar: '', tipoTrabajo: '' }],
    comprasRealizadas: [{ id: '1', numeroTicket: '', fecha: '', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }],
    inventario: [{ id: '1', nombreArticulo: '', cantidad: '', prenda: '', estado: '' }]
  })

  const tabs = [
    { id: 'peticionCompras' as TabType, label: 'Petición de Compras' },
    { id: 'registroTrabajo' as TabType, label: 'Registro de Trabajo' },
    { id: 'comprasRealizadas' as TabType, label: 'Compras Realizadas' },
    { id: 'inventario' as TabType, label: 'Inventario' }
  ]

  const handleAddRow = (tabId: TabType) => {
    const newId = Date.now().toString()
    
    switch(tabId) {
      case 'peticionCompras':
        setFormData(prev => ({
          ...prev,
          peticionesCompra: [{ id: newId, nombreArticulo: '', cantidad: '' }, ...prev.peticionesCompra]
        }))
        break
      case 'registroTrabajo':
        setFormData(prev => ({
          ...prev,
          registrosTrabajo: [{ id: newId, fechaTrabajo: '', lugar: '', tipoTrabajo: '' }, ...prev.registrosTrabajo]
        }))
        break
      case 'comprasRealizadas':
        setFormData(prev => ({
          ...prev,
          comprasRealizadas: [{ id: newId, numeroTicket: '', fecha: '', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }, ...prev.comprasRealizadas]
        }))
        break
      case 'inventario':
        setFormData(prev => ({
          ...prev,
          inventario: [{ id: newId, nombreArticulo: '', cantidad: '', prenda: '', estado: '' }, ...prev.inventario]
        }))
        break
    }
  }

  const handleDeleteRow = (tabId: TabType, rowId: string) => {
    switch(tabId) {
      case 'peticionCompras':
        setFormData(prev => ({
          ...prev,
          peticionesCompra: prev.peticionesCompra.filter(item => item.id !== rowId)
        }))
        break
      case 'registroTrabajo':
        setFormData(prev => ({
          ...prev,
          registrosTrabajo: prev.registrosTrabajo.filter(item => item.id !== rowId)
        }))
        break
      case 'comprasRealizadas':
        setFormData(prev => ({
          ...prev,
          comprasRealizadas: prev.comprasRealizadas.filter(item => item.id !== rowId)
        }))
        break
      case 'inventario':
        setFormData(prev => ({
          ...prev,
          inventario: prev.inventario.filter(item => item.id !== rowId)
        }))
        break
    }
  }

  const handleUpdateRow = (tabId: TabType, rowId: string, field: string, value: any) => {
    switch(tabId) {
      case 'peticionCompras':
        setFormData(prev => ({
          ...prev,
          peticionesCompra: prev.peticionesCompra.map(item => 
            item.id === rowId ? { ...item, [field]: value } : item
          )
        }))
        break
      case 'registroTrabajo':
        setFormData(prev => ({
          ...prev,
          registrosTrabajo: prev.registrosTrabajo.map(item => 
            item.id === rowId ? { ...item, [field]: value } : item
          )
        }))
        break
      case 'comprasRealizadas':
        setFormData(prev => ({
          ...prev,
          comprasRealizadas: prev.comprasRealizadas.map(item => {
            if (item.id === rowId) {
              const updatedItem = { ...item, [field]: value }
              // Auto-calcular precio/u si cambia total o cantidad
              if (field === 'cantidad' || field === 'total') {
                const cantidad = parseFloat(field === 'cantidad' ? value : updatedItem.cantidad) || 0
                const total = parseFloat(field === 'total' ? value : updatedItem.total.toString()) || 0
                updatedItem.precioUnidad = cantidad > 0 ? (total / cantidad).toFixed(2) : '0.00'
              }
              return updatedItem
            }
            return item
          })
        }))
        break
      case 'inventario':
        setFormData(prev => ({
          ...prev,
          inventario: prev.inventario.map(item => 
            item.id === rowId ? { ...item, [field]: value } : item
          )
        }))
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

  return (
    <div className="form-page">
      <div className="form-container">
        <header className="form-header">
          <h1 className="form-title">Maria Moran - Logista</h1>
        </header>

        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="tab-content">
          <TableView
            tabId={activeTab}
            data={getCurrentData()}
            onAddRow={() => handleAddRow(activeTab)}
            onDeleteRow={(rowId) => handleDeleteRow(activeTab, rowId)}
            onUpdateRow={(rowId, field, value) => handleUpdateRow(activeTab, rowId, field, value)}
          />
        </div>

        <div className="footer-actions">
          <PDFGenerator formData={formData} />
        </div>
      </div>
    </div>
  )
}

export default FormPage
