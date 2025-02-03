const express = require('express');
const router = express.Router();
const { postLogin, getCurrentSession, registerUser, requestPasswordReset, resetPassword } = require('../controllers/sessionController');
const { authenticateJWT } = require('../middlewares/auth');

// Ruta para login
router.post('/', postLogin);
router.post('/register', registerUser);
// Nueva ruta para obtener la sesión actual
router.get('/current', authenticateJWT, getCurrentSession);



// Ruta para restablecer la contraseña con un token válido
router.post('/reset-password/:token', resetPassword);


// Ruta para solicitar la recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword"); // Renderiza la vista Handlebars
});

module.exports = router;
