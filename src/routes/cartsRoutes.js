const express = require('express')
const router = express.Router()
const cartsController = require('../controllers/cartsController.js')

router.post('/', cartsController.createCart)
router.post('/:cid/product/:pid', cartsController.addProductToCart)
router.get('/:cid', cartsController.getCartProducts)
router.delete('/:cid', cartsController.deleteCart)

module.exports = router