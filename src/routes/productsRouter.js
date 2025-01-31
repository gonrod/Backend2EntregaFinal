const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById,
    getCatalog, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} = require('../controllers/productsController');

const { isAdmin } = require('../middlewares/auth'); // Importar isAdmin

// Endpoints para productos
router.get('/', getProducts); // Ruta para listar productos con filtros, paginación y ordenamiento
router.get('/:pid', getProductById); // Ruta para ver los detalles de un producto específico
router.post('/', isAdmin, addProduct); // Ruta para agregar un nuevo producto (solo admin)
router.put('/:pid', isAdmin, updateProduct); // Ruta para actualizar un producto existente (solo admin)
router.delete('/:pid', isAdmin, deleteProduct); // Ruta para eliminar un producto específico (solo admin)
router.post('/generate', isAdmin, generateTestProducts); // Ruta para generar productos de prueba (solo admin)
router.delete('/deleteAll', isAdmin, deleteAllProducts); // Ruta para eliminar todos los productos (solo admin)

router.get('/catalog', getCatalog);


module.exports = router;
