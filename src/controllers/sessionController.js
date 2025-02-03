const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const Cart = require('../models/Cart'); // Importar el modelo de carrito
const passport = require('passport');

const postLogin = (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ message: info.message });

        try {
            // Verificar si el usuario ya tiene un carrito asignado
            if (!user.cart) {
                console.log(`🛒 Usuario ${user.email} no tiene un carrito. Creando uno...`);
                const newCart = new Cart({ user: user._id, products: [] });
                await newCart.save();

                // Asignar el carrito al usuario y guardar el usuario actualizado
                user.cart = newCart._id;
                await user.save();
            }

            // Generar el token JWT
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, cart: user.cart },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || "24h" }
            );

            console.log("✅ cartId asignado al usuario:", user.cart); // 🔍 Depuración

            res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
            res.status(200).json({ message: "Login exitoso", token, cartId: user.cart });

        } catch (error) {
            console.error("❌ Error al asignar carrito al usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    })(req, res, next);
};


module.exports = {
    postLogin,
};
