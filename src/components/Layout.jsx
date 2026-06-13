import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Tags, PiggyBank, RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transacciones', icon: ArrowLeftRight, label: 'Transacciones' },
  { to: '/categorias', icon: Tags, label: 'Categorías' },
  { to: '/presupuesto', icon: PiggyBank, label: 'Presupuesto' },
];

export default function Layout() {
  const [modalReset, setModalReset] = useState(false);

  const resetearDatos = () => {
    localStorage.removeItem('finanzas-data');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-primary-700 flex items-center gap-2">
            <PiggyBank className="w-6 h-6" />
            Finanzas
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center space-y-1">
          <p>Finanzas Personales v1.0</p>
          <button
            onClick={() => setModalReset(true)}
            className="text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      <Modal
        open={modalReset}
        onClose={() => setModalReset(false)}
        title="Resetear datos"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Esta acción eliminará todas tus transacciones y categorías personalizadas. Los datos volverán a su estado de fábrica. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setModalReset(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={resetearDatos}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Resetear todo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
