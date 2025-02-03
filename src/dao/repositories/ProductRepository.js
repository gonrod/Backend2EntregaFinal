const ProductDAO = require('../daos/ProductDAO');

class ProductRepository {
    async getAllProducts(filters = {}) {
        return await ProductDAO.getAllProducts(filters);
    }

    async getProductById(productId) {
        return await ProductDAO.getProductById(productId);
    }

    async createProduct(productData) {
        return await ProductDAO.createProduct(productData);
    }

    async updateProduct(productId, updateData) {
        return await ProductDAO.updateProduct(productId, updateData);
    }

    async deleteProduct(productId) {
        return await ProductDAO.deleteProduct(productId);
    }
}

module.exports = new ProductRepository();
