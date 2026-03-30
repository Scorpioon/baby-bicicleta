import { useRef } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
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

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 2.1750, latitude: 41.3880, zoom: 13 }}
      mapStyle={MAP_STYLE}
      style={{ width: '100%', height: '100%' }}
      padding={{ bottom: sheetHeightPx }}
      onClick={handleMapClick}
    >
      {mockStations.map(st => {
        const isSelected = st.id === selectedStationId;
        return (
          <Marker key={st.id} longitude={st.lng} latitude={st.lat} onClick={(e: any) => handleMarkerClick(e, st.id)}>
            <div style={{
              width: isSelected ? 32 : 24, 
              height: isSelected ? 32 : 24, 
              backgroundColor: isSelected ? 'var(--color-text-main)' : 'var(--color-accent)',
              borderRadius: '50%', 
              border: isSelected ? '4px solid white' : '3px solid white', 
              cursor: 'pointer',
              boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
              transform: isSelected ? 'scale(1.1)' : 'scale(1)'
            }} />
          </Marker>
        );
      })}
    </Map>
  );
};
