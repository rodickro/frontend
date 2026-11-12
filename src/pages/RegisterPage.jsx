
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import '../Auth.css';

const API = 'http://localhost:3001/ecommer';

function RegisterPage() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Registrar usuario utilizando el backend de Rodick
  const registrarUsuario = async (e) => {
    e.preventDefault();

    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_rol: 2,
          correo,
          contraseña,
          estado: 'activo',
          fecha_registro: new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || 'No se pudo registrar la cuenta'
        );
      }

      // Registro exitoso: redirigir automáticamente al Login
      navigate('/login', { replace: true });

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
        <h2>Crea tu cuenta</h2>

        <form className="auth-form" onSubmit={registrarUsuario}>

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
              placeholder="Mínimo 8 caracteres"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={cargando}
          >
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>

        </form>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta?</p>
          <Link to="/login">Iniciar sesión</Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
