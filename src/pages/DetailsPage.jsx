
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import axios from 'axios';
import '../Detailspage.css';

const API = 'http://localhost:3001/ecommer';

function DetailsPage() {

    const [searchParams] = useSearchParams();
    const id_producto = searchParams.get('id_producto');

    const [producto, setProducto] = useState(null);
    const [variantes, setVariantes] = useState([]);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

    const [cantidad, setCantidad] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [agregando, setAgregando] = useState(false);

    const [error, setError] = useState('');
    const [mensajeCarrito, setMensajeCarrito] = useState('');
    const [imagenFallida, setImagenFallida] = useState(false);

    // Obtener información del producto y sus variantes
    useEffect(() => {

        if (!id_producto || id_producto === 'undefined') {
            setError('No se seleccionó ningún producto.');
            setCargando(false);
            return;
        }

        const controller = new AbortController();

        const obtenerDetalles = async () => {

            setCargando(true);
            setError('');
            setProducto(null);
            setVariantes([]);
            setVarianteSeleccionada(null);
            setCantidad(1);
            setImagenFallida(false);

            try {

                const respuesta = await axios.get(`${API}/details`, {
                    params: { id_producto },
                    signal: controller.signal
                });

                const datos = respuesta.data;

                // Información general del producto
                const productoEncontrado = datos.producto ?? datos;

                const resultado = Array.isArray(productoEncontrado)
                    ? productoEncontrado[0]
                    : productoEncontrado;

                if (!resultado) {
                    throw new Error('Producto no encontrado.');
                }

                setProducto(resultado);

                // Variantes disponibles
                setVariantes(datos.variantes ?? []);

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


    // Verificar promoción
    const tieneDescuento = Number(producto?.Descuento) === 1;

    // Precio final
    const precioMostrar =
        tieneDescuento && producto?.precio_final != null
            ? producto.precio_final
            : producto?.precio;


    // Formatear precios
    const formatearPrecio = (valor) => {

        if (valor == null || !Number.isFinite(Number(valor))) {
            return 'Precio por consultar';
        }

        return `S/ ${Number(valor).toFixed(2)}`;
    };


    // Obtener imagen
    const obtenerImagen = (ruta) => {

        if (!ruta) return null;

        if (/^https?:\/\//i.test(ruta)) {
            return ruta;
        }

        return `http://localhost:3001/${ruta.replace(/^\/+/, '')}`;
    };

    const imagen = obtenerImagen(producto?.imagen_url);


    // Stock de la variante seleccionada
    const stock = varianteSeleccionada
        ? Number(varianteSeleccionada.stock_disponible)
        : 0;


    // Seleccionar variante
    const seleccionarVariante = (variante) => {

        setVarianteSeleccionada(variante);
        setCantidad(1);
        setMensajeCarrito('');

    };


    // Aumentar cantidad
    const aumentarCantidad = () => {

        if (varianteSeleccionada && cantidad < stock) {
            setCantidad(anterior => anterior + 1);
        }

    };


    // Disminuir cantidad
    const disminuirCantidad = () => {

        if (cantidad > 1) {
            setCantidad(anterior => anterior - 1);
        }

    };


    // Agregar producto al carrito
    const agregarAlCarrito = async () => {

        if (!varianteSeleccionada) {
            setMensajeCarrito('Selecciona un color y una talla.');
            return;
        }

        if (cantidad > stock || stock <= 0) {
            setMensajeCarrito('No hay suficiente stock disponible.');
            return;
        }

        // Obtener token JWT
        const token = localStorage.getItem('token');

        if (!token) {
            setMensajeCarrito('Debes iniciar sesión para agregar productos al carrito.');
            return;
        }

        try {

            setAgregando(true);
            setMensajeCarrito('');

            const respuesta = await axios.post(
                `${API}/carrito`,
                {
                    id_variante: varianteSeleccionada.id_variante,
                    cantidad: cantidad
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMensajeCarrito(
                respuesta.data.message || 'Producto agregado al carrito.'
            );

        } catch (err) {

            console.error(
                'Error al agregar al carrito:',
                err.response?.data ?? err
            );

            setMensajeCarrito(
                err.response?.data?.mensaje ||
                err.response?.data?.message ||
                'No se pudo agregar el producto al carrito.'
            );

        } finally {

            setAgregando(false);

        }

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

                    <Link to="/carrito" className="details-cart-icon">
                        🛒
                    </Link>

                </div>

            </header>


            <main className="details-page">

                <Link to="/" className="details-volver">
                    ← Volver al catálogo
                </Link>


                {cargando && (
                    <p>Cargando producto...</p>
                )}


                {error && (
                    <p className="details-error">
                        {error}
                    </p>
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


                            {/* Promoción */}
                            {tieneDescuento && (

                                <span className="details-descuento">
                                    ¡Producto en oferta!
                                </span>

                            )}


                            {/* Precios */}
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


                            {/* Descripción */}
                            <p className="details-descripcion">
                                {producto.descripcion}
                            </p>


                            {/* Selección de variantes */}
                            <div className="details-variantes">

                                <h3>Selecciona una variante</h3>

                                {variantes.length === 0 ? (

                                    <p>No hay variantes disponibles.</p>

                                ) : (

                                    <div className="details-variantes-list">

                                        {variantes.map((variante) => (

                                            <button
                                                type="button"
                                                key={variante.id_variante}
                                                className={
                                                    varianteSeleccionada?.id_variante === variante.id_variante
                                                        ? 'variante-seleccionada'
                                                        : 'variante-opcion'
                                                }
                                                onClick={() => seleccionarVariante(variante)}
                                            >

                                                {variante.color} - {variante.talla}

                                                <small>
                                                    Stock: {variante.stock_disponible}
                                                </small>

                                            </button>

                                        ))}

                                    </div>

                                )}

                            </div>


                            {/* Cantidad */}
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
                                            cantidad >= stock
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            {/* Stock seleccionado */}
                            {varianteSeleccionada && (

                                <p className="details-stock">
                                    Stock disponible: {stock}
                                </p>

                            )}


                            {/* Agregar al carrito */}
                            <button
                                type="button"
                                className="details-btn-carrito"
                                onClick={agregarAlCarrito}
                                disabled={
                                    agregando ||
                                    !varianteSeleccionada ||
                                    stock <= 0
                                }
                            >

                                {agregando
                                    ? 'Agregando...'
                                    : 'Agregar al carrito'}

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
