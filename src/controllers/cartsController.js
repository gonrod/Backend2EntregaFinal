const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Función auxiliar para encontrar un carrito
const findCartById = async (id, res) => {
    const cart = await Cart.findById(id).populate('products.product');
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    return cart;
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [], user: req.user._id });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

// Obtener un carrito por su ID
const getCartById = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid, res);
        if (cart) res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

const getCartIdByUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "No autenticado" });
        }

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = new Cart({ user: user._id, products: [] });
            await cart.save();
        }
        res.json({ cartId: cart._id });
    } catch (error) {
        console.error("❌ Error al obtener el cartId:", error);
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

      const cart = await Cart.findOne({ user: user._id }).populate('products.product');

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
        const cart = await findCartById(cid, res);
        if (!cart) return;

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

// Eliminar un producto de un carrito
const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await findCartById(cid, res);
        if (!cart) return;

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
};

const checkoutCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        let total = 0;
        const productsToBuy = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
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

            cart.products = [];
            await cart.save();

            return res.status(200).json({ message: 'Compra realizada con éxito', ticket });
        } else {
            return res.status(400).json({ error: 'Stock insuficiente para completar la compra' });
        }
    } catch (error) {
        console.error('Error en checkout:', error);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
};

module.exports = {
    createCart,
    getCartById,
    getCartIdByUser,
    getCartView,
    addProductToCart,
    removeProductFromCart,
    checkoutCart
};
