// BeBe v0.2.16 - Broken Station Inspection (Step 2: Alternatives)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Cog, Zap, ShieldCheck, ShieldAlert, Shield, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';

/**
 * LOCAL-ONLY TYPES
 */
interface LocalBikeStatus {
  id: string;
  type: 'MECHANICAL' | 'ELECTRIC';
  battery?: number;
  trustLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  trustLabel: string;
}

interface LocalForecastRow {
  id: string;
  timeframe: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  copy: string;
}

/**
 * LOCAL MOCK DATA (Bikes)
 */
const getLocalBikes = (stationId: string): LocalBikeStatus[] => {
  const data: Record<string, LocalBikeStatus[]> = {
    'st_1': [
      { id: 'B-102', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'B-992', type: 'MECHANICAL', trustLevel: 'MEDIUM', trustLabel: 'Revisar frenos' },
      { id: 'E-401', type: 'ELECTRIC', battery: 88, trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'E-402', type: 'ELECTRIC', battery: 100, trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'B-993', type: 'MECHANICAL', trustLevel: 'LOW', trustLabel: 'Sill\u00edn roto' },
      { id: 'B-994', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Ok' },
      { id: 'E-405', type: 'ELECTRIC', battery: 45, trustLevel: 'MEDIUM', trustLabel: 'Bater\u00eda media' },
      { id: 'B-110', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'B-111', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'E-410', type: 'ELECTRIC', battery: 92, trustLevel: 'HIGH', trustLabel: 'Ok' },
      { id: 'B-205', type: 'MECHANICAL', trustLevel: 'LOW', trustLabel: 'Pedal da\u00f1ado' },
      { id: 'B-206', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Ok' }
    ],
    'st_2': [
      { id: 'E-112', type: 'ELECTRIC', battery: 12, trustLevel: 'LOW', trustLabel: 'Bater\u00eda baja' }
    ],
    'st_3': [
      { id: 'B-001', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Ok' },
      { id: 'B-005', type: 'MECHANICAL', trustLevel: 'LOW', trustLabel: 'Cadena suelta' },
      { id: 'E-501', type: 'ELECTRIC', battery: 75, trustLevel: 'HIGH', trustLabel: 'Ok' },
      { id: 'B-008', type: 'MECHANICAL', trustLevel: 'MEDIUM', trustLabel: 'Rueda floja' }
    ]
  };
  return data[stationId] || [];
};

/**
 * LOCAL MOCK DATA (Forecast)
 */
const getLocalForecast = (stationId: string): LocalForecastRow[] => {
  const data: Record<string, LocalForecastRow[]> = {
    'st_1': [
      { id: 'f1', timeframe: 'Pr\u00f3ximos 15 min', trend: 'DOWN', copy: 'Alta demanda esperada. Es probable que las bicis se agoten r\u00e1pido.' },
      { id: 'f2', timeframe: 'Pr\u00f3xima hora', trend: 'UP', copy: 'Se estiman algunas devoluciones de usuarios entrantes.' }
    ],
    'st_2': [
      { id: 'f1', timeframe: 'Pr\u00f3ximos 30 min', trend: 'STABLE', copy: 'Baja actividad esperada. La situaci\u00f3n puede mantenerse cr\u00edtica.' }
    ],
    'st_3': [
      { id: 'f1', timeframe: 'Pr\u00f3ximos 15 min', trend: 'UP', copy: 'Tendencia favorable. Devoluciones probables a corto plazo.' },
      { id: 'f2', timeframe: 'Pr\u00f3xima hora', trend: 'STABLE', copy: 'Disponibilidad estimada estable durante la tarde.' }
    ]
  };
  return data[stationId] || [
    { id: 'def', timeframe: 'Corto plazo', trend: 'STABLE', copy: 'Disponibilidad sin cambios bruscos previstos en esta estaci\u00f3n.' }
  ];
};

const BikeRow = ({ bike }: { bike: LocalBikeStatus }) => {
  const getTrustColor = () => {
    switch (bike.trustLevel) {
      case 'HIGH': return 'var(--color-trust-green)';
      case 'MEDIUM': return 'var(--color-trust-yellow)';
      case 'LOW': return 'var(--color-trust-red)';
      default: return 'var(--color-text-muted)';
    }
  };
  
  const TrustIcon = bike.trustLevel === 'HIGH' ? ShieldCheck : (bike.trustLevel === 'MEDIUM' ? Shield : ShieldAlert);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      padding: '10px 0', 
      borderBottom: '1px solid var(--color-border)' 
    }}>
      {bike.type === 'ELECTRIC' ? (
        <Zap size={16} color="#3B82F6" />
      ) : (
        <Cog size={16} color="var(--color-text-muted)" />
      )}
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{bike.id}</span>
          {bike.battery !== undefined && (
            <span style={{ fontSize: 10, fontWeight: 800, color: '#3B82F6' }}>{bike.battery}%</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
          <TrustIcon size={11} color={getTrustColor()} strokeWidth={3} />
          <span style={{ fontSize: 11, fontWeight: 600, color: getTrustColor() }}>{bike.trustLabel}</span>
        </div>
      </div>
    </div>
  );
};

const ForecastRow = ({ row }: { row: LocalForecastRow }) => {
  const Icon = row.trend === 'UP' ? TrendingUp : (row.trend === 'DOWN' ? TrendingDown : Minus);
  const iconColor = row.trend === 'UP' ? 'var(--color-trust-green)' : (row.trend === 'DOWN' ? 'var(--color-trust-yellow)' : 'var(--color-text-muted)');

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ marginTop: 2 }}>
        <Icon size={18} color={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 2 }}>
          {row.timeframe}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
          {row.copy}
        </div>
      </div>
    </div>
  );
};

export const StationInspectionStub = () => {
  const { selectedStationId } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  const [activeTab, setActiveTab] = useState<'bikes' | 'forecast'>('bikes');
  
  const station = mockStations.find(s => s.id === selectedStationId);
  const bikes = selectedStationId ? getLocalBikes(selectedStationId) : [];
  const forecasts = selectedStationId ? getLocalForecast(selectedStationId) : [];

  if (!station) return null;

  const isBroken = station.status === 'BROKEN';

  const formatId = (idStr: string | number) => String(idStr).padStart(4, '0');
  const fallbackStations = station.fallbackStationIds 
    ? station.fallbackStationIds.map(id => mockStations.find(s => s.id === id)).filter(Boolean) 
    : [];

  return (
    <motion.div 
      id="station_inspection_v0_2_16" 
      initial={{ opacity: 0, x: 10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -10 }}
      style={{ paddingBottom: 16 }}
    >
      {/* Hide native scrollbar via inline scoped injection */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header with Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button 
          onClick={() => setSheetState('SHEET_STATION_VIEW')}
          style={{ 
            background: 'var(--color-surface-soft)', 
            border: 'none', 
            borderRadius: '50%', 
            width: 32, 
            height: 32, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{station.name}</h2>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> Actualizado {station.dataFreshnessLabel}
          </div>
        </div>
      </div>

      {/* Station Context Summary */}
      <div style={{ 
        backgroundColor: 'var(--color-surface-soft)', 
        padding: '12px 16px', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: 20 
      }}>
        <span style={{ 
          fontSize: 10, 
          fontWeight: 900, 
          color: 'var(--color-text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          Estado de confianza
        </span>
        <p style={{ fontSize: 13, marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
          {station.confidenceCopy}
        </p>
      </div>

      {/* Shared Content Module v2 */}
      <div style={{ marginBottom: 24 }}>
        {!isBroken ? (
          <>
            {/* Toggle UI for Healthy Stations */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: 'var(--color-surface-soft)', 
              borderRadius: 'var(--radius-md)', 
              padding: 4, 
              marginBottom: 12 
            }}>
              <button
                onClick={() => setActiveTab('bikes')}
                style={{ 
                  flex: 1, 
                  padding: '8px 0', 
                  border: 'none', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: activeTab === 'bikes' ? 'var(--color-surface-base)' : 'transparent', 
                  color: activeTab === 'bikes' ? 'var(--color-text-main)' : 'var(--color-text-muted)', 
                  fontWeight: 700, 
                  fontSize: 13, 
                  cursor: 'pointer', 
                  boxShadow: activeTab === 'bikes' ? 'var(--shadow-card)' : 'none', 
                  transition: 'all 0.2s ease' 
                }}
              >
                Bicis ahora
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                style={{ 
                  flex: 1, 
                  padding: '8px 0', 
                  border: 'none', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: activeTab === 'forecast' ? 'var(--color-surface-base)' : 'transparent', 
                  color: activeTab === 'forecast' ? 'var(--color-text-main)' : 'var(--color-text-muted)', 
                  fontWeight: 700, 
                  fontSize: 13, 
                  cursor: 'pointer', 
                  boxShadow: activeTab === 'forecast' ? 'var(--shadow-card)' : 'none', 
                  transition: 'all 0.2s ease' 
                }}
              >
                {"Previsi\u00f3n"}
              </button>
            </div>

            {/* Content Area for Healthy Stations */}
            {activeTab === 'bikes' ? (
              <div className="no-scrollbar" style={{ 
                maxHeight: '220px', 
                overflowY: 'auto', 
                overscrollBehavior: 'contain', 
                padding: '0 4px',
                borderTop: bikes.length > 0 ? '1px solid var(--color-border)' : 'none',
                borderBottom: bikes.length > 0 ? '1px solid var(--color-border)' : 'none'
              }}>
                {bikes.length > 0 ? (
                  bikes.map(bike => <BikeRow key={bike.id} bike={bike} />)
                ) : (
                  <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    No hay detalles de bicis disponibles.
                  </div>
                )}
              </div>
            ) : (
              <div className="no-scrollbar" style={{ 
                maxHeight: '220px', 
                overflowY: 'auto', 
                overscrollBehavior: 'contain', 
                padding: '0 4px',
                borderTop: forecasts.length > 0 ? '1px solid var(--color-border)' : 'none',
                borderBottom: forecasts.length > 0 ? '1px solid var(--color-border)' : 'none'
              }}>
                {forecasts.length > 0 ? (
                  <>
                    {forecasts.map(row => <ForecastRow key={row.id} row={row} />)}
                    <div style={{ 
                      fontSize: 11, 
                      color: 'var(--color-text-muted)', 
                      textAlign: 'center', 
                      marginTop: 16, 
                      marginBottom: 8,
                      fontStyle: 'italic' 
                    }}>
                      {"* Basado en patrones recientes. Orientativo."}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    {"No hay datos de previsi\u00f3n."}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Broken Station Context Block */}
            <div style={{ 
              padding: '24px 16px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <AlertTriangle size={24} color="var(--color-trust-yellow)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
                {"Estaci\u00f3n no disponible"}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 4 }}>
                {"Se ha detectado una incidencia t\u00e9cnica. Revisi\u00f3n o mantenimiento en curso."}
              </p>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', opacity: 0.8 }}>
                {"Sin hora confirmada de normalizaci\u00f3n"}
              </span>
            </div>

            {/* Alternatives Sub-module */}
            {fallbackStations.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: 12, 
                  fontWeight: 800, 
                  color: 'var(--color-text-muted)', 
                  marginBottom: 12, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.04em' 
                }}>
                  Alternativas operativas cercanas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {fallbackStations.map(alt => {
                    if (!alt) return null;
                    const totalBikes = alt.mechanicalCount + alt.electricCount;
                    return (
                      <div key={alt.id} style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 16px', 
                        backgroundColor: 'var(--color-surface-soft)',
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border)'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-main)' }}>
                            #{formatId(alt.stationNumber)} - {alt.streetName}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            {alt.distanceMinutes} min andando
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                            <span style={{ 
                              fontSize: 16, 
                              fontWeight: 800, 
                              color: totalBikes > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' 
                            }}>
                              {totalBikes}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                              bicis
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button 
          fullWidth 
          variant="secondary" 
          onClick={() => setSheetState('SHEET_INCIDENT_COMPOSER')}
        >
          Reportar problema
        </Button>
      </div>
    </motion.div>
  );
};
