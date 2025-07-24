import { useState, useEffect } from 'react';
import { Coordinates } from '@ciudad-activa/types';

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  accuracy: number | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
    accuracy: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'La geolocalización no está soportada en este navegador'
      }));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        loading: false,
        error: null,
        accuracy: position.coords.accuracy
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Error desconocido al obtener la ubicación';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado al obtener la ubicación.';
          break;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    };

    // Obtener ubicación actual
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Opcional: Seguir cambios de ubicación
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          loading: false,
          error: null,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'No se pudo obtener la ubicación'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return {
    ...state,
    requestLocation
  };
};