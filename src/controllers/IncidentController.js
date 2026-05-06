import { Incident } from '../models/Incident'

export class IncidentController {
  // Simulación de llamadas a API
  static async getIncidents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          new Incident({ id: '1', tipo: 'Robo', severidad: 'HIGH', jornada: 'Matutina', horaAprox: '07:30', latitud: -0.2517, longitud: -78.5162 }),
          new Incident({ id: '2', tipo: 'Zona Oscura', severidad: 'MEDIUM', jornada: 'Vespertina', horaAprox: '18:45', latitud: -0.2525, longitud: -78.5150 }),
          new Incident({ id: '3', tipo: 'Acoso', severidad: 'HIGH', jornada: 'Matutina', horaAprox: '13:15', latitud: -0.2510, longitud: -78.5170 })
        ])
      }, 500)
    })
  }

  static async createIncident(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Incident(data))
      }, 500)
    })
  }
}
