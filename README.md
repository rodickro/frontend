# Frontend

## Tecnologías utilizadas

- **React:** creación de las interfaces.
- **Vite:** servidor de desarrollo.
- **React Router:** navegación entre páginas.
- **CSS:** estilos de la aplicación.

## Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

En PowerShell:

```powershell
npm.cmd run dev
```

Dirección: `http://localhost:5173`

## Organización de archivos

### Archivos principales

- `src/main.jsx`: inicializa React y configura BrowserRouter.
- `src/App.jsx`: define las rutas de navegación.
- `src/index.css`: estilos generales.
- `src/Auth.css`: estilos compartidos de Login y Register.

### Carpeta pages

- `LoginPage.jsx`: formulario para iniciar sesión.
- `RegisterPage.jsx`: formulario para registrar usuarios.
- `PrincipalPage.jsx`: archivo preparado para la página principal.
- `DetailsPage.jsx`: archivo preparado para los detalles de productos.
- `CarritoPage.jsx`: archivo preparado para el carrito.
- `OrdersPage.jsx`: archivo preparado para los pedidos.

Las cuatro últimas páginas están creadas, pero todavía no tienen sus funcionalidades integradas.

## Rutas actuales

| Ruta | Página |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/` | Página principal provisional |

Las demás rutas se incorporarán cuando se integren las páginas correspondientes.

## React Router

Se instaló mediante:

```bash
npm install react-router
```

Permite navegar entre las páginas sin recargar la aplicación.

Se utiliza:

- `BrowserRouter` en `main.jsx`.
- `Routes` y `Route` en `App.jsx`.
- `Link` para navegar entre Login y Register.
- `useNavigate` para redirigir después de iniciar sesión.

La dependencia ya está registrada en `package.json`, por lo que basta con ejecutar `npm install`.

## Conexión con el backend

Dirección utilizada:

`http://localhost:3001/ecommer`

- **Login:** envía correo y contraseña a `/login`.
- **Register:** envía correo y contraseña a `/register`.

El backend debe estar ejecutándose para realizar las operaciones.

## Pendiente de integración

- Página principal definitiva.
- Detalles de productos.
- Carrito de compras.
- Pedidos.
- Botón de cierre de sesión en el menú de usuario.

**Nota:** este README corresponde al trabajo actual de `rodrigo-frontend`.