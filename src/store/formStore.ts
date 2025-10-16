import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FormData } from '../types/FormTypes'

interface FormStore {
  formData: FormData
  setFormData: (data: FormData) => void
  updateFormData: (key: keyof FormData, value: any) => void
  clearAllData: () => void
  clearTabData: (tab: keyof FormData) => void
  importData: (data: FormData) => void
  exportData: () => string
}

const initialData: FormData = {
  peticionesCompra: [{ id: '1', nombreArticulo: '', cantidad: '' }],
  registrosTrabajo: [{ id: '1', fechaTrabajo: '', lugar: '', tipoTrabajo: '' }],
  comprasRealizadas: [{ id: '1', numeroTicket: '', fecha: '', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }],
  inventario: [{ id: '1', nombreArticulo: '', cantidad: '', prenda: '', estado: '' }]
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      formData: initialData,
      
      setFormData: (data) => set({ formData: data }),
      
      updateFormData: (key, value) => set((state) => ({
        formData: { ...state.formData, [key]: value }
      })),
      
      clearAllData: () => set({ formData: initialData }),
      
      clearTabData: (tab) => set((state) => {
        const defaultValues = {
          peticionesCompra: [{ id: '1', nombreArticulo: '', cantidad: '' }],
          registrosTrabajo: [{ id: '1', fechaTrabajo: '', lugar: '', tipoTrabajo: '' }],
          comprasRealizadas: [{ id: '1', numeroTicket: '', fecha: '', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }],
          inventario: [{ id: '1', nombreArticulo: '', cantidad: '', prenda: '', estado: '' }]
        }
        
        return {
          formData: {
            ...state.formData,
            [tab]: defaultValues[tab]
          }
        }
      }),
      
      importData: (data) => set({ formData: data }),
      
      exportData: () => {
        const currentData = get().formData
        const jsonString = JSON.stringify(currentData)
        return btoa(unescape(encodeURIComponent(jsonString)))
      }
    }),
    {
      name: 'logista-storage',
    }
  )
)
