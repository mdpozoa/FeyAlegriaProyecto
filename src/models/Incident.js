export class Incident {
  constructor({ id, tipo, severidad, jornada, horaAprox, latitud, longitud, descripcion, reporteroId, estado = 'Reportado' }) {
    this.id = id || crypto.randomUUID()
    this.tipo = tipo
    this.severidad = severidad // 'HIGH', 'MEDIUM', 'LOW'
    this.jornada = jornada // 'Matutina', 'Vespertina'
    this.horaAprox = horaAprox
    this.latitud = latitud
    this.longitud = longitud
    this.descripcion = descripcion
    this.reporteroId = reporteroId
    this.estado = estado
  }
}
