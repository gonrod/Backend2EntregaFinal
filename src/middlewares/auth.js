const express = require('express');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const UserModel = require("../dao/models/User");

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


const authenticateJWT = async (req, res, next) => {
    try {
        const token = req.cookies.tokenCookie;
        if (!token) {
            console.error("❌ No se encontró un token en las cookies.");
            return res.redirect("/login"); // ✅ Redirigir a login si no hay token
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            console.error("❌ Usuario no encontrado en la base de datos.");
            return res.redirect("/login"); // ✅ Redirigir si el usuario no existe
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Error en authenticateJWT:", error);
        return res.redirect("/login"); // ✅ Redirigir si hay un error en el token
    }
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