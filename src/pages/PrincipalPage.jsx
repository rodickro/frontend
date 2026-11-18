import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import '../App.css';
import axios from 'axios';

function PrincipalPage() {

    const [cartCount, setCartCount] = useState(0);
    const [productos, setProductos] = useState([]);

    // Variables para los filtros, incluyendo tu "orden"
    const [categoria, setCategoria] = useState('Todos');
    const [genero, setGenero] = useState('Todos');
    const [marca, setMarca] = useState('Todos');
    const [talla, setTalla] = useState('Todos');
    const [orden, setOrden] = useState('mas_vendidos'); // TU CAMBIO

    const handleAgregarCarrito = () => {
        setCartCount((anterior) => anterior + 1);
    };

    // Función para reiniciar todos los filtros
    const limpiarFiltros = () => {
        setCategoria('Todos');
        setGenero('Todos');
        setMarca('Todos');
        setTalla('Todos');
        setOrden('mas_vendidos'); // TU CAMBIO
    };

    // Obtener productos desde el backend
    useEffect(() => {
        let url = 'http://localhost:3001/ecommer/principal';
        const queryParams = [];

        if (categoria !== 'Todos') queryParams.push(`categoria=${encodeURIComponent(categoria)}`);
        if (genero !== 'Todos') queryParams.push(`genero=${encodeURIComponent(genero)}`);
        if (marca !== 'Todos') queryParams.push(`marca=${encodeURIComponent(marca)}`);
        if (talla !== 'Todos') queryParams.push(`talla=${encodeURIComponent(talla)}`);
        if (orden) queryParams.push(`orden=${orden}`); // TU CAMBIO

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        axios.get(url)
            .then((res) => {
                setProductos(res.data);
            })
            .catch((error) => {
                console.error('Error al traer productos:', error);
                setProductos([]);
            });

    // TU CAMBIO (Se añadió orden a las dependencias)
    }, [categoria, genero, marca, talla, orden]); 

    return (
        <>
            <header className="navbar">
                <div className="navbar-brand">
                    MiTienda
                </div>
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
                    <Link to="/carrito" className="cart-link">
                        🛒 <span className="cart-badge">{cartCount}</span>
                    </Link>
                    <Link to="/login" className="btn-ingresar">
                        Ingresar
                    </Link>
                </nav>
            </header>

            <main className="main-container">
                <aside className="sidebar">
                    <h3>Filtros</h3>
                    <button
                        className="btn-limpiar"
                        onClick={limpiarFiltros}
                    >
                        ↺ Limpiar filtros
                    </button>

                    {/* 1. CATEGORÍA (Código optimizado de Rodrick) */}
                    <details className="filter-section">
                        <summary>Categoría</summary>
                        <div className="filter-list">
                            {['Todos', 'Calzado', 'Ropa', 'Accesorios', 'Hogar', 'Otros'].map((opcion) => (
                                <label className="custom-radio" key={opcion}>
                                    <input
                                        type="radio"
                                        name="categoria"
                                        value={opcion}
                                        checked={categoria === opcion}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    />
                                    <span>{opcion}</span>
                                </label>
                            ))}
                        </div>
                    </details>

                    {/* 2. GÉNERO (Código optimizado de Rodrick) */}
                    <details className="filter-section">
                        <summary>Género</summary>
                        <div className="chip-group">
                            {['Todos', 'Hombre', 'Mujer', 'Unisex'].map((opcion) => (
                                <label className="chip-label" key={opcion}>
                                    <input
                                        type="radio"
                                        name="genero"
                                        value={opcion}
                                        checked={genero === opcion}
                                        onChange={(e) => setGenero(e.target.value)}
                                    />
                                    <span>{opcion}</span>
                                </label>
                            ))}
                        </div>
                    </details>

                    {/* 3. MARCA (Código optimizado de Rodrick) */}
                    <details className="filter-section">
                        <summary>Marca</summary>
                        <div className="filter-list">
                            {['Todos', 'Punto Norte', 'Nike', 'Adidas'].map((opcion) => (
                                <label className="custom-radio" key={opcion}>
                                    <input
                                        type="radio"
                                        name="marca"
                                        value={opcion}
                                        checked={marca === opcion}
                                        onChange={(e) => setMarca(e.target.value)}
                                    />
                                    <span>{opcion === 'Todos' ? 'Todas' : opcion}</span>
                                </label>
                            ))}
                        </div>
                    </details>

                    {/* 4. TALLA (Código optimizado de Rodrick) */}
                    <details className="filter-section">
                        <summary>Talla</summary>
                        <div className="chip-group">
                            {['Todos', 'S', 'M', 'L'].map((opcion) => (
                                <label className="chip-label" key={opcion}>
                                    <input
                                        type="radio"
                                        name="talla"
                                        value={opcion}
                                        checked={talla === opcion}
                                        onChange={(e) => setTalla(e.target.value)}
                                    />
                                    <span>{opcion === 'Todos' ? 'Todas' : opcion}</span>
                                </label>
                            ))}
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
                            {/* TU CAMBIO: Select enlazado al estado */}
                            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                                <option value="mas_vendidos">Más vendidos</option>
                                <option value="precio_asc">Precio: menor a mayor</option>
                                <option value="precio_desc">Precio: mayor a menor</option>
                                <option value="mas_recientes">Más recientes</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-grid">
                        {productos.length === 0 ? (
                            <p className="no-products-msg">
                                No hay productos disponibles por el momento.
                            </p>
                        ) : (
                            productos.map((producto, index) => (
                                <div
                                    className="product-card"
                                    key={producto.id_producto ?? producto.idproducto ?? index}
                                >
                                    {/* CAMBIO DE RODRICK: Lógica de imágenes */}
                                    <div className="product-image-placeholder">
                                        {producto.imagen_url ? (
                                            <img
                                                src={`http://localhost:3001/${producto.imagen_url}`}
                                                alt={producto.nombre}
                                            />
                                        ) : (
                                            'Imagen'
                                        )}
                                    </div>
                                    <h3 className="product-title">
                                        {producto.nombre}
                                    </h3>
                                    {/* CAMBIO DE RODRICK: Formateo de precio */}
                                    <p className="product-price">
                                        S/ {Number(producto.precio_final ?? producto.precio).toFixed(2)}
                                    </p>
                                    <div className="product-actions">
                                        <button className="btn-agregar" onClick={handleAgregarCarrito}>Agregar</button>
                                        <Link
                                            to={`/details?id_producto=${producto.id_producto ?? producto.idproducto}`}
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