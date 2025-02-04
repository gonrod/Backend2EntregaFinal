const express = require('express');
const router = express.Router();
const { renderCatalog } = require("../controllers/productsController"); // ✅ Importa correctamente el controlador

router.get('/catalog', renderCatalog);
router.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/forgot-password', (req, res) => res.render('forgotPassword'));
router.get('/reset-password/:token', (req, res) => {
    res.render('resetPassword', { token: req.params.token });
});

module.exports = router;