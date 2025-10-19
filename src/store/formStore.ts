import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FormData, Piso, AppData } from '../types/FormTypes'

interface FormStore {
  appData: AppData
  setAppData: (data: AppData) => void
  getPisoActivo: () => Piso | undefined
  getFormData: () => FormData
  updateFormData: (key: keyof FormData, value: any) => void
  setPisoActivo: (pisoId: string) => void
  addPiso: (nombre: string) => void
  deletePiso: (pisoId: string) => void
  updatePisoNombre: (pisoId: string, nombre: string) => void
  clearAllData: () => void
  clearTabData: (tab: keyof FormData) => void
  clearPisoData: (pisoId: string) => void
  confirmarInventario: () => void
  importData: (data: AppData) => void
  exportData: () => string
}

const createEmptyFormData = (): FormData => ({
  peticionesCompra: [{ id: '1', nombreArticulo: '', cantidad: '' }],
  registrosTrabajo: [{ id: '1', fechaTrabajo: '', lugar: '', tipoTrabajo: '' }],
  comprasRealizadas: [{ 
    id: '1', 
    numeroTicket: '', 
    fecha: '', 
    fotoTicket: '',
    articulos: [{ id: '1', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }]
  }],
  inventario: [{ id: '1', nombreArticulo: '', cantidadAnterior: '0', cantidadActual: '0', prenda: '', estado: '' }]
})

const initialAppData: AppData = {
  pisos: [
    {
      id: '1',
      nombre: 'Piso 1',
      formData: createEmptyFormData()
    }
  ],
  pisoActivo: '1'
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      appData: initialAppData,
      
      setAppData: (data) => set({ appData: data }),
      
      getPisoActivo: () => {
        const { appData } = get()
        return appData.pisos.find(p => p.id === appData.pisoActivo)
      },
      
      getFormData: () => {
        const piso = get().getPisoActivo()
        return piso ? piso.formData : createEmptyFormData()
      },
      
      updateFormData: (key, value) => set((state) => {
        const pisos = state.appData.pisos.map(piso => {
          if (piso.id === state.appData.pisoActivo) {
            return {
              ...piso,
              formData: { ...piso.formData, [key]: value }
            }
          }
          return piso
        })
        
        return {
          appData: {
            ...state.appData,
            pisos
          }
        }
      }),
      
      setPisoActivo: (pisoId) => set((state) => ({
        appData: {
          ...state.appData,
          pisoActivo: pisoId
        }
      })),
      
      addPiso: (nombre) => set((state) => {
        const newPiso: Piso = {
          id: Date.now().toString(),
          nombre,
          formData: createEmptyFormData()
        }
        
        return {
          appData: {
            ...state.appData,
            pisos: [...state.appData.pisos, newPiso],
            pisoActivo: newPiso.id
          }
        }
      }),
      
      deletePiso: (pisoId) => set((state) => {
        const pisos = state.appData.pisos.filter(p => p.id !== pisoId)
        
        // Si eliminamos el piso activo, activar el primero disponible
        let pisoActivo = state.appData.pisoActivo
        if (pisoId === pisoActivo && pisos.length > 0) {
          pisoActivo = pisos[0].id
        }
        
        return {
          appData: {
            ...state.appData,
            pisos,
            pisoActivo
          }
        }
      }),
      
      updatePisoNombre: (pisoId, nombre) => set((state) => {
        const pisos = state.appData.pisos.map(piso => 
          piso.id === pisoId ? { ...piso, nombre } : piso
        )
        
        return {
          appData: {
            ...state.appData,
            pisos
          }
        }
      }),
      
      clearAllData: () => set({ appData: initialAppData }),
      
      clearTabData: (tab) => set((state) => {
        const defaultValues = {
          peticionesCompra: [{ id: '1', nombreArticulo: '', cantidad: '' }],
          registrosTrabajo: [{ id: '1', fechaTrabajo: '', lugar: '', tipoTrabajo: '' }],
          comprasRealizadas: [{ 
            id: '1', 
            numeroTicket: '', 
            fecha: '', 
            fotoTicket: '',
            articulos: [{ id: '1', nombreArticulo: '', cantidad: '', precioUnidad: '0.00', total: '' }]
          }],
          inventario: [{ id: '1', nombreArticulo: '', cantidadAnterior: '0', cantidadActual: '0', prenda: '', estado: '' }]
        }
        
        const pisos = state.appData.pisos.map(piso => {
          if (piso.id === state.appData.pisoActivo) {
            return {
              ...piso,
              formData: {
                ...piso.formData,
                [tab]: defaultValues[tab]
              }
            }
          }
          return piso
        })
        
        return {
          appData: {
            ...state.appData,
            pisos
          }
        }
      }),
      
      clearPisoData: (pisoId) => set((state) => {
        const pisos = state.appData.pisos.map(piso => 
          piso.id === pisoId ? { ...piso, formData: createEmptyFormData() } : piso
        )
        
        return {
          appData: {
            ...state.appData,
            pisos
          }
        }
      }),
      
      confirmarInventario: () => set((state) => {
        const pisos = state.appData.pisos.map(piso => {
          if (piso.id === state.appData.pisoActivo) {
            const inventarioActualizado = piso.formData.inventario.map(item => ({
              ...item,
              cantidadAnterior: item.cantidadActual || item.cantidadAnterior,
              cantidadActual: item.cantidadActual || item.cantidadAnterior
            }))
            
            return {
              ...piso,
              formData: {
                ...piso.formData,
                inventario: inventarioActualizado
              }
            }
          }
          return piso
        })
        
        return {
          appData: {
            ...state.appData,
            pisos
          }
        }
      }),
      
      importData: (data) => set({ appData: data }),
      
      exportData: () => {
        const currentData = get().appData
        const jsonString = JSON.stringify(currentData)
        return btoa(unescape(encodeURIComponent(jsonString)))
      }
    }),
    {
      name: 'logista-storage',
    }
  )
)
