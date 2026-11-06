
import { Routes, Route, Navigate } from 'react-router';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

function App() {
  return (
    <Routes>
      {/* Página de inicio de sesión */}
      <Route path="/login" element={<LoginPage />} />

      {/* Página de registro */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Temporal: aquí conectaremos la página de Jeanpiere */}
      <Route
        path="/"
        element={
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <h1>Página principal</h1>
            <p>Pendiente de integrar el catálogo.</p>
          </div>
        }
      />

      {/* Si la dirección no existe, regresar al Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
