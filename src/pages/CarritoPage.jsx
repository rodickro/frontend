import React, { useState, useEffect } from 'react';

const CarritoPage = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recargar, setRecargar] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);

  useEffect(() => {
    const obtenerDatosDelCarrito = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No has iniciado sesión');
        }

        const respuesta = await fetch('http://localhost:3001/ecommer/carrito', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.message || 'Error al obtener el carrito');
        }

        setProductos(datos.productos ?? []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDelCarrito();
  }, [recargar]);

  const handleEliminar = async (item) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Debes iniciar sesión para realizar esta acción.');
        return;
      }

      setEliminandoId(item.id_detalle_carrito);

      const url = `http://localhost:3001/ecommer/carrito?id_carrito=${item.id_carrito}&id_detalle_carrito=${item.id_detalle_carrito}&id_variante=${item.id_variante}`;

      const respuesta = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo eliminar el producto');
      }

      // Dispara el useEffect para actualizar el carrito automáticamente
      setRecargar((prev) => !prev);
    } catch (err) {
      alert(err.message);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleRealizarPedido = () => {
    alert('Próximamente: redirección al flujo de pedido.');
  };

  const calcularTotal = () => {
    return productos.reduce(
      (total, producto) => total + Number(producto.importe || 0),
      0
    );
  };

  const formatoPrecio = (precio) => Number(precio || 0).toFixed(2);

  if (cargando) {
    return (
      <div style={styles.centrado}>
        <div style={styles.loader}></div>
        <p>Cargando tu carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h3>No se pudo cargar el carrito</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.contenedor}>
      <div style={styles.encabezado}>
        <div>
          <span style={styles.subtitulo}>TU TIENDA ONLINE</span>
          <h1 style={styles.titulo}>Mi carrito</h1>
          <p style={styles.descripcion}>
            Revisa los productos que has seleccionado antes de confirmar tu compra.
          </p>
        </div>

        <div style={styles.contador}>
          <span style={styles.contadorNumero}>{productos.length}</span>
          <span>{productos.length === 1 ? 'Producto' : 'Productos'}</span>
        </div>
      </div>

      {productos.length === 0 ? (
        <div style={styles.vacio}>
          <div style={styles.iconoVacio}>🛍️</div>
          <h2>Tu carrito está vacío</h2>
          <p style={styles.descripcionVacio}>
            Todavía no has agregado productos. Explora nuestra tienda y encuentra algo que te guste.
          </p>
        </div>
      ) : (
        <div style={styles.contenido}>
          <div style={styles.tablaContenedor}>
            <div style={styles.tablaEncabezado}>
              <h2 style={styles.tablaTitulo}>Productos seleccionados</h2>
              <span style={styles.badgeArticulos}>{productos.length} artículos</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={styles.tabla}>
                <thead>
                  <tr>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Talla</th>
                    <th style={styles.th}>Color</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Cantidad</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Descuento unit.</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Importe</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {productos.map((item, index) => {
                    const estaEliminando = eliminandoId === item.id_detalle_carrito;
                    return (
                      <tr key={item.id_detalle_carrito ?? index} style={styles.tr}>
                        <td style={styles.td}>
                          <strong>{item.producto}</strong>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.etiqueta}>{item.talla}</span>
                        </td>

                        <td style={styles.td}>{item.color}</td>

                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <span style={styles.cantidad}>{item.cantidad}</span>
                        </td>

                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          S/ {formatoPrecio(item.descuentoXUnidad)}
                        </td>

                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <strong>S/ {formatoPrecio(item.importe)}</strong>
                        </td>

                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <button
                            onClick={() => handleEliminar(item)}
                            disabled={estaEliminando}
                            style={{
                              ...styles.btnEliminar,
                              opacity: estaEliminando ? 0.6 : 1,
                              cursor: estaEliminando ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {estaEliminando ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.resumen}>
            <h2 style={styles.resumenTitulo}>Resumen de compra</h2>

            <div style={styles.resumenFila}>
              <span>Productos</span>
              <span>{productos.length}</span>
            </div>

            <div style={styles.resumenFila}>
              <span>Subtotal</span>
              <span>S/ {formatoPrecio(calcularTotal())}</span>
            </div>

            <div style={styles.divisor}></div>

            <div style={styles.totalFila}>
              <span>Total a pagar</span>
              <strong style={styles.totalMonto}>S/ {formatoPrecio(calcularTotal())}</strong>
            </div>

            <button
              onClick={handleRealizarPedido}
              style={styles.btnPedido}
            >
              Realizar pedido
            </button>

            <p style={styles.nota}>
              El importe mostrado corresponde a los productos actuales de tu carrito.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  contenedor: {
    maxWidth: '1250px',
    margin: '0 auto',
    padding: '45px 25px',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    color: '#1f2937',
    minHeight: '80vh'
  },

  encabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '35px'
  },

  subtitulo: {
    color: '#2563eb',
    fontSize: '12px',
    letterSpacing: '2px',
    fontWeight: '700'
  },

  titulo: {
    fontSize: '34px',
    margin: '6px 0',
    fontWeight: '700',
    color: '#111827'
  },

  descripcion: {
    color: '#6b7280',
    margin: 0,
    fontSize: '15px'
  },

  contador: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#eff6ff',
    border: '1px solid #dbeafe',
    padding: '12px 20px',
    borderRadius: '12px',
    color: '#1e40af',
    fontWeight: '500'
  },

  contadorNumero: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1d4ed8'
  },

  contenido: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },

  tablaContenedor: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },

  tablaEncabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },

  tablaTitulo: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },

  badgeArticulos: {
    fontSize: '13px',
    color: '#4b5563',
    backgroundColor: '#e5e7eb',
    padding: '4px 12px',
    borderRadius: '999px',
    fontWeight: '600'
  },

  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '820px'
  },

  th: {
    padding: '16px 15px',
    textAlign: 'left',
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    borderBottom: '1px solid #e5e7eb'
  },

  tr: {
    transition: 'background-color 0.2s ease'
  },

  td: {
    padding: '18px 15px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    verticalAlign: 'middle'
  },

  etiqueta: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },

  cantidad: {
    display: 'inline-block',
    minWidth: '32px',
    padding: '5px 10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontWeight: '600'
  },

  btnEliminar: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },

  resumen: {
    width: '100%',
    maxWidth: '420px',
    alignSelf: 'flex-end',
    padding: '26px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box'
  },

  resumenTitulo: {
    fontSize: '19px',
    marginTop: 0,
    marginBottom: '22px',
    color: '#111827'
  },

  resumenFila: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
    fontSize: '14px',
    color: '#4b5563'
  },

  divisor: {
    borderTop: '1px solid #e5e7eb',
    margin: '18px 0'
  },

  totalFila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    marginBottom: '22px'
  },

  totalMonto: {
    fontSize: '20px',
    color: '#111827'
  },

  btnPedido: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
  },

  nota: {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '1.5',
    marginTop: '16px',
    marginBottom: 0,
    textAlign: 'center'
  },

  vacio: {
    textAlign: 'center',
    padding: '75px 20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '14px'
  },

  descripcionVacio: {
    color: '#6b7280',
    maxWidth: '420px',
    margin: '10px auto 0'
  },

  iconoVacio: {
    fontSize: '55px',
    marginBottom: '15px'
  },

  centrado: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#6b7280'
  },

  loader: {
    width: '35px',
    height: '35px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  error: {
    padding: '2rem',
    textAlign: 'center',
    color: '#dc2626'
  }
};

export default CarritoPage;
