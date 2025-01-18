const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user.models'); // Asegúrate de ajustar la ruta según la estructura del proyecto
const { createHash } = require('./../utils/hashUtils'); // Si tienes una función para hashear contraseñas

const postLogin =  (req, res) => {
    const { email, password } = req.body;
    if (email === "coder@coder.com" && password === "password") {
        const token = jwt.sign({ email, role: "user" }, "coderSecret", { expiresIn: "24h" });
        res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).send({ message: "Login exitoso" });
    } else {
        res.status(401).send({ message: "Credenciales inválidas" });
    }
}

module.exports = {
    postLogin,
};