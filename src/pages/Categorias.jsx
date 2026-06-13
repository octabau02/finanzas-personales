import { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const FORM_VACIO = { nombre: '', tipo: 'gasto', color: '#ef4444' };

export default function Categorias() {
  const { categorias, transacciones, agregarCategoria, eliminarCategoria, editarCategoria } =
    useFinanzas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [eliminarModal, setEliminarModal] = useState(null);
  const [toast, setToast] = useState(null);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (c) => {
    setEditandoId(c.id);
    setForm({ nombre: c.nombre, tipo: c.tipo, color: c.color });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;

    const datos = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      color: form.color,
    };

    if (editandoId) {
      editarCategoria(editandoId, datos);
      setToast('Categoría actualizada');
    } else {
      agregarCategoria(datos);
      setToast('Categoría agregada');
    }
    cerrarModal();
  };

  const confirmarEliminar = () => {
    if (eliminarModal) {
      eliminarCategoria(eliminarModal.id);
      setToast('Categoría eliminada');
      setEliminarModal(null);
    }
  };

  const tieneTransacciones = (categoriaId) =>
    transacciones.some((t) => t.categoria === categoriaId);

  const gastosCategorias = categorias.filter((c) => c.tipo === 'gasto');
  const ingresosCategorias = categorias.filter((c) => c.tipo === 'ingreso');

  const CategoriaItem = ({ c }) => {
    const bloqueada = tieneTransacciones(c.id);
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
          <span className="text-sm font-medium text-slate-700">{c.nombre}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => abrirEditar(c)}
            className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEliminarModal(c)}
            disabled={bloqueada}
            className={`p-1 transition-colors ${
              bloqueada
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-400 hover:text-red-500'
            }`}
            title={bloqueada ? 'No se puede eliminar: tiene transacciones asociadas' : 'Eliminar'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Categorías</h2>
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
        title={editandoId ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={!!editandoId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-expense" />
            Gastos
          </h3>
          <div className="space-y-2">
            {gastosCategorias.map((c) => (
              <CategoriaItem key={c.id} c={c} />
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
              <CategoriaItem key={c.id} c={c} />
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={!!eliminarModal}
        onClose={() => setEliminarModal(null)}
        title="Eliminar categoría"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">
                ¿Eliminar esta categoría?
              </p>
              {eliminarModal && (
                <p className="text-sm text-red-700 font-medium mt-1">
                  {eliminarModal.nombre} ({eliminarModal.tipo === 'gasto' ? 'Gasto' : 'Ingreso'})
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

      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
