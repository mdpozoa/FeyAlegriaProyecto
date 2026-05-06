import { defineStore } from 'pinia'
import { IncidentController } from '../controllers/IncidentController'

export const useIncidentStore = defineStore('incident', {
  state: () => ({
    incidents: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalIncidents: (state) => state.incidents.length,
    criticalZones: (state) => state.incidents.filter(i => i.severidad === 'HIGH').length,
    latestIncident: (state) => {
      if (state.incidents.length === 0) return 'Ninguno'
      return state.incidents[state.incidents.length - 1].tipo
    }
  },

  actions: {
    async fetchIncidents() {
      this.isLoading = true
      try {
        const stored = localStorage.getItem('incidents')
        if (stored) {
          this.incidents = JSON.parse(stored)
        } else {
          const data = await IncidentController.getIncidents()
          this.incidents = data
          localStorage.setItem('incidents', JSON.stringify(data))
        }
        
        // Sincronización en tiempo real entre pestañas
        if (!window.__incidentSyncSetup) {
          window.__incidentSyncSetup = true
          window.addEventListener('storage', (e) => {
            if (e.key === 'incidents') {
              this.incidents = JSON.parse(e.newValue || '[]')
            }
          })
        }
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
        this.incidents.push(newIncident)
        
        // Guardar y notificar a otras pestañas
        localStorage.setItem('incidents', JSON.stringify(this.incidents))
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    }
  }
})
