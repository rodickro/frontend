import { Routes, Route, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PrincipalPage from './pages/PrincipalPage.jsx';
import DetailsPage from './pages/DetailsPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
