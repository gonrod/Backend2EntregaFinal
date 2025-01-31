const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Asegúrate de ajustar la ruta según la estructura del proyecto
const { createHash } = require('./../utils/hashUtils'); // Si tienes una función para hashear contraseñas
const passport = require('passport');


const postLogin = (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ message: info.message });

        // Generar el token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || "24h" }
        );

        // Enviar el token en una cookie
        res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.status(200).send({ message: "Login exitoso", token });
    })(req, res, next);
};


module.exports = {
    postLogin,
};