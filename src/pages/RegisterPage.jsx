
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import '../Auth.css';

const API = 'http://localhost:3001/ecommer';

function RegisterPage() {
  const navigate = useNavigate();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Registrar cliente utilizando el backend
  const registrarCliente = async (e) => {
    e.preventDefault();

    setError('');
    setCargando(true);

    // Datos solicitados por el endpoint de registro
    const datosRegistro = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      contraseña
    };

    try {
      await axios.post(`${API}/register`, datosRegistro);

      // Registro exitoso: redirigir al Login
      navigate('/login', { replace: true });

    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.mensaje ||
          err.response.data?.error ||
          err.response.data?.message ||
          'No se pudo registrar la cuenta.'
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
        <h2>Crea tu cuenta</h2>

        <form className="auth-form" onSubmit={registrarCliente}>

          <div className="auth-field">
            <label htmlFor="nombres">Nombres</label>
            <input
              className="auth-input"
              id="nombres"
              type="text"
              placeholder="Ingresa tus nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              maxLength={100}
              autoComplete="given-name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              className="auth-input"
              id="apellidos"
              type="text"
              placeholder="Ingresa tus apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              maxLength={100}
              autoComplete="family-name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="dni">DNI</label>
            <input
              className="auth-input"
              id="dni"
              type="text"
              inputMode="numeric"
              placeholder="Ingresa tu DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              pattern="[0-9]{8}"
              maxLength={8}
              title="El DNI debe tener 8 dígitos"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              className="auth-input"
              id="telefono"
              type="tel"
              placeholder="Ingresa tu teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              maxLength={20}
              autoComplete="tel"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              className="auth-input"
              id="correo"
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              maxLength={150}
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
              placeholder="Mínimo 8 caracteres"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              minLength={8}
              autoComplete="new-password"
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
