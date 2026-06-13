import { Incident } from '../models/Incident'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('sc_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

export class IncidentController {

  static async getIncidents() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${API_URL}/incidents`, {
        headers: authHeaders(),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error(`Error ${response.status}`)

      const data = await response.json()
      return data.map(item => new Incident({
        id: item.id,
        tipo: item.tipo,
        severidad: item.severidad,
        jornada: item.jornada,
        horaAprox: item.horaAprox || item.hora_aprox,
        latitud: item.latitud,
        longitud: item.longitud,
        reporteroId: item.reporteroId || item.reportero_id,
        descripcion: item.descripcion,
        estado: item.estado || 'Reportado'
      }))
    } catch (err) {
      console.warn('⚠️ Backend no disponible, usando LocalStorage:', err.message)
      const localData = localStorage.getItem('sc_incidents')
      if (localData) {
        return JSON.parse(localData).map(item => new Incident(item))
      }
      return []
    }
  }

  static async createIncident(data) {
    try {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          tipo: data.tipo,
          severidad: data.severidad,
          jornada: data.jornada,
          horaAprox: data.horaAprox,
          latitud: data.latitud,
          longitud: data.longitud,
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
        horaAprox: item.horaAprox || item.hora_aprox,
        latitud: item.latitud,
        longitud: item.longitud,
        reporteroId: item.reporteroId || item.reportero_id,
        descripcion: item.descripcion,
        estado: item.estado || 'Reportado'
      })
    } catch (err) {
      console.warn('⚠️ Guardando en LocalStorage:', err.message)
      const incident = new Incident({ ...data, reporteroId: data.reporteroId })
      // Persistir en local como fallback
      const existing = JSON.parse(localStorage.getItem('sc_incidents') || '[]')
      existing.push(incident)
      localStorage.setItem('sc_incidents', JSON.stringify(existing))
      return incident
    }
  }

  static async updateIncidentStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/incidents/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ estado: status })
      })
      if (!response.ok) throw new Error('Error al actualizar estado')
      return await response.json()
    } catch (err) {
      console.warn('⚠️ Actualizando estado en LocalStorage:', err.message)
      return { id, estado: status }
    }
  }

  // Crea una conexión SSE y devuelve el EventSource
  static createSSEConnection() {
    const token = getToken()
    if (!token) return null
    const url = `${API_URL}/incidents/stream`
    // Pasamos el token via query param para SSE (EventSource no soporta headers)
    const es = new EventSource(`${url}?token=${token}`)
    return es
  }
}
