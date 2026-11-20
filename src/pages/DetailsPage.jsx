
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import axios from 'axios';
import '../Detailspage.css';

const API = 'http://localhost:3001/ecommer';

// Obtener el ID de la variante
const obtenerIdVariante = (variante) =>
  variante.idvariante ?? variante.id_variante;

// Obtener el stock disponible si el backend lo proporciona
const obtenerStock = (variante) => {
  if (!variante) return null;

  const valor =
    variante.stock_disponible ??
    variante.stock ??
    variante.disponible;

  if (valor == null || valor === '') return null;

  const stock = Number(valor);

  return Number.isFinite(stock) && stock >= 0
    ? stock
    : null;
};

// Clasificar el stock sin mostrar la cantidad exacta
const obtenerEstadoStock = (variante) => {
  const stock = obtenerStock(variante);

  if (stock === null) {
    return {
      texto: 'Disponibilidad por confirmar',
      tipo: 'desconocido',
      agotado: false
    };
  }

  if (stock === 0) {
    return {
      texto: 'Stock agotado',
      tipo: 'agotado',
      agotado: true
    };
  }

  if (stock <= 5) {
    return {
      texto: 'Stock limitado',
      tipo: 'limitado',
      agotado: false
    };
  }

  return {
    texto: 'Stock disponible',
    tipo: 'disponible',
    agotado: false
  };
};

function DetailsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id_producto = searchParams.get('id_producto');

  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [idVariante, setIdVariante] = useState('');

  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [agregando, setAgregando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeCarrito, setMensajeCarrito] = useState('');
  const [requiereLogin, setRequiereLogin] = useState(false);
  const [imagenFallida, setImagenFallida] = useState(false);

  // Estado del modal y de la transición al catálogo
  const [mostrarExito, setMostrarExito] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  // Obtener los detalles y variantes del producto
  useEffect(() => {
    if (!id_producto || !/^[1-9]\d*$/.test(id_producto)) {
      setProducto(null);
      setVariantes([]);
      setError('No se seleccionó un producto válido.');
      setCargando(false);
      return;
    }

    const controller = new AbortController();

    const obtenerDetalles = async () => {
      setCargando(true);
      setError('');
      setProducto(null);
      setVariantes([]);
      setIdVariante('');
      setCantidad(1);
      setMensajeCarrito('');
      setRequiereLogin(false);
      setImagenFallida(false);
      setMostrarExito(false);
      setSaliendo(false);

      try {
        const respuesta = await axios.get(`${API}/details`, {
          params: { id_producto },
          signal: controller.signal
        });

        // El backend devuelve { detalles: [], variantes: [] }
        const datos = respuesta.data;
        const detalles = datos?.detalles ?? datos?.producto ?? datos;

        const productoEncontrado = Array.isArray(detalles)
          ? detalles[0]
          : detalles;

        if (!productoEncontrado) {
          throw new Error('Producto no encontrado.');
        }

        if (!controller.signal.aborted) {
          setProducto(productoEncontrado);

          setVariantes(
            Array.isArray(datos?.variantes) ? datos.variantes : []
          );
        }

      } catch (err) {
        if (controller.signal.aborted || axios.isCancel(err)) {
          return;
        }

        console.error('Error al obtener detalles:', err);

        setError(
          err.response?.data?.mensaje ||
          err.response?.data?.message ||
          err.message ||
          'No se pudieron cargar los detalles.'
        );

      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    obtenerDetalles();

    return () => controller.abort();
  }, [id_producto]);

  // Redireccionar suavemente después de agregar al carrito
  useEffect(() => {
    if (!mostrarExito) return;

    // Iniciar la animación de salida
    const temporizadorSalida = setTimeout(() => {
      setSaliendo(true);
    }, 1700);

    // Regresar al catálogo principal
    const temporizadorNavegacion = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2200);

    return () => {
      clearTimeout(temporizadorSalida);
      clearTimeout(temporizadorNavegacion);
    };
  }, [mostrarExito, navigate]);

  // Variante seleccionada
  const varianteSeleccionada = variantes.find(
    (variante) =>
      String(obtenerIdVariante(variante)) === idVariante
  );

  const stock = obtenerStock(varianteSeleccionada);

  // Seleccionar una combinación de talla y color
  const seleccionarVariante = (variante) => {
    setIdVariante(String(obtenerIdVariante(variante)));
    setCantidad(1);
    setMensajeCarrito('');
    setRequiereLogin(false);
  };

  // Formatear precios
  const formatearPrecio = (valor) => {
    if (valor == null || !Number.isFinite(Number(valor))) {
      return 'Precio por consultar';
    }

    return `S/ ${Number(valor).toFixed(2)}`;
  };

  // Promociones
  const tieneDescuento = Number(producto?.Descuento) === 1;

  const precioMostrar =
    tieneDescuento && producto?.precio_final != null
      ? producto.precio_final
      : producto?.precio;

  // Obtener la URL de la imagen
  const obtenerImagen = (ruta) => {
    if (!ruta) return null;

    if (/^https?:\/\//i.test(ruta)) {
      return ruta;
    }

    return `http://localhost:3001/${ruta.replace(/^\/+/, '')}`;
  };

  const imagen = obtenerImagen(producto?.imagen_url);

  // Controlar cantidad
  const aumentarCantidad = () => {
    if (
      varianteSeleccionada &&
      (stock === null || cantidad < stock)
    ) {
      setCantidad((anterior) => anterior + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad((anterior) => anterior - 1);
    }
  };

  // Agregar al carrito utilizando el JWT de Rodick
  const agregarAlCarrito = async () => {
    if (!varianteSeleccionada) {
      setMensajeCarrito('Selecciona una variante.');
      return;
    }

    if (stock !== null && cantidad > stock) {
      setMensajeCarrito('No hay suficiente stock disponible.');
      return;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      setMensajeCarrito(
        'Debes iniciar sesión para agregar productos al carrito.'
      );
      setRequiereLogin(true);
      return;
    }

    const id_variante = Number(
      obtenerIdVariante(varianteSeleccionada)
    );

    if (!Number.isInteger(id_variante) || id_variante <= 0) {
      setMensajeCarrito('La variante seleccionada no es válida.');
      return;
    }

    const datosCarrito = {
      id_variante,
      cantidad
    };

    setAgregando(true);
    setMensajeCarrito('');
    setRequiereLogin(false);

    try {
      const respuesta = await axios.post(
        `${API}/carrito`,
        datosCarrito,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Producto agregado:', datosCarrito);
      console.log('Respuesta del backend:', respuesta.data);

      // Mostrar modal solo cuando el backend confirme el éxito
      setMostrarExito(true);

    } catch (err) {
      console.error(
        'Error al agregar al carrito:',
        err.response?.data ?? err
      );

      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');

        setMensajeCarrito(
          'Tu sesión ha expirado. Inicia sesión nuevamente.'
        );
        setRequiereLogin(true);
      } else {
        setMensajeCarrito(
          err.response?.data?.mensaje ||
          err.response?.data?.message ||
          'No se pudo agregar el producto al carrito.'
        );
      }

    } finally {
      setAgregando(false);
    }
  };

  return (
    <>
      <div
        className={`details-screen ${
          saliendo ? 'details-screen--salida' : ''
        }`}
      >
        <header className="navbar">
          <Link to="/" className="details-logo">
            MiTienda
          </Link>

          <div className="details-navbar-actions">
            <Link to="/login" className="btn-ingresar">
              Ingresar
            </Link>
            <span className="details-cart-icon">🛒</span>
          </div>
        </header>

        <main className="details-page">
          <Link to="/" className="details-volver">
            ← Volver al catálogo
          </Link>

          {cargando && <p>Cargando producto...</p>}

          {error && (
            <p className="details-error">{error}</p>
          )}

          {!cargando && producto && (
            <div className="details-container">

              {/* Imagen del producto */}
              <section className="details-image">
                {imagen && !imagenFallida ? (
                  <img
                    src={imagen}
                    alt={producto.nombre}
                    className="details-product-image"
                    onError={() => setImagenFallida(true)}
                  />
                ) : (
                  <div className="details-image-placeholder">
                    Imagen no disponible
                  </div>
                )}
              </section>

              {/* Información del producto */}
              <section className="details-info">
                <h1>{producto.nombre}</h1>

                <p>
                  <strong>Marca:</strong> {producto.marca}
                </p>

                <p>
                  <strong>Categoría:</strong> {producto.categoria}
                </p>

                <p>
                  <strong>Subcategoría:</strong> {producto.subcategoria}
                </p>

                <p>
                  <strong>Género:</strong> {producto.genero}
                </p>

                {tieneDescuento && (
                  <span className="details-descuento">
                    ¡Producto en oferta!
                  </span>
                )}

                <div className="details-precios">
                  {tieneDescuento && (
                    <span className="details-precio-original">
                      {formatearPrecio(producto.precio)}
                    </span>
                  )}

                  <span className="details-precio">
                    {formatearPrecio(precioMostrar)}
                  </span>
                </div>

                <p className="details-descripcion">
                  {producto.descripcion}
                </p>

                {/* Tarjetas para seleccionar variantes */}
                <div className="details-variantes">
                  <h3>Selecciona una variante</h3>

                  {variantes.length === 0 ? (
                    <p>
                      No hay variantes disponibles para este producto.
                    </p>
                  ) : (
                    <div className="details-variantes-grid">
                      {variantes.map((variante) => {
                        const id = String(
                          obtenerIdVariante(variante)
                        );

                        const seleccionada = idVariante === id;
                        const estado = obtenerEstadoStock(variante);

                        return (
                          <button
                            key={id}
                            type="button"
                            className={`details-variante-card ${
                              seleccionada
                                ? 'details-variante-card--seleccionada'
                                : ''
                            }`}
                            onClick={() => seleccionarVariante(variante)}
                            disabled={estado.agotado}
                            aria-pressed={seleccionada}
                          >
                            <span className="details-variante-cabecera">
                              <strong>{variante.color}</strong>

                              {seleccionada && (
                                <span className="details-variante-check">
                                  ✓
                                </span>
                              )}
                            </span>

                            <span className="details-variante-talla">
                              Talla {variante.talla}
                            </span>

                            <span
                              className={`details-estado-stock details-estado-stock--${estado.tipo}`}
                            >
                              <span
                                className="details-estado-punto"
                                aria-hidden="true"
                              />
                              {estado.texto}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Control de cantidad */}
                <div className="details-cantidad">
                  <label>Cantidad</label>

                  <div className="details-cantidad-control">
                    <button
                      type="button"
                      onClick={disminuirCantidad}
                      disabled={cantidad <= 1}
                    >
                      −
                    </button>

                    <span>{cantidad}</span>

                    <button
                      type="button"
                      onClick={aumentarCantidad}
                      disabled={
                        !varianteSeleccionada ||
                        (stock !== null && cantidad >= stock)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Agregar al carrito */}
                <button
                  type="button"
                  className="details-btn-carrito"
                  onClick={agregarAlCarrito}
                  disabled={
                    !varianteSeleccionada ||
                    agregando ||
                    (stock !== null && stock <= 0)
                  }
                >
                  {agregando
                    ? 'Agregando...'
                    : 'Agregar al carrito'}
                </button>

                {mensajeCarrito && (
                  <p className="details-mensaje" role="alert">
                    {mensajeCarrito}
                  </p>
                )}

                {requiereLogin && (
                  <Link to="/login">
                    Ir a iniciar sesión
                  </Link>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Modal de confirmación */}
      {mostrarExito && (
        <div
          className={`details-modal-overlay ${
            saliendo ? 'details-modal-overlay--salida' : ''
          }`}
        >
          <div
            className="details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-modal-titulo"
          >
            <div className="details-modal-icono">✓</div>

            <h2 id="details-modal-titulo">
              ¡Producto agregado!
            </h2>

            <p>
              Tu producto se agregó correctamente al carrito.
            </p>

            <p className="details-modal-redireccion">
              Volviendo al catálogo...
            </p>

            <button
              type="button"
              className="details-modal-boton"
              onClick={() => navigate('/', { replace: true })}
            >
              Ir al catálogo ahora
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailsPage;
