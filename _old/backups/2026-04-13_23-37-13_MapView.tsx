// CCOS FILE VERSION: v0.2.19n
// CCOS LAST PATCH: nav_cta_clarity
// CCOS CHANGE TYPE: FEATURE
// CCOS FEATURE ID: BEBE_0219n_ID_1001
import { useRef, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { AlertTriangle } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const { selectedStationId, selectStation, clearSelection, userLocation, destinationStationId } = useCoreStore();
    const { sheetHeightPx, setSheetState } = useUIStore();

  useEffect(() => {
    if (destinationStationId && userLocation && mapRef.current) {
      const destSt = mockStations.find(s => s.id === destinationStationId);
      if (destSt) {
        const map = mapRef.current.getMap();
        const bounds = map.getBounds();
        const destPt: [number, number] = [destSt.lng, destSt.lat];
        const usrPt: [number, number] = [userLocation.lng, userLocation.lat];

        // Safe bounds check - only frame if points are outside current view
        if (!bounds.contains(destPt) || !bounds.contains(usrPt)) {
          const minLng = Math.min(userLocation.lng, destSt.lng);
          const maxLng = Math.max(userLocation.lng, destSt.lng);
          const minLat = Math.min(userLocation.lat, destSt.lat);
          const maxLat = Math.max(userLocation.lat, destSt.lat);

          mapRef.current.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: { top: 60, bottom: sheetHeightPx + 60, left: 60, right: 60 }, duration: 800 }
          );
        }
      }
    }
  }, [destinationStationId, userLocation, sheetHeightPx]);

  const handleMarkerClick = (e: any, id: string) => {
    e.originalEvent.stopPropagation();
    selectStation(id);
    setSheetState('SHEET_STATION_VIEW');
  };

  const handleMapClick = () => {
    clearSelection();
    setSheetState('SHEET_CLOSED');
  };

  const getMarkerBgColor = (st: typeof mockStations[0]) => {
    if (st.status === 'BROKEN') return '#FDA4AF'; // Salmon/Pink
    if (st.mechanicalCount === 0 && st.electricCount === 0) return '#A3A3A3'; 
    if (st.electricCount > st.mechanicalCount) return '#3B82F6'; 
    return 'var(--color-accent)'; 
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
            {/* User Location Marker */}
      {userLocation && (
        <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
          <div style={{
            width: 16, height: 16, backgroundColor: '#3B82F6', borderRadius: '50%',
            border: '3px solid white', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 50
          }} />
        </Marker>
      )}
      {mockStations.map(st => {
                const isSelected = st.id === selectedStationId;
        const isDestination = st.id === destinationStationId;
        const isBroken = st.status === 'BROKEN';
        const bgColor = getMarkerBgColor(st);
        const borderColor = isBroken ? '#E11D48' : 'white';
        
        return (
          <Marker key={st.id} longitude={st.lng} latitude={st.lat} onClick={(e: any) => handleMarkerClick(e, st.id)}>
            <div style={{
              width: 24, height: 24, backgroundColor: bgColor, borderRadius: '50%', 
              border: `2px solid ${borderColor}`, cursor: 'pointer',
              boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 5px var(--color-text-main)' : isDestination ? '0 0 0 2px white, 0 0 0 5px #10B981, 0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
              transform: (isSelected || isDestination) ? 'scale(1.15)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isBroken && <AlertTriangle size={14} color="#BE123C" strokeWidth={3} />}
            </div>
          </Marker>
        );
      })}
    </Map>
  );
};

