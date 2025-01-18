const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

// Definir el esquema para el usuario
const userSchema = new Schema({
    first_name: { type: String, required: true, trim: true, maxlength: 50 },
    last_name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // El índice único ya está definido aquí
    age: { type: Number, required: true, min: 0 },
    password: { type: String, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' }, // Referencia al carrito
    role: { type: String, default: 'user' }, // Rol del usuario
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
