
import React, { useState, useEffect } from 'react';

const CarritoPage = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

        console.log('Respuesta del carrito:', datos);
        setProductos(datos.productos ?? []);

      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDelCarrito();
  }, []);

  const calcularTotal = () => {
    return productos.reduce(
      (total, producto) => total + Number(producto.importe || 0),
      0
    );
  };

  const formatoPrecio = (precio) =>
    Number(precio || 0).toFixed(2);

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
            Revisa los productos que has seleccionado.
          </p>
        </div>

        <div style={styles.contador}>
          <span style={styles.contadorNumero}>{productos.length}</span>
          <span>Productos</span>
        </div>
      </div>

      {productos.length === 0 ? (
        <div style={styles.vacio}>
          <div style={styles.iconoVacio}>🛍️</div>
          <h2>Tu carrito está vacío</h2>
          <p>
            Todavía no has agregado productos.
            Explora nuestra tienda y encuentra algo que te guste.
          </p>
        </div>
      ) : (
        <div style={styles.contenido}>

          <div style={styles.tablaContenedor}>
            <div style={styles.tablaEncabezado}>
              <h2>Productos seleccionados</h2>
              <span>{productos.length} artículos</span>
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
                  </tr>
                </thead>

                <tbody>
                  {productos.map((item, index) => (
                    <tr key={item.id_detallecarrito ?? index}>
                      <td style={styles.td}>
                        <strong>{item.producto}</strong>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.etiqueta}>{item.talla}</span>
                      </td>

                      <td style={styles.td}>
                        {item.color}
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={styles.cantidad}>{item.cantidad}</span>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        S/ {formatoPrecio(item.descuentoXUnidad)}
                      </td>

                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <strong>S/ {formatoPrecio(item.importe)}</strong>
                      </td>
                    </tr>
                  ))}
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
              <strong>S/ {formatoPrecio(calcularTotal())}</strong>
            </div>

            <p style={styles.nota}>
              El importe mostrado corresponde a los productos de tu carrito.
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
    fontFamily: 'Arial, sans-serif',
    color: '#252525',
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
    color: '#888',
    fontSize: '12px',
    letterSpacing: '2px',
    fontWeight: 'bold'
  },

  titulo: {
    fontSize: '34px',
    margin: '8px 0',
    fontWeight: '700'
  },

  descripcion: {
    color: '#777',
    margin: 0,
    fontSize: '15px'
  },

  contador: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f5f5f5',
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#555'
  },

  contadorNumero: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#222'
  },

  contenido: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },

  tablaContenedor: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    overflow: 'hidden'
  },

  tablaEncabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '22px',
    borderBottom: '1px solid #eee'
  },

  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '750px'
  },

  th: {
    padding: '17px 15px',
    textAlign: 'left',
    fontSize: '12px',
    color: '#777',
    backgroundColor: '#fafafa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  td: {
    padding: '20px 15px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },

  etiqueta: {
    backgroundColor: '#f3f3f3',
    padding: '6px 12px',
    borderRadius: '5px',
    fontSize: '12px'
  },

  cantidad: {
    display: 'inline-block',
    minWidth: '30px',
    padding: '6px 10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px'
  },

  resumen: {
    width: '100%',
    maxWidth: '420px',
    alignSelf: 'flex-end',
    padding: '25px',
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    borderRadius: '12px',
    boxSizing: 'border-box'
  },

  resumenTitulo: {
    fontSize: '19px',
    marginTop: 0,
    marginBottom: '25px'
  },

  resumenFila: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '17px',
    fontSize: '14px',
    color: '#666'
  },

  divisor: {
    borderTop: '1px solid #ddd',
    margin: '20px 0'
  },

  totalFila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px'
  },

  nota: {
    color: '#999',
    fontSize: '12px',
    lineHeight: '1.5',
    marginTop: '20px'
  },

  vacio: {
    textAlign: 'center',
    padding: '75px 20px',
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    borderRadius: '12px'
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
    color: '#777'
  },

  loader: {
    width: '35px',
    height: '35px',
    border: '4px solid #eee',
    borderTop: '4px solid #333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  error: {
    padding: '2rem',
    textAlign: 'center',
    color: '#c0392b'
  }
};

export default CarritoPage;
