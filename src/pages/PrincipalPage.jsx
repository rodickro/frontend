import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import '../App.css';
import axios from 'axios';

function PrincipalPage() {
  const [cartCount, setCartCount] = useState(0);
  const [productos, setProductos] = useState([]);

  // Variables inicializadas en 'Todos' por defecto
  const [categoria, setCategoria] = useState('Todos');
  const [genero, setGenero] = useState('Todos');
  const [marca, setMarca] = useState('Todos');
  const [talla, setTalla] = useState('Todos');

  const handleAgregarCarrito = () => {
    setCartCount((anterior) => anterior + 1);
  };

  // Función para reiniciar todos los filtros
  const limpiarFiltros = () => {
    setCategoria('Todos');
    setGenero('Todos');
    setMarca('Todos');
    setTalla('Todos');
  };

  // Obtener los productos desde el backend usando Axios con filtros dinámicos
  useEffect(() => {
    let url = 'http://localhost:3001/ecommer/principal';
    const queryParams = [];

    if (categoria !== 'Todos') queryParams.push(`categoria=${categoria}`);
    if (genero !== 'Todos') queryParams.push(`genero=${genero}`);
    if (marca !== 'Todos') queryParams.push(`marca=${marca}`);
    if (talla !== 'Todos') queryParams.push(`talla=${talla}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    axios.get(url)
      .then((res) => setProductos(res.data))
      .catch((error) => console.error('Error al traer productos:', error));
  }, [categoria, genero, marca, talla]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">MiTienda</div>
        <div>
          <input type="text" className="search-bar" placeholder="Buscar productos..." />
        </div>
        <nav className="nav-links">
          <a href="#">Contacto</a>
          <a href="#">Términos</a>
          <a href="#">Ayuda</a>
          <a href="#" className="cart-link">
            🛒 <span className="cart-badge">{cartCount}</span>
          </a>
          <Link to="/login" className="btn-ingresar">Ingresar</Link>
        </nav>
      </header>

      <main className="main-container">
        <aside className="sidebar">
          <h3>Filtros</h3>
          
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            ↺ Limpiar filtros
          </button>

          {/* 1. CATEGORÍA (Acordeón cerrado) */}
          <details className="filter-section">
            <summary>Categoría</summary>
            <div className="filter-list">
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Todos" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Todos'} />
                <span>Todos</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Calzado" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Calzado'} />
                <span>Calzado</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Ropa" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Ropa'} />
                <span>Ropa</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Accesorios" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Accesorios'} />
                <span>Accesorios</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Hogar" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Hogar'} />
                <span>Hogar</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="categoria" value="Otros" onChange={(e) => setCategoria(e.target.value)} checked={categoria === 'Otros'} />
                <span>Otros</span>
              </label>
            </div>
          </details>

          {/* 2. GÉNERO (Acordeón cerrado) */}
          <details className="filter-section">
            <summary>Género</summary>
            <div className="chip-group">
              <label className="chip-label">
                <input type="radio" name="genero" value="Todos" onChange={(e) => setGenero(e.target.value)} checked={genero === 'Todos'} />
                <span>Todos</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="genero" value="Hombre" onChange={(e) => setGenero(e.target.value)} checked={genero === 'Hombre'} />
                <span>Hombre</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="genero" value="Mujer" onChange={(e) => setGenero(e.target.value)} checked={genero === 'Mujer'} />
                <span>Mujer</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="genero" value="Unisex" onChange={(e) => setGenero(e.target.value)} checked={genero === 'Unisex'} />
                <span>Unisex</span>
              </label>
            </div>
          </details>

          {/* 3. MARCA (Acordeón cerrado) */}
          <details className="filter-section">
            <summary>Marca</summary>
            <div className="filter-list">
              <label className="custom-radio">
                <input type="radio" name="marca" value="Todos" onChange={(e) => setMarca(e.target.value)} checked={marca === 'Todos'} />
                <span>Todas</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="marca" value="Punto Norte" onChange={(e) => setMarca(e.target.value)} checked={marca === 'Punto Norte'} />
                <span>Punto Norte</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="marca" value="Nike" onChange={(e) => setMarca(e.target.value)} checked={marca === 'Nike'} />
                <span>Nike</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="marca" value="Adidas" onChange={(e) => setMarca(e.target.value)} checked={marca === 'Adidas'} />
                <span>Adidas</span>
              </label>
            </div>
          </details>

          {/* 4. TALLA (Acordeón cerrado) */}
          <details className="filter-section">
            <summary>Talla</summary>
            <div className="chip-group">
              <label className="chip-label">
                <input type="radio" name="talla" value="Todos" onChange={(e) => setTalla(e.target.value)} checked={talla === 'Todos'} />
                <span>Todas</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="talla" value="S" onChange={(e) => setTalla(e.target.value)} checked={talla === 'S'} />
                <span>S</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="talla" value="M" onChange={(e) => setTalla(e.target.value)} checked={talla === 'M'} />
                <span>M</span>
              </label>
              <label className="chip-label">
                <input type="radio" name="talla" value="L" onChange={(e) => setTalla(e.target.value)} checked={talla === 'L'} />
                <span>L</span>
              </label>
            </div>
          </details>

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
              <p className="no-products-msg">No hay productos disponibles por el momento.</p>
            ) : (
              productos.map((producto, index) => (
                <div className="product-card" key={producto.id_producto ?? index}>
                  <div className="product-image-placeholder">Imagen</div>
                  <h3 className="product-title">{producto.nombre}</h3>
                  <p className="product-price">S/ {producto.precio}</p>
                  <div className="product-actions">
                    <button className="btn-agregar" onClick={handleAgregarCarrito}>Agregar</button>
                    <Link to={`/details?id_producto=${producto.id_producto}`} className="btn-detalles">
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
