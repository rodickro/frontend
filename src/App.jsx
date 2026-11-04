
import { useState, useEffect } from 'react';

const API = 'http://localhost:3001/ecommer';

function App() {
  const [modo, setModo] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    correo: '',
    contraseña: ''
  });

  // Comprobar si existe una sesión activa
  useEffect(() => {
    async function comprobarSesion() {
      try {
        const respuesta = await fetch(`${API}/session`, {
          credentials: 'include'
        });

        if (!respuesta.ok) {
          throw new Error('No se pudo consultar la sesión');
        }

        const datos = await respuesta.json();

        if (datos.autenticado) {
          setUsuario(datos.usuario);
        }
      } catch (err) {
        console.error('Error al consultar la sesión:', err);
      } finally {
        setVerificando(false);
      }
    }

    comprobarSesion();
  }, []);

  // Actualizar los campos del formulario
  const cambiarCampo = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Registrar usuario o iniciar sesión
  const enviarFormulario = async (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/${modo}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: form.correo,
          contraseña: form.contraseña
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo completar la operación'
        );
      }

      if (modo === 'login') {
        setUsuario(datos.usuario);
        setForm({
          correo: '',
          contraseña: ''
        });
      } else {
        setMensaje('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        setModo('login');
        setForm({
          correo: form.correo,
          contraseña: ''
        });
      }

    } catch (err) {
      if (err instanceof TypeError) {
        setError('No se pudo conectar con el servidor. Verifica que esté encendido.');
      } else {
        setError(err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    setMensaje('');
    setError('');

    try {
      const respuesta = await fetch(`${API}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo cerrar la sesión');
      }

      setUsuario(null);
      setModo('login');
      setForm({
        correo: '',
        contraseña: ''
      });
      setMensaje('Sesión cerrada correctamente.');

    } catch (err) {
      if (err instanceof TypeError) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError(err.message);
      }
    }
  };

  // Cambiar entre Login y Register
  const cambiarModo = () => {
    setModo(modo === 'login' ? 'register' : 'login');

    setForm({
      correo: '',
      contraseña: ''
    });

    setMensaje('');
    setError('');
  };

  const estiloInput = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#222'
  };

  const estiloBoton = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '8px'
  };

  return (
    <div style={{
      width: '350px',
      maxWidth: '90vw',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      color: '#222',
      borderRadius: '12px',
      boxShadow: '0 4px 20px #0002'
    }}>
      <h1 style={{ textAlign: 'center', color: '#222' }}>
        Tienda Online
      </h1>

      {verificando ? (
        <p>Comprobando sesión...</p>
      ) : usuario ? (
        <>
          <h2 style={{ color: '#222', textAlign: 'center' }}>
  ¡Bienvenido!
</h2>

          <p>Has iniciado sesión con el correo:</p>

          <p>
            <strong>{usuario.correo}</strong>
          </p>

          <button
            style={estiloBoton}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', color: '#222' }}>
            {modo === 'login'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
          </h2>

          <form onSubmit={enviarFormulario}>
            <input
              style={estiloInput}
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={cambiarCampo}
              required
            />

            <input
              style={estiloInput}
              name="contraseña"
              type="password"
              placeholder="Contraseña"
              minLength={modo === 'register' ? 8 : undefined}
              value={form.contraseña}
              onChange={cambiarCampo}
              required
            />

            <button
              style={estiloBoton}
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? 'Procesando...'
                : modo === 'login'
                  ? 'Iniciar sesión'
                  : 'Registrarse'}
            </button>
          </form>

          <p style={{ textAlign: 'center' }}>
            {modo === 'login'
              ? '¿Todavía no tienes una cuenta?'
              : '¿Ya tienes una cuenta?'}
          </p>

          <button
            onClick={cambiarModo}
            style={estiloBoton}
          >
            {modo === 'login'
              ? 'Crear cuenta'
              : 'Volver al inicio de sesión'}
          </button>
        </>
      )}

      {mensaje && (
        <p style={{ color: 'green' }}>
          {mensaje}
        </p>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default App;
