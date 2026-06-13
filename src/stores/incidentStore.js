import { defineStore } from 'pinia'
import { IncidentController } from '../controllers/IncidentController'

export const useIncidentStore = defineStore('incident', {
  state: () => ({
    incidents: [],
    isLoading: false,
    error: null,
    sseConnected: false,
    _sseSource: null
  }),

  getters: {
    totalIncidents: (state) => state.incidents.length,
    criticalZones: (state) => state.incidents.filter(i => i.severidad === 'HIGH').length,
    latestIncident: (state) => {
      if (state.incidents.length === 0) return 'Ninguno'
      return state.incidents[0].tipo
    }
  },

  actions: {
    async fetchIncidents() {
      this.isLoading = true
      try {
        const data = await IncidentController.getIncidents()
        this.incidents = data
        localStorage.setItem('sc_incidents', JSON.stringify(data))
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async addIncident(incidentData) {
      this.isLoading = true
      try {
        const newIncident = await IncidentController.createIncident(incidentData)
        // SSE broadcast lo añadirá automáticamente si está conectado
        // Si no hay SSE, lo añadimos manualmente para consistencia inmediata
        if (!this.sseConnected) {
          this.incidents.unshift(newIncident)
          localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
        }
        return newIncident
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async updateIncidentStatus(id, newStatus) {
      this.isLoading = true
      try {
        await IncidentController.updateIncidentStatus(id, newStatus)
        // SSE actualizará reactivamente. Si no hay SSE, actualizamos local:
        if (!this.sseConnected) {
          const idx = this.incidents.findIndex(i => i.id === id)
          if (idx !== -1) {
            this.incidents[idx] = { ...this.incidents[idx], estado: newStatus }
            localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
          }
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    // Inicia la conexión SSE para tiempo real
    connectSSE() {
      if (this._sseSource) return // Ya conectado

      const es = IncidentController.createSSEConnection()
      if (!es) return

      this._sseSource = es

      es.addEventListener('connected', () => {
        this.sseConnected = true
        console.log('📡 SSE conectado — tiempo real activo')
      })

      // Nuevo incidente creado → añadir al inicio de la lista
      es.addEventListener('new_incident', (event) => {
        try {
          const incident = JSON.parse(event.data)
          // Evitar duplicados
          if (!this.incidents.find(i => i.id === incident.id)) {
            this.incidents.unshift(incident)
            localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
          }
        } catch (e) {
          console.error('Error procesando evento SSE:', e)
        }
      })

      // Estado actualizado → actualizar en la lista
      es.addEventListener('status_updated', (event) => {
        try {
          const { id, estado } = JSON.parse(event.data)
          const idx = this.incidents.findIndex(i => i.id === id)
          if (idx !== -1) {
            this.incidents[idx] = { ...this.incidents[idx], estado }
            localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
          }
        } catch (e) {
          console.error('Error procesando evento SSE:', e)
        }
      })

      es.onerror = () => {
        this.sseConnected = false
        console.warn('⚠️ SSE desconectado, reintentando...')
        // El navegador reintentará automáticamente
      }
    },

    disconnectSSE() {
      if (this._sseSource) {
        this._sseSource.close()
        this._sseSource = null
        this.sseConnected = false
      }
    }
  }
})
