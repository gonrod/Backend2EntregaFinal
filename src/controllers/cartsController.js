const CartRepository = require('../dao/repositories/CartRepository');
const ProductRepository = require('../dao/repositories/ProductRepository');
const Ticket = require('../dao/models/Ticket');

// Obtener un carrito por ID
const getCartById = async (req, res) => {
    try {
        const cart = await CartRepository.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.status(200).json(cart);
    } catch (error) {
        console.error("❌ Error obteniendo el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        const newCart = await CartRepository.createCart(req.user._id);
        res.status(201).json(newCart);
    } catch (error) {
        console.error("❌ Error creando el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener el cartId de un usuario autenticado
const getCartIdByUser = async (req, res) => {
  try {
      const user = req.user;
      if (!user) {
          console.error("❌ Error: Usuario no autenticado");
          return res.status(401).json({ error: "Usuario no autenticado" });
      }

      let cart = await CartRepository.getCartById(user._id);
      if (!cart) {
          console.log("⚠️ No se encontró un carrito para el usuario, creando uno nuevo...");
          cart = await CartRepository.createCart(user._id);
      }

      console.log("✅ Cart ID obtenido:", cart._id);
      res.json({ cartId: cart._id });
  } catch (error) {
      console.error("❌ Error en getCartIdByUser:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener la vista del carrito
const getCartView = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "No autenticado" });
        }

        const cart = await CartRepository.getCartById(user._id);
        if (!cart || cart.products.length === 0) {
            return res.render("cart", { cart: null, emptyCart: true });
        }

        res.render("cart", { cart, emptyCart: false });
    } catch (error) {
        console.error("❌ Error al cargar carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Agregar un producto a un carrito
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
      const product = await ProductRepository.getProductById(pid);
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });

      const updatedCart = await CartRepository.addProductToCart(cid, pid, 1);
      
      console.log("🛒 Producto añadido al carrito:", updatedCart); // 🔍 Depuración

      res.status(201).json({ message: "Producto añadido al carrito", cart: updatedCart });
  } catch (error) {
      console.error("❌ Error agregando producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un producto de un carrito
const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await CartRepository.removeProductFromCart(cid, pid);
        res.status(200).json({ message: "✅ Producto eliminado del carrito", cart: updatedCart });
    } catch (error) {
        console.error("❌ Error eliminando producto del carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Finalizar compra (checkout)
const checkoutCart = async (req, res) => {
    try {
        const cart = await CartRepository.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        let total = 0;
        const productsToBuy = [];

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await ProductRepository.updateProduct(product._id, { stock: product.stock });

                total += product.price * item.quantity;
                productsToBuy.push({ product: product._id, quantity: item.quantity });
            }
        }

        if (productsToBuy.length > 0) {
            const ticket = await Ticket.create({
                user: cart.user,
                products: productsToBuy,
                total,
                status: 'completed'
            });

            await CartRepository.clearCart(req.params.cid);
            return res.status(200).json({ message: "✅ Compra realizada con éxito", ticket });
        } else {
            return res.status(400).json({ error: "Stock insuficiente para completar la compra" });
        }
    } catch (error) {
        console.error("❌ Error en checkout:", error);
        res.status(500).json({ error: "Error al procesar la compra" });
    }
};

module.exports = {
    getCartById,
    createCart,
    getCartIdByUser,
    getCartView,
    addProductToCart,
    removeProductFromCart,
    checkoutCart
};
