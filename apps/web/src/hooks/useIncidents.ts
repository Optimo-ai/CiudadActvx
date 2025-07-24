import { useState, useEffect } from 'react';
import { IncidentReport, CreateIncidentData, IncidentStatus, IncidentPriority, IncidentCategory } from '@ciudad-activa/types';

// Usar una clave única que incluya el dominio para evitar conflictos
const STORAGE_KEY = `ciudad-activa-incidents-${window.location.hostname}`;

// Función para sincronizar con servidor (simulada para demo)
const syncWithServer = async (incidents: IncidentReport[]) => {
  try {
    // En producción, aquí harías una llamada a tu API
    // await fetch('/api/incidents', { method: 'POST', body: JSON.stringify(incidents) });
    console.log('Sincronizando incidencias con servidor...', incidents.length);
  } catch (error) {
    console.error('Error al sincronizar con servidor:', error);
  }
};

// Función para cargar desde servidor (simulada para demo)
const loadFromServer = async (): Promise<IncidentReport[] | null> => {
  try {
    // En producción, aquí harías una llamada a tu API
    // const response = await fetch('/api/incidents');
    // return await response.json();
    return null; // Por ahora retornamos null para usar localStorage
  } catch (error) {
    console.error('Error al cargar desde servidor:', error);
    return null;
  }
};

// Datos de ejemplo
const EXAMPLE_INCIDENTS: IncidentReport[] = [
  {
    id: '1',
    type: {
      id: 'waste-garbage',
      name: 'Basura acumulada',
      icon: 'Trash2',
      color: '#ef4444',
      category: IncidentCategory.WASTE,
      description: 'Acumulación de basura en espacios públicos'
    },
    title: 'Basura acumulada en parque central',
    description: 'Gran cantidad de desechos en la entrada del parque',
    coordinates: { lat: 6.2476, lng: -75.5658 },
    address: 'Parque Central, Medellín',
    status: IncidentStatus.PENDING,
    priority: IncidentPriority.HIGH,
    reportedBy: 'Usuario Demo',
    reportedAt: new Date('2024-06-15T10:30:00'),
    updatedAt: new Date('2024-06-15T10:30:00')
  },
  {
    id: '2',
    type: {
      id: 'infrastructure-pothole',
      name: 'Bache en la vía',
      icon: 'Construction',
      color: '#f59e0b',
      category: IncidentCategory.INFRASTRUCTURE,
      description: 'Deterioro en la calzada'
    },
    title: 'Bache grande en Carrera 70',
    description: 'Bache profundo que puede dañar vehículos',
    coordinates: { lat: 6.2518, lng: -75.5636 },
    address: 'Carrera 70 con Calle 50',
    status: IncidentStatus.IN_PROGRESS,
    priority: IncidentPriority.MEDIUM,
    reportedBy: 'Ciudadano Activo',
    reportedAt: new Date('2024-06-14T15:45:00'),
    updatedAt: new Date('2024-06-16T09:20:00')
  },
  {
    id: '3',
    type: {
      id: 'infrastructure-lighting',
      name: 'Iluminación pública',
      icon: 'Lightbulb',
      color: '#fbbf24',
      category: IncidentCategory.INFRASTRUCTURE,
      description: 'Falla en el alumbrado'
    },
    title: 'Poste de luz fundido',
    coordinates: { lat: 6.2442, lng: -75.5742 },
    address: 'Calle 48 con Carrera 65',
    status: IncidentStatus.RESOLVED,
    priority: IncidentPriority.LOW,
    reportedBy: 'Vecino Preocupado',
    reportedAt: new Date('2024-06-10T20:15:00'),
    updatedAt: new Date('2024-06-17T14:30:00')
  }
];

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar incidencias del localStorage
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        // Intentar cargar desde servidor primero
        const serverIncidents = await loadFromServer();
        
        if (serverIncidents) {
          const processedIncidents = serverIncidents.map((incident: any) => ({
            ...incident,
            reportedAt: new Date(incident.reportedAt),
            updatedAt: new Date(incident.updatedAt),
            estimatedResolution: incident.estimatedResolution 
              ? new Date(incident.estimatedResolution) 
              : undefined
          }));
          setIncidents(processedIncidents);
          // Guardar en localStorage como backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(processedIncidents));
        } else {
          // Cargar desde localStorage si no hay datos del servidor
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const processedIncidents = parsed.map((incident: any) => ({
              ...incident,
              reportedAt: new Date(incident.reportedAt),
              updatedAt: new Date(incident.updatedAt),
              estimatedResolution: incident.estimatedResolution 
                ? new Date(incident.estimatedResolution) 
                : undefined
            }));
            setIncidents(processedIncidents);
          } else {
            // Si no hay datos, usar ejemplos y guardarlos
            setIncidents(EXAMPLE_INCIDENTS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLE_INCIDENTS));
          }
        }
      } catch (error) {
        console.error('Error loading incidents:', error);
        // Fallback a datos de ejemplo
        setIncidents(EXAMPLE_INCIDENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLE_INCIDENTS));
      }
      setLoading(false);
    };

    loadIncidents();
  }, []);

  // Sincronizar con servidor cuando cambien las incidencias
  useEffect(() => {
    if (incidents.length > 0 && !loading) {
      // Debounce para evitar muchas llamadas
      const timeoutId = setTimeout(() => {
        syncWithServer(incidents);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [incidents, loading]);

  // Guardar en localStorage cuando cambien las incidencias (backup local)
  const saveIncidents = (newIncidents: IncidentReport[]) => {
    setIncidents(newIncidents);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIncidents));
    } catch (error) {
      console.error('Error saving incidents to localStorage:', error);
    }
  };

  const createIncident = (data: CreateIncidentData): IncidentReport => {
    const newIncident: IncidentReport = {
      id: Date.now().toString(),
      type: EXAMPLE_INCIDENTS[0].type, // Temporalmente usar el primer tipo
      title: data.title,
      description: data.description,
      coordinates: data.coordinates,
      status: IncidentStatus.PENDING,
      priority: data.priority || IncidentPriority.MEDIUM,
      photos: data.photos,
      reportedBy: 'Usuario Actual',
      reportedAt: new Date(),
      updatedAt: new Date()
    };

    const updatedIncidents = [...incidents, newIncident];
    saveIncidents(updatedIncidents);
    
    return newIncident;
  };

  const updateIncident = (id: string, updates: Partial<IncidentReport>) => {
    const updatedIncidents = incidents.map(incident =>
      incident.id === id
        ? { ...incident, ...updates, updatedAt: new Date() }
        : incident
    );
    saveIncidents(updatedIncidents);
  };

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter(incident => incident.id !== id);
    saveIncidents(updatedIncidents);
  };

  const getIncidentsByStatus = (status: IncidentStatus) => {
    return incidents.filter(incident => incident.status === status);
  };

  const getIncidentsByPriority = (priority: IncidentPriority) => {
    return incidents.filter(incident => incident.priority === priority);
  };

  return {
    incidents,
    loading,
    createIncident,
    updateIncident,
    deleteIncident,
    getIncidentsByStatus,
    getIncidentsByPriority
  };
};
