
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import '../Detailspage.css';
function DetailsPage() {
  const [searchParams] = useSearchParams();
  const id_producto = searchParams.get('id_producto');

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeCarrito, setMensajeCarrito] = useState('');

  useEffect(() => {
    if (!id_producto) {
      setError('No se seleccionó ningún producto.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');
    setProducto(null);
    setCantidad(1);

    fetch(`http://localhost:3001/ecommer/details?id_producto=${id_producto}`)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el producto.');
        }
        return respuesta.json();
      })
      .then((datos) => {
        const resultado = datos.producto ?? datos;
        setProducto(Array.isArray(resultado) ? resultado[0] : resultado);
      })
      .catch(() => {
        setError('El servicio de detalles aún no está disponible.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id_producto]);

  const tieneDescuento = Number(producto?.Descuento) === 1;

  const precioMostrar =
    tieneDescuento && producto?.precio_final != null
      ? producto.precio_final
      : producto?.precio;

  const stock = producto?.stock ?? producto?.stock_disponible;

  const aumentarCantidad = () => {
    if (stock == null || cantidad < Number(stock)) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    if (!producto || !id_producto) {
      setMensajeCarrito('El producto todavía no está disponible.');
      return;
    }

    // Aquí conectaremos el carrito cuando exista su endpoint.
    console.log('Producto para carrito:', {
      id_producto,
      cantidad
    });

    setMensajeCarrito(
      'Producto seleccionado. Falta conectar el servicio del carrito.'
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
        {error && <p className="details-error">{error}</p>}

        <div className="details-container">
          <section className="details-image">
            <div className="details-image-placeholder">
              Imagen del producto
            </div>
          </section>

          <section className="details-info">
            <h1>{producto?.nombre ?? 'Nombre del producto'}</h1>

            {tieneDescuento && (
              <span className="details-descuento">
                ¡Producto en oferta!
              </span>
            )}

            <div className="details-precios">
              {tieneDescuento && producto?.precio_final != null && (
                <span className="details-precio-original">
                  S/ {producto.precio}
                </span>
              )}

              <span className="details-precio">
                {precioMostrar != null
                  ? `S/ ${precioMostrar}`
                  : 'Precio por consultar'}
              </span>
            </div>

            <p className="details-descripcion">
              {producto?.descripcion ??
                'Aquí aparecerá la descripción del producto.'}
            </p>

            {stock != null && (
              <span className="details-stock">
                Stock: {stock}
              </span>
            )}

            <div className="details-cantidad">
              <label>Cantidad</label>

              <div className="details-cantidad-control">
                <button onClick={disminuirCantidad} disabled={cantidad <= 1}>
                  −
                </button>

                <span>{cantidad}</span>

                <button
                  onClick={aumentarCantidad}
                  disabled={!producto || (stock != null && Number(stock) <= 0)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="details-btn-carrito"
              onClick={agregarAlCarrito}
              disabled={stock != null && Number(stock) <= 0}
            >
              Agregar al carrito
            </button>

            {mensajeCarrito && (
              <p className="details-mensaje">{mensajeCarrito}</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default DetailsPage;
