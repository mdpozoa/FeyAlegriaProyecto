import { defineStore } from 'pinia'
import { IncidentController } from '../controllers/IncidentController'

export const useIncidentStore = defineStore('incident', {
  state: () => ({
    incidents: [],
    isLoading: false,
    error: null,
    _pollInterval: null
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
        // Añadimos optimistamente al inicio de la lista
        const exists = this.incidents.find(i => i.id === newIncident.id)
        if (!exists) this.incidents.unshift(newIncident)
        localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
        return newIncident
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateIncidentStatus(id, newStatus) {
      this.isLoading = true
      try {
        await IncidentController.updateIncidentStatus(id, newStatus)
        // Actualización optimista local inmediata
        const idx = this.incidents.findIndex(i => i.id === id)
        if (idx !== -1) {
          this.incidents[idx] = { ...this.incidents[idx], estado: newStatus }
          localStorage.setItem('sc_incidents', JSON.stringify(this.incidents))
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Polling cada 5 segundos para actualizaciones en tiempo real
    startPolling() {
      if (this._pollInterval) return
      this._pollInterval = setInterval(() => {
        this.fetchIncidents()
      }, 5000)
    },

    stopPolling() {
      if (this._pollInterval) {
        clearInterval(this._pollInterval)
        this._pollInterval = null
      }
    },

    // Alias para compatibilidad con SSE anterior
    connectSSE() { this.startPolling() },
    disconnectSSE() { this.stopPolling() }
  }
})
