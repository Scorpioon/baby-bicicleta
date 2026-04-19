export const mockStations = [
  { 
    id: 'st_1', name: 'Passeig de Lluís Companys', stationNumber: '394', streetName: 'Passeig de Lluís Companys', lat: 41.3915, lng: 2.1805, 
    distanceMinutes: 2, mechanicalCount: 8, electricCount: 1, dockCount: 12,
    confidenceState: 'HIGH', confidenceLabel: 'FIABLE', confidenceCopy: 'Alta probabilidad de encontrar bici. Estación estable.',
    dataFreshnessLabel: 'hace 1 min', issueHint: null, isFavorite: true, status: 'OPERATIONAL', fallbackStationIds: []
  },
  { 
    id: 'st_2', name: 'Plaza de Catalunya', stationNumber: '67', streetName: 'Plaza de Catalunya', lat: 41.3870, lng: 2.1700, 
    distanceMinutes: 5, mechanicalCount: 2, electricCount: 14, dockCount: 2,
    confidenceState: 'MEDIUM', confidenceLabel: 'PRECAUCIÓN', confidenceCopy: 'Pocos anclajes libres. Posible dificultad para devolver.',
    dataFreshnessLabel: 'hace 2 min', issueHint: null, isFavorite: false, status: 'OPERATIONAL', fallbackStationIds: []
  },
  { 
    id: 'st_3', name: 'Passeig de Gràcia', stationNumber: '412', streetName: 'Passeig de Gràcia', lat: 41.3930, lng: 2.1640, 
    distanceMinutes: 7, mechanicalCount: 0, electricCount: 0, dockCount: 22,
    confidenceState: 'LOW', confidenceLabel: 'CRÍTICO', confidenceCopy: 'Estación completamente vacía.',
    dataFreshnessLabel: 'hace 6 min', issueHint: null, isFavorite: false, status: 'OPERATIONAL', fallbackStationIds: []
  },
  { 
    id: 'st_4', name: 'Carrer de la Marina', stationNumber: '12', streetName: 'Carrer de la Marina', lat: 41.3965, lng: 2.1865, 
    distanceMinutes: 4, mechanicalCount: 0, electricCount: 0, dockCount: 0,
    confidenceState: 'LOW', confidenceLabel: 'INOPERATIVA', confidenceCopy: 'Estación fuera de servicio temporalmente.',
    dataFreshnessLabel: 'hace 12 min', issueHint: 'Mantenimiento programado.', isFavorite: false, status: 'BROKEN', fallbackStationIds: ['st_1', 'st_2']
  }
];
