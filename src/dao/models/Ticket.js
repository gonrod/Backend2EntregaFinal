const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario que realiza la compra
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 }
    }
  ],
  total: { type: Number, required: true }, // Precio total de la compra
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Estado de la compra
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
