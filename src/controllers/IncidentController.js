import { Incident } from '../models/Incident'

// En Vercel, la API está en el mismo dominio como /api
// En desarrollo local, apunta al servidor Express o a vercel dev
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function getToken() {
  return localStorage.getItem('sc_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export class IncidentController {

  static async getIncidents() {
    try {
      const response = await fetch(`${API_URL}/incidents`, {
        headers: authHeaders()
      })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      const data = await response.json()
      return data.map(item => new Incident({
        id: item.id,
        tipo: item.tipo,
        severidad: item.severidad,
        jornada: item.jornada,
        horaAprox: item.horaAprox || item.hora_aprox,
        latitud: parseFloat(item.latitud),
        longitud: parseFloat(item.longitud),
        reporteroId: item.reporteroId || item.reportero_id,
        descripcion: item.descripcion,
        estado: item.estado || 'Reportado'
      }))
    } catch (err) {
      console.warn('⚠️ Backend no disponible, usando caché local:', err.message)
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
          descripcion: data.descripcion || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en el servidor')
      }

      const item = await response.json()
      return new Incident({
        id: item.id,
        tipo: item.tipo,
        severidad: item.severidad,
        jornada: item.jornada,
        horaAprox: item.horaAprox || item.hora_aprox,
        latitud: parseFloat(item.latitud),
        longitud: parseFloat(item.longitud),
        reporteroId: item.reporteroId || item.reportero_id,
        descripcion: item.descripcion,
        estado: item.estado || 'Reportado'
      })
    } catch (err) {
      console.warn('⚠️ Guardando localmente por fallo de red:', err.message)
      const incident = new Incident({
        ...data,
        reporteroId: data.reporteroId,
        estado: 'Reportado'
      })
      const existing = JSON.parse(localStorage.getItem('sc_incidents') || '[]')
      existing.unshift(incident)
      localStorage.setItem('sc_incidents', JSON.stringify(existing))
      return incident
    }
  }

  static async updateIncidentStatus(id, status) {
    const response = await fetch(`${API_URL}/incidents/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ estado: status })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Error al actualizar estado')
    }
    return response.json()
  }
}
