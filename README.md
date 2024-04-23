<h1 align="center" id="title">1era Pre Entrega - BackEnd</h1>


El proyecto es un un servidor que contiene los endpoints y servicios necesarios para gestionar los productos y carritos de compra en un e-commerce

## Tabla de Contenido

- [Consignas](#consignas)
- [Dependencies](#dependencies)
- [Postman](#postman)
- [Handlebars](#handlebars)
- [EndPoints](#endpoints)
- [Errores](#errores)


## Consignas
*   Desarrollar el servidor basado en Node.JS y express
*   Manejo de productos (GET, POST, PUT, DELETE)
*   Manejo de carritos (GET, POST, DELETE)
*   Utilización de file system


## Dependencias
| Dependencias | README |
| ------ | ------ |
| bootstrap | [5.3.3] |
| express | [^4.19.2] |
| express-handlebars | [^7.1.2] |


## Postman
Se utilizó Postman para ver todo el flujo de información
En este enlace, pueden acceder a mi colección de Postman, para facilitarles el ruteo
* [postman.json](https://github.com/NicolasReschke/1era_pre_entrega_BackEnd/blob/main/Postman/1era_pre_entrega_BackEnd.postman_collection.json)

## Handlebars
Incorporé handlebars y bootstrap para darle un poco de "vida" a la app. Solo lo hice con el método "GET" de products.
Un detalle: utilicé una validación para no tener el error 'Error [ERR_HTTP_HEADERS_SENT]'
Esta validación tiene en cuenta el formato solicitado, si es json devuelve un resultado con formato .json, y si el formato es html, devuelve un render del handlebar.


## EndPoints
Utilicé dos grupos de Endpoints
Para manejar los productos:
    * GET (getAllProducts)
    * GET (getProductById)
    * POST (addProduct)
    * PUT (updateProduct)
    * DELETE (deleteProduct)

Para manejar el/los carritos:
    * POST (createCart y addProductToCart)
    * GET (getCartProducts)
    * DELETE (deleteCart)


## Errores
Para el manejo de errores, ya sea del usuario o del servidor, utilicé status(404) cuando el servidor no encontraba el contenido solicitado, y para manejar los errores internos del servidor, status(500)
