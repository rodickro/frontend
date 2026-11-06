
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import '../Auth.css';

const API = 'http://localhost:3001/ecommer';

function LoginPage() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Enviar las credenciales al backend
  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contraseña })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al iniciar sesión');
      }

      // Redirigir a la página principal
      navigate('/');

    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor'
          : err.message
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Tienda Online</h1>
        <h2>Bienvenido de nuevo</h2>

        <form className="auth-form" onSubmit={iniciarSesion}>

          <div className="auth-field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              className="auth-input"
              id="correo"
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              className="auth-input"
              id="contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <div className="auth-footer">
          <p>¿Todavía no tienes una cuenta?</p>
          <Link to="/register">Crear cuenta</Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
