const express = require('express')

const productsRoutes = require('./routes/productsRoutes.js')
const cartsRoutes = require('./routes/cartsRoutes.js')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRoutes)
app.use('/api/cart', cartsRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error interno del servidor')
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})