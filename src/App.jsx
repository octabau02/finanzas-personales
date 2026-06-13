import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanzasProvider } from './context/FinanzasContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transacciones from './pages/Transacciones';
import Categorias from './pages/Categorias';
import Presupuesto from './pages/Presupuesto';

export default function App() {
  return (
    <FinanzasProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transacciones" element={<Transacciones />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/presupuesto" element={<Presupuesto />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanzasProvider>
  );
}
