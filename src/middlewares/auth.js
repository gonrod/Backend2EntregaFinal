const express = require('express');
const passport = require('passport');


const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); // Permitir el acceso si hay sesión
    } else {
        res.redirect('/login'); // Redirigir al login si no hay sesión
    }
};

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/perfil'); // Redirigir al perfil si ya estoy logueado
    } else {
        next(); // Permitir el acceso si no hay sesión
    }
};

const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Unauthorized access" });

        req.user = user; // Attach user info to the request
        next();
    })(req, res, next);
};

const isAdmin = (req, res, next) => {
    try {
        const user = req.user; // Asegúrate de que `req.user` esté configurado (Passport o JWT)
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        next(); // Usuario autorizado, continuar con la siguiente función
    } catch (error) {
        console.error('Error en la autorización:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const isUser = (req, res, next) => {
    try {
        const user = req.user; // Asegúrate de que `req.user` esté configurado (Passport o JWT)
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (user.role !== 'user') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        next(); // Usuario autorizado, continuar con la siguiente función
    } catch (error) {
        console.error('Error en la autorización:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { isAdmin, authenticateJWT };