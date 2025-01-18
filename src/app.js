require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const userRouter = require('./routes/user.router'); // Cambiado para CommonJS
const sessionRouter = require('./routes/session.router'); // Cambiado para CommonJS
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const connectDB = require('./database');
const Product = require('./models/Product');

const app = express();
const PORT = 8080;

// Conectar a la base de datos MongoDB
connectDB();

// Crear servidor HTTP y configuración de Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b,
    },
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

hbs.handlebars.registerPartial('header', path.join(__dirname, 'views/partials/header.handlebars'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
//app.use('/api/users', userRouter); // Aseguramos incluir userRouter
//app.use('/session', sessionRouter);
app.use('/api/login', sessionRouter);


app.use('/', userRouter);

// Ruta para renderizar la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    res.render('realTimeProducts', { limit, page, sort, query });
});

// Ruta para renderizar la vista de productos con paginación y filtros
app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {};
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.render('index', {
            products: products.map(product => product.toObject()),
            totalPages,
            prevPage: pageNum > 1 ? pageNum - 1 : null,
            nextPage: pageNum < totalPages ? pageNum + 1 : null,
            page: pageNum,
            limit: limitNum,
            sort,
            query,
            hasPrevPage: pageNum > 1,
            hasNextPage: pageNum < totalPages,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

// Configuración de Socket.IO
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    try {
        const products = await Product.find();
        socket.emit('productList', products);
    } catch (error) {
        console.error('Error al obtener productos de MongoDB:', error);
    }

    socket.on('newProduct', async (product) => {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            const products = await Product.find();
            io.emit('productList', products);
        } catch (error) {
            console.error('Error al agregar producto en MongoDB:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const products = await Product.find();
            io.emit('productList', products);
        } catch (error) {
            console.error('Error al eliminar producto en MongoDB:', error);
        }
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
