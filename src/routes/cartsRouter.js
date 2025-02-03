const express = require('express');
const { createCart, getCartById, addProductToCart, removeProductFromCart, checkoutCart, getCartIdByUser, getCartView } = require('../controllers/cartsController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Nueva ruta para obtener el carrito del usuario autenticado
router.get('/my-cart', authenticateJWT, getCartIdByUser);
router.get('/view', authenticateJWT, getCartView);

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.post('/:cid/checkout', checkoutCart);

module.exports = router;
