import { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Trash2, Search, Pencil, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';

function formatMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(valor);
}

const FORM_VACIO = (categorias) => ({
  descripcion: '',
  monto: '',
  tipo: 'gasto',
  categoria: categorias.filter((c) => c.tipo === 'gasto')[0]?.id || '',
  fecha: new Date().toISOString().split('T')[0],
});

export default function Transacciones() {
  const { transacciones, categorias, agregarTransaccion, eliminarTransaccion, editarTransaccion } =
    useFinanzas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState(FORM_VACIO(categorias));
  const [eliminarModal, setEliminarModal] = useState(null);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(FORM_VACIO(categorias));
    setModalAbierto(true);
  };

  const abrirEditar = (t) => {
    setEditandoId(t.id);
    setForm({
      descripcion: t.descripcion,
      monto: String(t.monto),
      tipo: t.tipo,
      categoria: t.categoria,
      fecha: t.fecha,
    });
    setModalAbierto(true);
  };

  const confirmarEliminar = () => {
    if (eliminarModal) {
      eliminarTransaccion(eliminarModal.id);
      setEliminarModal(null);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.descripcion.trim() || !form.monto || !form.categoria) return;

    const datos = {
      descripcion: form.descripcion.trim(),
      monto: Number(form.monto),
      tipo: form.tipo,
      categoria: form.categoria,
      fecha: form.fecha,
    };

    if (editandoId) {
      editarTransaccion(editandoId, datos);
    } else {
      agregarTransaccion(datos);
    }
    cerrarModal();
  };

  const categoriasFiltradas = categorias.filter((c) => c.tipo === form.tipo);

  const transaccionesFiltradas = [...transacciones]
    .filter((t) => {
      if (!filtro) return true;
      const q = filtro.toLowerCase();
      const cat = categorias.find((c) => c.id === t.categoria);
      return (
        t.descripcion.toLowerCase().includes(q) ||
        cat?.nombre.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Transacciones</h2>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </button>
      </div>

      <Modal
        open={modalAbierto}
        onClose={cerrarModal}
        title={editandoId ? 'Editar Transacción' : 'Nueva Transacción'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Ej: Supermercado"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
              <input
                type="number"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="0"
                min="0"
                step="0.01"
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
                    categoria:
                      categorias.filter((c) => c.tipo === e.target.value)[0]?.id || '',
                  })
                }
                disabled={!!editandoId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              >
                {categoriasFiltradas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              {editandoId ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
          placeholder="Buscar transacciones..."
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {transaccionesFiltradas.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Descripción</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Categoría</th>
                <th className="text-right py-3 px-4 text-slate-500 font-medium">Monto</th>
                <th className="py-3 px-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.map((t) => {
                const cat = categorias.find((c) => c.id === t.categoria);
                return (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">{t.fecha}</td>
                    <td className="py-3 px-4 text-slate-800">{t.descripcion}</td>
                    <td className="py-3 px-4">
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
                      className={`py-3 px-4 text-right font-medium ${
                        t.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {t.tipo === 'ingreso' ? '+' : '-'}
                      {formatMoneda(t.monto)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => abrirEditar(t)}
                          className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEliminarModal(t)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-400 text-center py-12">
            {filtro ? 'Sin resultados' : 'No hay transacciones registradas'}
          </p>
        )}
      </div>

      <Modal
        open={!!eliminarModal}
        onClose={() => setEliminarModal(null)}
        title="Eliminar transacción"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">
                ¿Eliminar esta transacción?
              </p>
              {eliminarModal && (
                <p className="text-sm text-red-700 font-medium mt-1">
                  {eliminarModal.descripcion} · {eliminarModal.tipo === 'ingreso' ? '+' : '-'}{formatMoneda(eliminarModal.monto)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setEliminarModal(null)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEliminar}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
