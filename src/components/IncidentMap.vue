<template>
  <div class="map-container">
    <div id="map"></div>
    <div class="legend">
      <h4>Leyenda de Riesgo</h4>
      <div class="legend-item">
        <span class="dot critical"></span>
        <span>Crítico (Robo/Acoso)</span>
      </div>
      <div class="legend-item">
        <span class="dot preventive"></span>
        <span>Preventivo (Infraestructura)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import { useIncidentStore } from '../stores/incidentStore'

const props = defineProps({
  allowSelection: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['location-selected'])

const store = useIncidentStore()
let map = null
let markers = []
let tempMarker = null

const initMap = () => {
  // Centro actualizado para Fe y Alegría
  map = L.map('map').setView([-0.2517, -78.516255], 16)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  if (props.allowSelection) {
    map.getContainer().style.cursor = 'crosshair'
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      
      if (tempMarker) {
        map.removeLayer(tempMarker)
      }
      
      tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map)
      
      emit('location-selected', { lat, lng })
    })
  } else {
    map.getContainer().style.cursor = ''
  }

  renderMarkers()
}

const renderMarkers = () => {
  if (!map) return

  // Limpiar marcadores existentes
  markers.forEach(m => map.removeLayer(m))
  markers = []

  store.incidents.forEach(incident => {
    const color = incident.severidad === 'HIGH' ? '#ef4444' : '#f97316'
    
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px; font-weight: bold;">!</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const marker = L.marker([incident.latitud, incident.longitud], { icon })
      .bindPopup(`<b>${incident.tipo}</b><br>Hora: ${incident.horaAprox}`)
      .addTo(map)
      
    markers.push(marker)
  })
}

onMounted(() => {
  initMap()
})

// Re-init map if allowSelection changes so event listeners apply
watch(() => props.allowSelection, (newVal) => {
  if (map) {
    if (newVal) {
      map.getContainer().style.cursor = 'crosshair'
      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        if (tempMarker) map.removeLayer(tempMarker)
        tempMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(map)
        emit('location-selected', { lat, lng })
      })
    } else {
      map.getContainer().style.cursor = ''
      map.off('click')
      if (tempMarker) map.removeLayer(tempMarker)
    }
  }
})

watch(() => store.incidents, renderMarkers, { deep: true })
</script>

<style scoped>
.map-container {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 1000;
}

.legend h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  font-style: italic;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.critical {
  background-color: #ef4444;
}

.dot.preventive {
  background-color: #f97316;
}
</style>
