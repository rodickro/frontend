import React from 'react'

const OrdersPage = () => {


    const listaprendas = [
        {
            id: 1,
            nombre: "nombre_prenda1",
            precio: 100,
            color: "Rojo",
            talla: "M",
            categoria: "Categoria1",
            genro: "Genero1",
            url:'https://images.pexels.com/photos/1002643/pexels-photo-1002643.jpeg?auto=compress&cs=tinysrgb&w=600'

        },
        {
            id: 2,
            nombre: "nombre_prenda2",
            precio: 200,
            color: "Azul",
            talla: "L",
            categoria: "Categoria2",
            genro: "Genero2",
            url:'https://images.pexels.com/photos/1002643/pexels-photo-1002643.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
    ]
    return (
        <div>
            orders page
        </div>
    )
}

export default OrdersPage;
