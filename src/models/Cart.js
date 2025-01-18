const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 } // Cantidad mínima de 1
    }
  ]
}, { timestamps: true }); // Agregar timestamps automáticos

module.exports = mongoose.model('Cart', cartSchema);
