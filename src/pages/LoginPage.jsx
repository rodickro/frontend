
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import '../Auth.css';

const API = 'http://localhost:3001/ecommer';

function LoginPage() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Iniciar sesión utilizando el backend de Rodick
  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError('');
    setCargando(true);

    // Credenciales del cliente
    const datosLogin = {
      correo: correo.trim(),
      contraseña
    };

    try {
      // Enviar las credenciales mediante Axios
      const respuesta = await axios.post(
        `${API}/login`,
        datosLogin,
        { withCredentials: true }
      );

      console.log('Inicio de sesión:', respuesta.data.mensaje);

      // Redirigir al catálogo si el backend confirma el login
      navigate('/', { replace: true });

    } catch (err) {
      console.error(
        'Error al iniciar sesión:',
        err.response?.data ?? err
      );

      if (err.response) {
        // Mostrar el mensaje enviado por el backend
        setError(
          err.response.data?.mensaje ||
          err.response.data?.error ||
          'No se pudo iniciar sesión.'
        );
      } else {
        setError('No se pudo conectar con el servidor.');
      }

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
              autoComplete="email"
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
              autoComplete="current-password"
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
