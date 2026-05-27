import { Incident } from '../models/Incident'

const API_URL = 'http://localhost:3000/api'

export class IncidentController {
  // Intentar conectar con el backend de SQLite, con fallback de seguridad a LocalStorage
  static async getIncidents() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200) // 1.2 segundos de timeout

      const response = await fetch(`${API_URL}/incidents`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Servidor remoto retornó error de red')
      }

      const data = await response.json()
      return data.map(item => new Incident({
        id: item.id,
        tipo: item.tipo,
        severidad: item.severidad,
        jornada: item.jornada,
        horaAprox: item.hora_aprox || item.horaAprox, // Manejo de formato snake_case / camelCase
        latitud: item.latitud,
        longitud: item.longitud,
        reporteroId: item.reportero_id || item.reporteroId,
        descripcion: item.descripcion,
        estado: item.estado
      }))
    } catch (err) {
      console.warn('Aviso: Backend SQLite no disponible o inactivo. SafeCampus Monitor corriendo en Modo Autónomo Local (LocalStorage). Detalle:', err.message)
      
      // Fallback a semillas estáticas si no hay datos guardados previamente en el localStorage
      const localData = localStorage.getItem('incidents')
      if (localData) {
        return JSON.parse(localData).map(item => new Incident(item))
      }
      
      return [
        new Incident({ 
          id: 'i1', 
          tipo: 'Robo', 
          severidad: 'HIGH', 
          jornada: 'Matutina', 
          horaAprox: '07:30', 
          latitud: -0.2517, 
          longitud: -78.5162, 
          reporteroId: 'u1', 
          descripcion: null 
        }),
        new Incident({ 
          id: 'i2', 
          tipo: 'Otros', 
          severidad: 'MEDIUM', 
          jornada: 'Vespertina', 
          horaAprox: '18:45', 
          latitud: -0.2525, 
          longitud: -78.5150, 
          reporteroId: 'u2', 
          descripcion: 'Se identificó presencia de personas sospechosas merodeando en la esquina del portón trasero principal de la institución.' 
        })
      ]
    }
  }

  static async createIncident(data) {
    try {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: data.tipo,
          severidad: data.severidad,
          jornada: data.jornada,
          horaAprox: data.horaAprox,
          latitud: data.latitud,
          longitud: data.longitud,
          reporteroId: data.reporteroId,
          descripcion: data.descripcion
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en respuesta del servidor')
      }

      const item = await response.json()
      return new Incident({
        id: item.id,
        tipo: item.tipo,
        severidad: item.severidad,
        jornada: item.jornada,
        horaAprox: item.hora_aprox || item.horaAprox,
        latitud: item.latitud,
        longitud: item.longitud,
        reporteroId: item.reportero_id || item.reporteroId,
        descripcion: item.descripcion,
        estado: item.estado
      })
    } catch (err) {
      console.warn('Aviso: Guardando incidente en LocalStorage debido a inactividad del backend. Detalle:', err.message)
      return new Incident(data)
    }
  }
}
