import React, { useState, useEffect } from 'react';

const CarritoPage = () => {
  // Estado para almacenar los productos del carrito
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Llamada al backend usando la URL exacta (puerto 3001)
    const obtenerDatosDelCarrito = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/ecommer/carrito?id_cliente=1');
        
        if (!respuesta.ok) {
          throw new Error('Error al obtener los datos del servidor');
        }

        const datos = await respuesta.json();
        setProductos(datos);


      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDelCarrito();
  }, []); // El arreglo vacío indica que se ejecuta solo una vez al cargar la página

  // 2. Función para calcular el total general sumando la columna 'importe'
  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + parseFloat(producto.importe), 0);
  };

  if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando carrito...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Mi Carrito de Compras</h2>
      
      {productos.length === 0 ? (
        <p>Tu carrito está vacío. ¡Agrega algunos productos!</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Producto</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Talla</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Color</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Cantidad</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Descuento Unit.</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Importe</th>
                </tr>
              </thead>
              <tbody>
                {/* 3. Mapeo de datos: Mostrar todo EXCEPTO los IDs (id_cliente, id_carrito, etc.) */}
                {productos.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.producto}</td>
                    <td style={{ padding: '12px' }}>{item.talla}</td>
                    <td style={{ padding: '12px' }}>{item.color}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.cantidad}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>S/ {parseFloat(item.descuentoXUnidad).toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>S/ {parseFloat(item.importe).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'right', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
            <h3 style={{ margin: 0 }}>
              Total a Pagar: <span style={{ color: '#2ecc71', marginLeft: '15px' }}>S/ {calcularTotal().toFixed(2)}</span>
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoPage;

