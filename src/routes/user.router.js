const { Router } = require('express');

const router = Router();


router.get('/', (req, res) => {
    res.render('login');
});

// Endpoint para el registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Endpoint para el login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para el usuario actual
router.get('/current', (req, res) => {
    // Implementación pendiente
    res.status(200).send({ message: 'Ruta /current implementada' });
});

module.exports = router;
