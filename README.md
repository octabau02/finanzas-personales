# Finanzas Personales

App de finanzas personales para gestionar ingresos, gastos y presupuesto mensual.

## Tecnologías

- React 19 + Vite
- Tailwind CSS v4
- React Router
- Recharts (gráficos)
- Lucide React (íconos)
- Context API + useReducer
- LocalStorage (persistencia)

## Funcionalidades

- **Dashboard**: balance, ingresos/gastos totales, gráfico de torta por categoría, últimas transacciones
- **Transacciones**: CRUD completo con búsqueda, modal para crear y editar
- **Categorías**: 12 categorías predefinidas, crear/editar con color personalizado, bloqueo de eliminación si tiene transacciones
- **Presupuesto**: monto mensual, barra de progreso, alerta si se excede, gráfico por categoría
- **Modales de confirmación** para eliminación y reset de datos
- **Toast** con feedback visual en cada operación

## Instalación

```bash
git clone https://github.com/octabau02/finanzas-personales.git
cd finanzas-personales
npm install
npm run dev
```

## Scripts

| Comando          | Descripción                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Dev server en `localhost:5173` |
| `npm run build`  | Build de producción            |
| `npm run preview`| Preview del build              |
