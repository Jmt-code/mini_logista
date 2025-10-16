import { useState } from 'react'
import FormSection from '../components/FormSection'
import PDFGenerator from '../components/PDFGenerator'
import { FormData } from '../types/FormTypes'
import './FormPage.css'

const FormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    seccion1: {
      nombre: '',
      email: '',
      telefono: ''
    },
    seccion2: {
      direccion: '',
      ciudad: '',
      codigoPostal: ''
    },
    seccion3: {
      observaciones: ''
    }
  })

  const [currentSection, setCurrentSection] = useState<number>(1)

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const nextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <h1 className="form-title">Mini Logista</h1>
        <p className="form-subtitle">Formulario de registro</p>
        
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentSection / 3) * 100}%` }}
            />
          </div>
          <p className="progress-text">Sección {currentSection} de 3</p>
        </div>

        {currentSection === 1 && (
          <FormSection
            title="Datos Personales"
            fields={[
              { label: 'Nombre', name: 'nombre', type: 'text', value: formData.seccion1.nombre },
              { label: 'Email', name: 'email', type: 'email', value: formData.seccion1.email },
              { label: 'Teléfono', name: 'telefono', type: 'tel', value: formData.seccion1.telefono }
            ]}
            onChange={(field, value) => handleInputChange('seccion1', field, value)}
          />
        )}

        {currentSection === 2 && (
          <FormSection
            title="Dirección"
            fields={[
              { label: 'Dirección', name: 'direccion', type: 'text', value: formData.seccion2.direccion },
              { label: 'Ciudad', name: 'ciudad', type: 'text', value: formData.seccion2.ciudad },
              { label: 'Código Postal', name: 'codigoPostal', type: 'text', value: formData.seccion2.codigoPostal }
            ]}
            onChange={(field, value) => handleInputChange('seccion2', field, value)}
          />
        )}

        {currentSection === 3 && (
          <FormSection
            title="Información Adicional"
            fields={[
              { label: 'Observaciones', name: 'observaciones', type: 'textarea', value: formData.seccion3.observaciones }
            ]}
            onChange={(field, value) => handleInputChange('seccion3', field, value)}
          />
        )}

        <div className="navigation-buttons">
          <button 
            onClick={prevSection} 
            disabled={currentSection === 1}
            className="btn btn-secondary"
          >
            Anterior
          </button>
          
          {currentSection < 3 ? (
            <button 
              onClick={nextSection}
              className="btn btn-primary"
            >
              Siguiente
            </button>
          ) : (
            <PDFGenerator formData={formData} />
          )}
        </div>
      </div>
    </div>
  )
}

export default FormPage
