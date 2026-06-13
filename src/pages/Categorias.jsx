import { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function Categorias() {
  const { categorias, agregarCategoria, eliminarCategoria } = useFinanzas();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', tipo: 'gasto', color: '#ef4444' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    agregarCategoria({
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      color: form.color,
    });
    setForm({ nombre: '', tipo: 'gasto', color: '#ef4444' });
    setMostrarForm(false);
  };

  const gastosCategorias = categorias.filter((c) => c.tipo === 'gasto');
  const ingresosCategorias = categorias.filter((c) => c.tipo === 'ingreso');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Categorías</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-semibold text-slate-800">Nueva Categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Ej: Ropa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipo: e.target.value,
                    color: e.target.value === 'gasto' ? '#ef4444' : '#22c55e',
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-expense" />
            Gastos
          </h3>
          <div className="space-y-2">
            {gastosCategorias.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">{c.nombre}</span>
                </div>
                <button
                  onClick={() => eliminarCategoria(c.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-income" />
            Ingresos
          </h3>
          <div className="space-y-2">
            {ingresosCategorias.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">{c.nombre}</span>
                </div>
                <button
                  onClick={() => eliminarCategoria(c.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
