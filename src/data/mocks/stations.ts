export const mockStations = [
  { 
    id: 'st_1', name: 'Plaza Catalunya', lat: 41.3870, lng: 2.1700, 
    distanceMinutes: 3, mechanicalCount: 8, electricCount: 4, dockCount: 12,
    confidenceState: 'HIGH', confidenceLabel: 'FIABLE', confidenceCopy: 'Alta probabilidad de encontrar bici. Estación estable.',
    dataFreshnessLabel: 'hace 1 min', issueHint: null, isFavorite: true
  },
  { 
    id: 'st_2', name: 'Arc de Triomf', lat: 41.3915, lng: 2.1805, 
    distanceMinutes: 7, mechanicalCount: 0, electricCount: 1, dockCount: 22,
    confidenceState: 'LOW', confidenceLabel: 'CRÍTICO', confidenceCopy: 'Casi sin bicis. Alto riesgo de viaje en vano.',
    dataFreshnessLabel: 'hace 6 min', issueHint: 'Varios reportes de anclajes rotos hoy.', isFavorite: false
  },
  { 
    id: 'st_3', name: 'Barceloneta', lat: 41.3800, lng: 2.1900, 
    distanceMinutes: 12, mechanicalCount: 15, electricCount: 0, dockCount: 2,
    confidenceState: 'MEDIUM', confidenceLabel: 'PRECAUCIÓN', confidenceCopy: 'Muchas mecánicas, pero casi sin anclajes libres para devolver.',
    dataFreshnessLabel: 'hace 2 min', issueHint: null, isFavorite: false
  }
];
