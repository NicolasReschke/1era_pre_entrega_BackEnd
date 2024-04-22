const fs = require('fs/promises')
const path = require('path')

const productsFilePath = path.join(__dirname, '../data/products.json')
const cartsFilePath = path.join(__dirname, '../data/carts.json')

async function readCarts() {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error al leer data/carts:', error)
        return []
    }
}

async function saveCarts(carts) {
    try {
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2))
    } catch (error) {
        console.error('Error al guardar los carritos en el archivo:', error)
    }
}

exports.createCart = async (req, res) => {
    try {
        let carts = await readCarts()
        const cartId = carts.length === 0 ? 1 : Math.max(...carts.map(cart => cart.id)) + 1

        const newCart = {
            id: cartId,
            products: []
        }

        carts.push(newCart)

        await saveCarts(carts)

        res.status(201).json({ message: 'Nuevo carrito creado con éxito!', cart: newCart })
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.getCartProducts = async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)

        const carts = await readCarts()

        const cart = carts.find(cart => cart.id === cartId)
        if (!cart) {
            return res.status(404).json({ error: 'El carrito con ese ID no existe' })
        }

        res.json(cart.products)
    } catch (error) {
        console.error('Error al obtener los productos del carrito con ese ID:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.addProductToCart = async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        if (isNaN(productId) || productId <= 0) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número entero mayor que 0' })
        }

        const { quantity } = req.body

        let carts = await readCarts()

        const cartIndex = carts.findIndex(cart => cart.id === cartId)
        if (cartIndex === -1) {
            return res.status(404).json({ error: 'El carrito con el ID ingresado no existe!' })
        }

        let products = await fs.readFile(productsFilePath, 'utf8')
        products = JSON.parse(products)

        const product = products.find(product => product.id === productId)
        if (!product) {
            return res.status(404).json({ error: 'El producto con el ID especificado no existe. No se pudo agregar al carrito!' })
        }

        const existingProductIndex = carts[cartIndex].products.findIndex(item => item.id === productId)
        if (existingProductIndex !== -1) {
            carts[cartIndex].products[existingProductIndex].quantity += quantity || 1
        } else {
            carts[cartIndex].products.push({ id: productId, quantity: quantity || 1 })
        }

        await saveCarts(carts)

        res.json({ message: 'Producto agregado correctamente', cart: carts[cartIndex] })
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)

        let carts = await readCarts()

        // Buscar el índice del carrito a eliminar
        const cartIndex = carts.findIndex(cart => cart.id === cartId)

        if (cartIndex === -1) {
            return res.status(404).json({ error: 'El carrito con ese ID no existe' })
        }

        carts.splice(cartIndex, 1)

        await saveCarts(carts)

        res.json({ message: 'Carrito eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar el carrito:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}