
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import '../App.css';

function PrincipalPage() {
  const [cartCount, setCartCount] = useState(0);
  const [productos, setProductos] = useState([]);

  // Contador provisional del carrito
  const handleAgregarCarrito = () => {
    setCartCount((anterior) => anterior + 1);
  };

  // Obtener los productos desde el backend de Rodick
  useEffect(() => {
    fetch('http://localhost:3001/ecommer/principal')
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        console.error('Error al traer productos:', error);
      });
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">MiTienda</div>

        <div>
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar productos..."
          />
        </div>

        <nav className="nav-links">
          <a href="#">Contacto</a>
          <a href="#">Términos</a>
          <a href="#">Ayuda</a>

          <a href="#" className="cart-link">
            🛒 <span className="cart-badge">{cartCount}</span>
          </a>

          <Link to="/login" className="btn-ingresar">
            Ingresar
          </Link>
        </nav>
      </header>

      <main className="main-container">
        <aside className="sidebar">
          <h3>Filtros</h3>

          <div className="filter-group">
            <h4>Categoría</h4>

            <label className="custom-radio">
              <input type="radio" name="categoria" defaultChecked />
              <span>Todos</span>
            </label>

            <label className="custom-radio">
              <input type="radio" name="categoria" />
              <span>Calzado</span>
            </label>

            <label className="custom-radio">
              <input type="radio" name="categoria" />
              <span>Ropa</span>
            </label>

            <label className="custom-radio">
              <input type="radio" name="categoria" />
              <span>Accesorios</span>
            </label>

            <label className="custom-radio">
              <input type="radio" name="categoria" />
              <span>Hogar</span>
            </label>

            <label className="custom-radio">
              <input type="radio" name="categoria" />
              <span>Otros</span>
            </label>
          </div>
        </aside>

        <section className="catalog">
          <div className="catalog-header">
            <div>
              <h2>Catálogo de Productos</h2>
              <p>Encuentra lo que necesitas, al mejor precio.</p>
            </div>

            <div className="sort-by">
              <label>Ordenar por: </label>
              <select>
                <option>Más vendidos</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Más recientes</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {productos.length === 0 ? (
              <p>No hay productos disponibles por el momento.</p>
            ) : (
              productos.map((producto, index) => (
                <div
                  className="product-card"
                  key={producto.id_producto ?? index}
                >
                  <div className="product-image-placeholder">
                    Imagen
                  </div>

                  <h3 className="product-title">
                    {producto.nombre}
                  </h3>

                  <p className="product-price">
                    S/ {producto.precio}
                  </p>

                  <div className="product-actions">
                    <button
                      className="btn-agregar"
                      onClick={handleAgregarCarrito}
                    >
                      Agregar
                    </button>

                   <Link
                       to={`/details?id_producto=${producto.id_producto}`}
                       className="btn-detalles"
>
                       Ver detalles
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default PrincipalPage;
