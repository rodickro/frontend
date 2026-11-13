
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import axios from 'axios';
import '../Detailspage.css';

const API = 'http://localhost:3001/ecommer';

function DetailsPage() {
  const [searchParams] = useSearchParams();
  const id_producto = searchParams.get('id_producto');

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeCarrito, setMensajeCarrito] = useState('');
  const [imagenFallida, setImagenFallida] = useState(false);

  // Obtener los detalles del producto desde el backend
  useEffect(() => {
    if (!id_producto || id_producto === 'undefined') {
      setProducto(null);
      setError('No se seleccionó ningún producto.');
      setCargando(false);
      return;
    }

    const controller = new AbortController();

    const obtenerDetalles = async () => {
      setCargando(true);
      setError('');
      setProducto(null);
      setCantidad(1);
      setMensajeCarrito('');
      setImagenFallida(false);

      try {
        const respuesta = await axios.get(`${API}/details`, {
          params: { id_producto },
          signal: controller.signal
        });

        // El backend devuelve un arreglo de productos
        const datos = respuesta.data;
        const resultado = datos?.producto ?? datos;

        const productoEncontrado = Array.isArray(resultado)
          ? resultado[0]
          : resultado;

        if (!productoEncontrado) {
          throw new Error('Producto no encontrado.');
        }

        setProducto(productoEncontrado);

      } catch (err) {
        if (axios.isCancel(err)) return;

        console.error(
          'Error al obtener detalles:',
          err.response?.data ?? err
        );

        setError(
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

  // Formatear precios a dos decimales
  const formatearPrecio = (valor) => {
    if (valor == null || !Number.isFinite(Number(valor))) {
      return 'Precio por consultar';
    }

    return `S/ ${Number(valor).toFixed(2)}`;
  };

  // Verificar promociones
  const tieneDescuento = Number(producto?.Descuento) === 1;

  const precioMostrar =
    tieneDescuento && producto?.precio_final != null
      ? producto.precio_final
      : producto?.precio;

  // Stock provisional hasta recibir las variantes
  const stock = producto?.stock_disponible ?? producto?.stock;

  // Obtener la URL de la imagen
  const obtenerImagen = (ruta) => {
    if (!ruta) return null;

    if (/^https?:\/\//i.test(ruta)) {
      return ruta;
    }

    return `http://localhost:3001/${ruta.replace(/^\/+/, '')}`;
  };

  const imagen = obtenerImagen(producto?.imagen_url);

  // Controlar la cantidad
  const aumentarCantidad = () => {
    if (stock == null || cantidad < Number(stock)) {
      setCantidad((anterior) => anterior + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad((anterior) => anterior - 1);
    }
  };

  // Carrito provisional solicitado en el ticket
  const agregarAlCarrito = () => {
    if (!producto || !id_producto) {
      setMensajeCarrito('Producto no disponible.');
      return;
    }

    console.log('Producto para carrito:', {
      id_producto: Number(id_producto),
      cantidad
    });

    setMensajeCarrito(
      'Producto seleccionado. Carrito pendiente de conexión.'
    );
  };

  return (
    <>
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

              {stock != null && (
                <span className="details-stock">
                  Stock disponible: {stock}
                </span>
              )}

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
                      stock != null &&
                      cantidad >= Number(stock)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="details-btn-carrito"
                onClick={agregarAlCarrito}
                disabled={
                  stock != null && Number(stock) <= 0
                }
              >
                Agregar al carrito
              </button>

              {mensajeCarrito && (
                <p className="details-mensaje">
                  {mensajeCarrito}
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

export default DetailsPage;
