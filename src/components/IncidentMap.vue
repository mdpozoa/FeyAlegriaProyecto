<template>
  <div class="map-wrapper">
    <!-- Barra de búsqueda de calles -->
    <div class="search-bar-container">
      <div class="search-input-wrap">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          id="map-search-input"
          v-model="searchQuery"
          type="text"
          placeholder="Buscar calle o lugar… ej: Av. Simón Bolívar"
          class="search-input"
          autocomplete="off"
          @input="onSearchInput"
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.escape="clearResults"
          @blur="onBlur"
        />
        <button v-if="searchQuery" class="clear-btn" @mousedown.prevent="clearSearch" title="Limpiar búsqueda">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Resultados de búsqueda -->
      <ul v-if="searchResults.length > 0" class="search-results" role="listbox">
        <li
          v-for="(result, index) in searchResults"
          :key="result.place_id"
          :class="['search-result-item', { highlighted: index === highlightedIndex }]"
          role="option"
          @mousedown.prevent="selectResult(result)"
        >
          <span class="result-icon">📍</span>
          <div class="result-text">
            <span class="result-name">{{ result.display_name.split(',')[0] }}</span>
            <span class="result-detail">{{ result.display_name.split(',').slice(1, 3).join(',') }}</span>
          </div>
        </li>
      </ul>

      <!-- Estado: buscando -->
      <div v-if="isSearching" class="search-status">
        <span class="spinner"></span> Buscando…
      </div>

      <!-- Sin resultados -->
      <div v-if="noResults" class="search-status no-results">
        Sin resultados. Intenta con otro nombre.
      </div>
    </div>

    <!-- Contenedor del mapa -->
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

      <!-- Botón volver a Fe y Alegría -->
      <button class="home-btn" title="Volver a Fe y Alegría" @click="flyHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Fe y Alegría</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
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
let searchMarker = null

// Coordenadas exactas: Unidad Educativa Fe y Alegría La Dolorosa
// Intersección: Calle Fe y Alegría + Gabriel García Moreno, Llano Grande, Calderón, Quito
const HOME_LAT = -0.1188
const HOME_LNG = -78.4269
const HOME_ZOOM = 17

// Estado de búsqueda
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const noResults = ref(false)
const highlightedIndex = ref(-1)
let searchTimeout = null

const initMap = () => {
  map = L.map('map').setView([HOME_LAT, HOME_LNG], HOME_ZOOM)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  // Marcador de la institución
  const schoolIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background: linear-gradient(135deg,#1e3a8a,#3b82f6); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.4); font-size:16px;">🏫</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
  L.marker([HOME_LAT, HOME_LNG], { icon: schoolIcon })
    .bindPopup('<b>Unidad Educativa Fe y Alegría La Dolorosa</b><br>Av. García Moreno S3-411, Llano Grande<br>Calderón, Quito')
    .addTo(map)

  if (props.allowSelection) {
    map.getContainer().style.cursor = 'crosshair'
    map.on('click', handleMapClick)
  }

  renderMarkers()
}

const handleMapClick = (e) => {
  const { lat, lng } = e.latlng
  if (tempMarker) map.removeLayer(tempMarker)
  tempMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:#3b82f6; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map)
  emit('location-selected', { lat, lng })
}

const renderMarkers = () => {
  if (!map) return
  markers.forEach(m => map.removeLayer(m))
  markers = []

  store.incidents.forEach(incident => {
    const color = incident.severidad === 'HIGH' ? '#ef4444' : '#f97316'
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3); font-size:12px; font-weight:bold;">!</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const marker = L.marker([incident.latitud, incident.longitud], { icon })
      .bindPopup(`<b>${incident.tipo}</b><br>Hora: ${incident.horaAprox}`)
      .addTo(map)

    markers.push(marker)
  })
}

// ── Búsqueda con Nominatim (OpenStreetMap) ──────────────────────────────────
const onSearchInput = () => {
  noResults.value = false
  highlightedIndex.value = -1
  clearTimeout(searchTimeout)

  if (searchQuery.value.trim().length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(doSearch, 450)
}

const doSearch = async () => {
  if (searchQuery.value.trim().length < 3) return
  isSearching.value = true
  searchResults.value = []

  try {
    // Buscar con prioridad en Ecuador / Quito / Llano Grande
    const q = encodeURIComponent(searchQuery.value.trim() + ', Ecuador')
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=6&countrycodes=ec&viewbox=-78.70,-0.40,-78.30,0.10&bounded=0&accept-language=es`

    const res = await fetch(url, {
      headers: { 'Accept-Language': 'es' }
    })
    const data = await res.json()

    if (data.length === 0) {
      noResults.value = true
    } else {
      searchResults.value = data
    }
  } catch (err) {
    console.error('Error buscando ubicación:', err)
    noResults.value = true
  } finally {
    isSearching.value = false
  }
}

const selectResult = (result) => {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)

  // Centrar mapa
  map.flyTo([lat, lng], 17, { animate: true, duration: 1.2 })

  // Marcador azul de búsqueda
  if (searchMarker) map.removeLayer(searchMarker)
  searchMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background:linear-gradient(135deg,#6366f1,#3b82f6); width:26px; height:26px; border-radius:50%; border:3px solid white; box-shadow:0 2px 8px rgba(99,102,241,0.6); display:flex; align-items:center; justify-content:center; font-size:13px;">🔍</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    })
  })
    .bindPopup(`<b>${result.display_name.split(',')[0]}</b><br><small>${result.display_name.split(',').slice(1, 3).join(',')}</small>`)
    .addTo(map)
    .openPopup()

  // Si está en modo selección, emitir coordenadas
  if (props.allowSelection) {
    if (tempMarker) map.removeLayer(tempMarker)
    emit('location-selected', { lat, lng })
  }

  searchQuery.value = result.display_name.split(',')[0]
  searchResults.value = []
  highlightedIndex.value = -1
}

const flyHome = () => {
  map.flyTo([HOME_LAT, HOME_LNG], HOME_ZOOM, { animate: true, duration: 1.5 })
}

const navigateResults = (dir) => {
  if (searchResults.value.length === 0) return
  highlightedIndex.value = Math.max(
    -1,
    Math.min(searchResults.value.length - 1, highlightedIndex.value + dir)
  )
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && searchResults.value[highlightedIndex.value]) {
    selectResult(searchResults.value[highlightedIndex.value])
  }
}

const clearResults = () => {
  searchResults.value = []
  highlightedIndex.value = -1
  noResults.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  clearResults()
  if (searchMarker) {
    map.removeLayer(searchMarker)
    searchMarker = null
  }
}

const onBlur = () => {
  setTimeout(clearResults, 200)
}

onMounted(() => {
  initMap()
})

watch(() => props.allowSelection, (newVal) => {
  if (!map) return
  if (newVal) {
    map.getContainer().style.cursor = 'crosshair'
    map.on('click', handleMapClick)
  } else {
    map.getContainer().style.cursor = ''
    map.off('click', handleMapClick)
    if (tempMarker) map.removeLayer(tempMarker)
  }
})

watch(() => store.incidents, renderMarkers, { deep: true })
</script>

<style scoped>
/* ── Wrapper global ─────────────────────────────────── */
.map-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
}

/* ── Barra de búsqueda ──────────────────────────────── */
.search-bar-container {
  position: relative;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 1001;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.9rem;
  gap: 0.5rem;
}

.search-icon {
  color: #6b7280;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #111827;
  background: transparent;
  font-family: inherit;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 50%;
  transition: color 0.2s, background 0.2s;
}

.clear-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

/* Resultados */
.search-results {
  list-style: none;
  margin: 0;
  padding: 0.3rem 0;
  border-top: 1px solid #f3f4f6;
  max-height: 220px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.search-result-item:hover,
.search-result-item.highlighted {
  background: #f0f4ff;
}

.result-icon {
  font-size: 1rem;
  margin-top: 1px;
  flex-shrink: 0;
}

.result-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.result-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.result-detail {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Estado buscando / sin resultados */
.search-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #6b7280;
  border-top: 1px solid #f3f4f6;
}

.search-status.no-results {
  color: #ef4444;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #d1d5db;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Contenedor del mapa ────────────────────────────── */
.map-container {
  position: relative;
  height: 400px;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Leyenda */
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
  flex-shrink: 0;
}

.dot.critical   { background-color: #ef4444; }
.dot.preventive { background-color: #f97316; }

/* Botón volver a casa */
.home-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: background 0.2s, box-shadow 0.2s;
}

.home-btn:hover {
  background: #eff6ff;
  box-shadow: 0 4px 10px rgba(59,130,246,0.2);
}
</style>
