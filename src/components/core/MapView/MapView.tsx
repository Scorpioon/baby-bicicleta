import { useRef } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const { selectedStationId, selectStation, clearSelection } = useCoreStore();
  const { sheetHeightPx, setSheetState } = useUIStore();

  const handleMarkerClick = (e: any, id: string) => {
    e.originalEvent.stopPropagation();
    selectStation(id);
    setSheetState('SHEET_STATION_VIEW');
  };

  const handleMapClick = () => {
    clearSelection();
    setSheetState('SHEET_CLOSED');
  };

  const getMarkerColor = (st: typeof mockStations[0]) => {
    if (st.status === 'BROKEN') return '#4D4D4D'; // Dark gray
    if (st.mechanicalCount === 0 && st.electricCount === 0) return '#A3A3A3'; // Muted empty gray
    if (st.electricCount > st.mechanicalCount) return '#3B82F6'; // Blue for electric-dominant
    return 'var(--color-accent)'; // Red for mechanical-dominant
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 2.1750, latitude: 41.3880, zoom: 13.5 }}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      padding={{ bottom: sheetHeightPx }}
      onClick={handleMapClick}
    >
      {mockStations.map(st => {
        const isSelected = st.id === selectedStationId;
        const color = getMarkerColor(st);
        
        return (
          <Marker key={st.id} longitude={st.lng} latitude={st.lat} onClick={(e: any) => handleMarkerClick(e, st.id)}>
            <div style={{
              width: 24, 
              height: 24, 
              backgroundColor: color,
              borderRadius: '50%', 
              border: '2px solid white', 
              cursor: 'pointer',
              boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 5px var(--color-text-main)' : '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
              transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold'
            }}>
              {st.status === 'BROKEN' && '!'}
            </div>
          </Marker>
        );
      })}
    </Map>
  );
};
