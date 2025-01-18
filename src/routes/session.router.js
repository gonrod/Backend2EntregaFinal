const express = require('express');
const router = express.Router();
const { 
    postLogin
} = require('../controllers/sessionController');


// const { Router } = require('express');
// const jwt = require('jsonwebtoken');
// const UserModel = require('./../models/user.models'); // Asegúrate de ajustar la ruta según la estructura del proyecto
// const { createHash } = require('./../utils/hashUtils'); // Si tienes una función para hashear contraseñas

// const router = Router();

// // Persistencia en memoria (si es temporal, de lo contrario usa la base de datos)
// const users = [];

/* Ejemplo de cuerpo esperado en el registro:
{
    "first_name": "Nahuel",
    "last_name": "Apellido",
    "email": "example@gmail.com",
    "age": 25,
    "password": "password"
}
*/


// Login enviando JWT en una cookie
router.post('/',postLogin
    //      (req, res) => {
    //     const { email, password } = req.body;
    //     if (email === "coder@coder.com" && password === "password") {
    //         const token = jwt.sign({ email, role: "user" }, "coderSecret", { expiresIn: "24h" });
    //         res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).send({ message: "Login exitoso" });
    //     } else {
    //         res.status(401).send({ message: "Credenciales inválidas" });
    //     }
    // }
    );

// // Registro de usuario
// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;

//         // Crear hash de la contraseña
//         const hashedPassword = createHash(password);

//         const newUser = new UserModel({
//             first_name,
//             last_name,
//             email,
//             age,
//             password: hashedPassword,
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'Usuario registrado exitosamente' });
//     } catch (error) {
//         console.error('Error al registrar usuario:', error);
//         res.status(500).json({ message: 'Error interno del servidor' });
//     }
// });



// // Login enviando JWT en la respuesta (para almacenamiento local)
// router.post('/loginLocalStorage', (req, res) => {
//     const { email, password } = req.body;
//     if (email === "coder@coder.com" && password === "password") {
//         const token = jwt.sign({ email, role: "user" }, "coderSecret", { expiresIn: "24h" });
//         res.send({ message: "Login exitoso", token });
//     } else {
//         res.status(401).send({ message: "Credenciales inválidas" });
//     }
// });

module.exports = router;
