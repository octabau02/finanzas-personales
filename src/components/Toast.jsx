import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ mensaje, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        {mensaje}
      </div>
    </div>
  );
}
