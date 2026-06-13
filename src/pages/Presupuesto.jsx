import { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { PiggyBank, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

function formatMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(valor);
}

export default function Presupuesto() {
  const { presupuesto, setPresupuesto, totalGastos, categorias, transacciones } = useFinanzas();
  const [editando, setEditando] = useState(false);
  const [monto, setMonto] = useState(presupuesto || '');

  const handleGuardar = (e) => {
    e.preventDefault();
    setPresupuesto(Number(monto) || 0);
    setEditando(false);
  };

  const gastosPorCategoria = categorias
    .filter((c) => c.tipo === 'gasto')
    .map((c) => {
      const total = transacciones
        .filter((t) => t.categoria === c.id && t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);
      const porcentaje = presupuesto > 0 ? (total / presupuesto) * 100 : 0;
      return {
        name: c.nombre,
        gasto: total,
        porcentaje: Math.min(porcentaje, 100),
        color: c.color,
      };
    })
    .sort((a, b) => b.gasto - a.gasto);

  const porcentajeUsado = presupuesto > 0 ? (totalGastos / presupuesto) * 100 : 0;
  const excedido = porcentajeUsado > 100;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Presupuesto Mensual</h2>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">Presupuesto total</p>
            {editando ? (
              <form onSubmit={handleGuardar} className="flex items-center gap-3 mt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-lg font-bold w-48 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="0"
                    min="0"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false);
                    setMonto(presupuesto || '');
                  }}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-bold text-primary-700">
                  {formatMoneda(presupuesto)}
                </p>
                <button
                  onClick={() => {
                    setMonto(presupuesto || '');
                    setEditando(true);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
          <div className="p-4 bg-primary-50 rounded-xl">
            <PiggyBank className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">
              Gastado: {formatMoneda(totalGastos)}
            </span>
            <span className={excedido ? 'text-red-600 font-medium' : 'text-slate-600'}>
              {porcentajeUsado.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                excedido ? 'bg-red-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(porcentajeUsado, 100)}%` }}
            />
          </div>
        </div>

        {excedido && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Excediste tu presupuesto por {formatMoneda(totalGastos - presupuesto)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Gastos vs Presupuesto</h3>
        {gastosPorCategoria.length > 0 && presupuesto > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={gastosPorCategoria}
              layout="vertical"
              margin={{ left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'gasto' ? formatMoneda(value) : `${value.toFixed(1)}%`
                }
              />
              <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]}>
                {gastosPorCategoria.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.porcentaje > 50 ? '#ef4444' : entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-center py-12">
            {presupuesto === 0
              ? 'Definí un presupuesto para ver el análisis'
              : 'Sin gastos registrados'}
          </p>
        )}
      </div>
    </div>
  );
}
