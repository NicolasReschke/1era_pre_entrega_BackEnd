const express = require('express')
const router = express.Router()
const ProductsController = require('../controllers/productsController.js')

router.get('/', ProductsController.getAllProducts)

router.get('/:pid', ProductsController.getProductById)

router.post('/', ProductsController.addProduct)

router.put('/:pid', ProductsController.updateProduct)

router.delete('/:pid', ProductsController.deleteProduct)

module.exports = router