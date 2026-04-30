// CCOS FILE VERSION: v0.2.24a
// CCOS LAST PATCH: walk_local_street_graph
// CCOS CHANGE TYPE: FEATURE
// CCOS FEATURE ID: BEBE_0224a_ID_1001
import { useRef, useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { AlertTriangle } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';

// Tiny local street-graph shell for route realism MVP
const MOCK_GRAPH: Record<string, { lat: number, lng: number, edges: string[] }> = {
  'n_cat': { lat: 41.3870, lng: 2.1700, edges: ['n_gracia', 'n_laietana', 'n_triomf'] },
  'n_gracia': { lat: 41.3930, lng: 2.1640, edges: ['n_cat', 'n_diag'] },
  'n_triomf': { lat: 41.3915, lng: 2.1805, edges: ['n_cat', 'n_marina', 'n_laietana'] },
  'n_marina': { lat: 41.3965, lng: 2.1865, edges: ['n_triomf', 'n_sagrada'] },
  'n_sagrada': { lat: 41.4036, lng: 2.1744, edges: ['n_marina', 'n_diag'] },
  'n_barceloneta': { lat: 41.3784, lng: 2.1925, edges: ['n_laietana'] },
  'n_laietana': { lat: 41.3810, lng: 2.1760, edges: ['n_cat', 'n_triomf', 'n_barceloneta'] },
  'n_diag': { lat: 41.3980, lng: 2.1700, edges: ['n_gracia', 'n_sagrada'] }
};

const getClosestNode = (lng: number, lat: number): string | null => {
  let closest: string | null = null;
  let minDist = Infinity;
  for (const [id, node] of Object.entries(MOCK_GRAPH)) {
    const d = Math.pow(node.lng - lng, 2) + Math.pow(node.lat - lat, 2);
    if (d < minDist) { minDist = d; closest = id; }
  }
  return closest;
};

// Street-aware deterministic routing with fallback
const generateStreetRoute = (startLng: number, startLat: number, endLng: number, endLat: number): number[][] => {
  const dLng = endLng - startLng;
  const dLat = endLat - startLat;
  const directDist = Math.sqrt(dLng * dLng + dLat * dLat);

  // 1. Direct path for very short distances
  if (directDist < 0.003) {
    return [[startLng, startLat], [endLng, endLat]];
  }

  // 2. Try graph resolution via BFS
  const startNode = getClosestNode(startLng, startLat);
  const endNode = getClosestNode(endLng, endLat);

  if (startNode && endNode && startNode !== endNode) {
    const queue: { id: string, path: string[] }[] = [{ id: startNode, path: [startNode] }];
    const visited = new Set<string>([startNode]);
    let foundPath: string[] | null = null;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.id === endNode) {
        foundPath = curr.path;
        break;
      }
      for (const edge of MOCK_GRAPH[curr.id].edges) {
        if (!visited.has(edge)) {
          visited.add(edge);
          queue.push({ id: edge, path: [...curr.path, edge] });
        }
      }
    }

    if (foundPath) {
      return [
        [startLng, startLat], // Origin connector
        ...foundPath.map(id => [MOCK_GRAPH[id].lng, MOCK_GRAPH[id].lat]), // Street graph path
        [endLng, endLat] // Destination connector
      ];
    }
  }

  // 3. Fallback: 3-point soft dogleg if graph is disconnected or missing
  const midLng = startLng + dLng * 0.7;
  const midLat = startLat + dLat * 0.3;
  return [[startLng, startLat], [midLng, midLat], [endLng, endLat]];
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const { selectedStationId, selectStation, clearSelection, userLocation, destinationStationId, setUserLocation } = useCoreStore();
  const [isDraggingUser, setIsDraggingUser] = useState(false);
  const isDev = import.meta.env.DEV;

  const destStation = destinationStationId ? mockStations.find(s => s.id === destinationStationId) : null;
  const pathData: any = (userLocation && destStation) ? {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: generateStreetRoute(userLocation.lng, userLocation.lat, destStation.lng, destStation.lat)
    }
  } : null;
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
        <Marker 
          longitude={userLocation.lng} 
          latitude={userLocation.lat}
          draggable={isDev}
          onDragStart={() => setIsDraggingUser(true)}
          onDragEnd={(e: any) => {
            setIsDraggingUser(false);
            setUserLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
          }}
        >
          <div style={{
            width: 16, height: 16, 
            backgroundColor: isDraggingUser ? '#F59E0B' : '#3B82F6', 
            borderRadius: '50%',
            border: '3px solid white', 
            boxShadow: isDraggingUser 
              ? '0 0 0 4px rgba(245, 158, 11, 0.3), 0 4px 8px rgba(0,0,0,0.2)' 
              : '0 0 0 2px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 50,
            cursor: isDev ? (isDraggingUser ? 'grabbing' : 'grab') : 'default',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease'
          }} />
        </Marker>
      )}
            {/* Visual Desire Line (Walking intent) */}
      {pathData && (
        <Source id="walking-path-source" type="geojson" data={pathData}>
          <Layer
            id="walking-path-layer"
            type="line"
            paint={{
              'line-color': '#10B981',
              'line-width': 4,
              'line-dasharray': [2, 2],
              'line-opacity': 0.5
            }}
          />
        </Source>
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

