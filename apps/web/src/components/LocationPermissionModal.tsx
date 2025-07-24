import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, AlertCircle } from 'lucide-react';
import { Button } from '@ciudad-activa/maps/components/ui/button';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestLocation: () => void;
  error?: string | null;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onRequestLocation,
  error
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Ubicación requerida</h2>
                  <p className="text-blue-100 text-sm">Para una mejor experiencia</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Error de ubicación</h3>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      ¿Permitir acceso a tu ubicación?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Ciudad Activa necesita acceso a tu ubicación para:
                    </p>
                  </div>

                  <div className="text-left space-y-2 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Centrar el mapa en tu área</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Reportar incidencias cercanas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Mostrar tu posición actual</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {error ? 'Cerrar' : 'Ahora no'}
                </Button>
                <Button
                  onClick={onRequestLocation}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {error ? 'Reintentar' : 'Permitir ubicación'}
                </Button>
              </div>

              {!error && (
                <p className="text-xs text-gray-500 text-center">
                  Tu ubicación se mantiene privada y segura
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};