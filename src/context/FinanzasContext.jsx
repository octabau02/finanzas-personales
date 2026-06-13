import { createContext, useContext, useReducer, useEffect } from 'react';

const FinanzasContext = createContext();

const CATEGORIAS_DEFAULT = [
  { id: 'alimentacion', nombre: 'Alimentación', tipo: 'gasto', color: '#f97316' },
  { id: 'transporte', nombre: 'Transporte', tipo: 'gasto', color: '#3b82f6' },
  { id: 'vivienda', nombre: 'Vivienda', tipo: 'gasto', color: '#8b5cf6' },
  { id: 'entretenimiento', nombre: 'Entretenimiento', tipo: 'gasto', color: '#ec4899' },
  { id: 'salud', nombre: 'Salud', tipo: 'gasto', color: '#14b8a6' },
  { id: 'educacion', nombre: 'Educación', tipo: 'gasto', color: '#eab308' },
  { id: 'servicios', nombre: 'Servicios', tipo: 'gasto', color: '#64748b' },
  { id: 'salario', nombre: 'Salario', tipo: 'ingreso', color: '#22c55e' },
  { id: 'freelance', nombre: 'Freelance', tipo: 'ingreso', color: '#10b981' },
  { id: 'inversiones', nombre: 'Inversiones', tipo: 'ingreso', color: '#06b6d4' },
  { id: 'otro-ingreso', nombre: 'Otro Ingreso', tipo: 'ingreso', color: '#84cc16' },
  { id: 'otro-gasto', nombre: 'Otro Gasto', tipo: 'gasto', color: '#78716c' },
];

function cargarDatos() {
  try {
    const data = localStorage.getItem('finanzas-data');
    if (data) {
      const parsed = JSON.parse(data);
      return {
        transacciones: parsed.transacciones || [],
        categorias: parsed.categorias || CATEGORIAS_DEFAULT,
        presupuesto: parsed.presupuesto || 0,
      };
    }
  } catch {
    // ignorar
  }
  return { transacciones: [], categorias: CATEGORIAS_DEFAULT, presupuesto: 0 };
}

const estadoInicial = cargarDatos();

function finanzasReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_TRANSACCION':
      return { ...state, transacciones: [...state.transacciones, action.payload] };
    case 'ELIMINAR_TRANSACCION':
      return {
        ...state,
        transacciones: state.transacciones.filter((t) => t.id !== action.payload),
      };
    case 'AGREGAR_CATEGORIA':
      return { ...state, categorias: [...state.categorias, action.payload] };
    case 'ELIMINAR_CATEGORIA':
      return {
        ...state,
        categorias: state.categorias.filter((c) => c.id !== action.payload),
      };
    case 'SET_PRESUPUESTO':
      return { ...state, presupuesto: action.payload };
    default:
      return state;
  }
}

export function FinanzasProvider({ children }) {
  const [state, dispatch] = useReducer(finanzasReducer, estadoInicial);

  useEffect(() => {
    localStorage.setItem('finanzas-data', JSON.stringify(state));
  }, [state]);

  const agregarTransaccion = (transaccion) => {
    dispatch({ type: 'AGREGAR_TRANSACCION', payload: { ...transaccion, id: crypto.randomUUID() } });
  };

  const eliminarTransaccion = (id) => {
    dispatch({ type: 'ELIMINAR_TRANSACCION', payload: id });
  };

  const agregarCategoria = (categoria) => {
    dispatch({
      type: 'AGREGAR_CATEGORIA',
      payload: { ...categoria, id: crypto.randomUUID() },
    });
  };

  const eliminarCategoria = (id) => {
    dispatch({ type: 'ELIMINAR_CATEGORIA', payload: id });
  };

  const setPresupuesto = (monto) => {
    dispatch({ type: 'SET_PRESUPUESTO', payload: monto });
  };

  const totalIngresos = state.transacciones
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalGastos = state.transacciones
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balance = totalIngresos - totalGastos;

  return (
    <FinanzasContext.Provider
      value={{
        ...state,
        agregarTransaccion,
        eliminarTransaccion,
        agregarCategoria,
        eliminarCategoria,
        setPresupuesto,
        totalIngresos,
        totalGastos,
        balance,
      }}
    >
      {children}
    </FinanzasContext.Provider>
  );
}

export function useFinanzas() {
  const context = useContext(FinanzasContext);
  if (!context) {
    throw new Error('useFinanzas debe usarse dentro de FinanzasProvider');
  }
  return context;
}
