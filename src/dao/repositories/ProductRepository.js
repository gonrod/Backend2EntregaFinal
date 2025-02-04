const ProductDAO = require('../daos/ProductDAO');

class ProductRepository {
    static async getAllProducts() {
        const products = await ProductDAO.getAllProducts();
        return products;
    }

    static async getFilteredProducts(filters) {
        return await ProductDAO.getAllProducts(filters);
    }

    static async getProductById(id) {
        return await ProductDAO.getProductById(id);
    }

    static async addProduct(productData) {
        return await ProductDAO.createProduct(productData);
    }

    static async updateProduct(id, productData) {
        return await ProductDAO.updateProduct(id, productData)
    }

    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id)
    }
}

module.exports = ProductRepository;
