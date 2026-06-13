import { useFinanzas } from '../context/FinanzasContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

function formatMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(valor);
}

export default function Dashboard() {
  const { transacciones, categorias, totalIngresos, totalGastos, balance, presupuesto } =
    useFinanzas();

  const gastosPorCategoria = categorias
    .filter((c) => c.tipo === 'gasto')
    .map((c) => {
      const total = transacciones
        .filter((t) => t.categoria === c.id && t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);
      return { name: c.nombre, value: total, color: c.color };
    })
    .filter((d) => d.value > 0);

  const ingresosPorCategoria = categorias
    .filter((c) => c.tipo === 'ingreso')
    .map((c) => {
      const total = transacciones
        .filter((t) => t.categoria === c.id && t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);
      return { name: c.nombre, value: total, color: c.color };
    })
    .filter((d) => d.value > 0);

  const ultimasTransacciones = [...transacciones]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  const cards = [
    {
      title: 'Balance',
      value: formatMoneda(balance),
      icon: DollarSign,
      color: balance >= 0 ? 'text-emerald-600' : 'text-red-600',
      bg: balance >= 0 ? 'bg-emerald-50' : 'bg-red-50',
    },
    {
      title: 'Ingresos',
      value: formatMoneda(totalIngresos),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Gastos',
      value: formatMoneda(totalGastos),
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Presupuesto',
      value: formatMoneda(presupuesto),
      icon: PiggyBank,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, icon: Icon, color, bg }) => (
          <div key={title} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Gastos por Categoría</h3>
          {gastosPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gastosPorCategoria}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {gastosPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMoneda(value)} />
              </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-12">Sin gastos registrados</p>
            )}
          </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Ingresos por Categoría</h3>
          {ingresosPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingresosPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => formatMoneda(value)} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {ingresosPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-12">Sin ingresos registrados</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimas Transacciones</h3>
        {ultimasTransacciones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-slate-500 font-medium">Fecha</th>
                  <th className="text-left py-3 text-slate-500 font-medium">Descripción</th>
                  <th className="text-left py-3 text-slate-500 font-medium">Categoría</th>
                  <th className="text-right py-3 text-slate-500 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {ultimasTransacciones.map((t) => {
                  const cat = categorias.find((c) => c.id === t.categoria);
                  return (
                    <tr key={t.id} className="border-b border-slate-100">
                      <td className="py-3 text-slate-600">{t.fecha}</td>
                      <td className="py-3 text-slate-800">{t.descripcion}</td>
                      <td className="py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: cat?.color + '20',
                            color: cat?.color,
                          }}
                        >
                          {cat?.nombre || t.categoria}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          t.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {t.tipo === 'ingreso' ? '+' : '-'}
                        {formatMoneda(t.monto)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No hay transacciones aún</p>
        )}
      </div>
    </div>
  );
}
