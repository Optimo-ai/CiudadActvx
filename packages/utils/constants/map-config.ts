export const MAP_CONFIG = {
  // Mapbox configuration - will be injected by Vite
  MAPBOX_TOKEN: import.meta.env?.VITE_MAPBOX_TOKEN || (typeof window !== 'undefined' && window.location.hostname.includes('vercel') 
    ? 'pk.eyJ1IjoiYWxleGFuZGVyLW1hdG9zIiwiYSI6ImNtYno0OG5odjFuZjEya3B0bnRlZjVvcjQifQ.Tbw9vFzLJJP2Yharn7njpw'
    : 'pk.eyJ1IjoiYWxleGFuZGVyLW1hdG9zIiwiYSI6ImNtYno0OG5odjFuZjEya3B0bnRlZjVvcjQifQ.Tbw9vFzLJJP2Yharn7njpw'),
  
  // Default map settings
  DEFAULT_CENTER: {
    lng: -69.9312, // Santo Domingo, República Dominicana
    lat: 18.4861
  },
  
  DEFAULT_ZOOM: 13,
  
  // Map style
  MAP_STYLE: 'mapbox://styles/mapbox/streets-v12',
  
  // Incident types with colors for markers
  INCIDENT_COLORS: {
    basura: '#ef4444',     // red
    bache: '#f97316',      // orange  
    alumbrado: '#eab308',  // yellow
    otro: '#6b7280'        // gray
  }
} as const;

export type IncidentType = keyof typeof MAP_CONFIG.INCIDENT_COLORS;
