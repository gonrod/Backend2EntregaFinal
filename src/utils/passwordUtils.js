import bcrypt from 'bcrypt';

// Hashear la contraseña
export const createHash = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};

// Verificar si la contraseña es válida
export const isValidPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};