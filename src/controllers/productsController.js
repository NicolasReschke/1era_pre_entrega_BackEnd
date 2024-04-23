const fs = require('fs/promises')
const path = require('path')

const productsFilePath = path.join(__dirname, '../data/products.json')

exports.getAllProducts = async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf8')
        let products = JSON.parse(data)

        const limit = parseInt(req.query.limit)
        if (!isNaN(limit) && limit > 0) {
            products = products.slice(0, limit)
        } else if (req.query.limit !== undefined) {
            return res.status(404).send('<p>Error: La cantidad de productos ingresada debe ser un número mayor que 0.</p>')
        }

        if (req.query.format === 'json') {
            res.json(products)
        } else {
            res.render('allProducts', { products })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.getProductById = async (req, res) => {
    const productId = parseInt(req.params.pid)

    try {
        const data = await fs.readFile(productsFilePath, 'utf8')
        const products = JSON.parse(data)
        const product = products.find(p => p.id === productId)
        if (!product) {
            const productList = products.map(({ id, title }) => ({ id, title }))
            if (req.query.format === 'json') {
                return res.status(404).json({ 
                    error: 'ID no corresponde a ningún producto. Recuerde que el ID debe ser un número mayor que 0. A continuación, le detallaremos una lista con los productos y sus IDs existentes:', 
                    products: productList 
                })
            } else {
                return res.status(404).render('error', { 
                    message: 'Producto no encontrado. Aquí está una lista de productos disponibles.', 
                    products: productList 
                })
            }
        }

        if (req.query.format === 'json') {
            res.status(200).json(product)
        } else {
            res.render('productDetail', { product })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, status = true, thumbnails = []} = req.body

        let errors = []
        if (!title) errors.push('El título es obligatorio')
        if (!description) errors.push('La descripción es obligatoria')
        if (!code) errors.push('El código del producto es obligatorio')
        if (isNaN(price) || price < 0) errors.push('El precio es obligatorio y debe ser un número positivo')
        if (isNaN(stock) || stock < 0) errors.push('El stock es obligatorio y debe ser un número positivo')
        if (!category) errors.push('La categoría del producto es obligatoria')

        if (errors.length) {
            return res.status(400).json({ error: errors.join(', ') })
        }

        const data = await fs.readFile(productsFilePath, 'utf8')
        const products = JSON.parse(data)

        const existingProduct = products.find(p => p.title === title || p.code === code)
        if (existingProduct) {
            return res.status(409).json({ error: 'Ya existe un producto con el mismo título o código' })
        }

        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }

        products.push(newProduct)

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))

        res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.updateProduct = async (req, res) => {
    const productId = parseInt(req.params.pid)
    const updates = req.body

    try {
        const data = await fs.readFile(productsFilePath, 'utf8')
        let products = JSON.parse(data)

        const productIndex = products.findIndex(p => p.id === productId)
        if (productIndex === -1) {
            return res.status(404).json({ error: 'No existe un producto con el ID que solicita para actualizar' })
        }

        products[productIndex] = { ...products[productIndex], ...updates }

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
        res.status(200).json({ message: 'Producto actualizado correctamente', product: products[productIndex] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

exports.deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.pid)
    if (isNaN(productId) || productId <= 0) {
        return res.status(404).json({ error: 'El ID del producto debe ser un número mayor que 0' })
    }

    try {
        const data = await fs.readFile(productsFilePath, 'utf8')
        let products = JSON.parse(data)

        const productExists = products.some(p => p.id === productId)
        if (!productExists) {
            const productList = products.map(({ id, title }) => ({ id, title }))
            return res.status(404).json({ error: 'Producto no encontrado. A continuación le detallamos la lista de productos existentes:',  products: productList })
        }

        products = products.filter(p => p.id !== productId)

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}