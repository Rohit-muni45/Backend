const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

// Add or Update Cart for a user
router.post('/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body; 

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product is already in the cart
      const productExists = cart.items.find((item) => item.productId.toString() === productId);
      if (productExists) {
        // Update the quantity if the product is already in the cart
        productExists.quantity = quantity;
      } else {
        // Add new product to the cart
        cart.items.push({ productId, quantity });
      }
    } else {
      // Create a new cart for the user
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
});

// Get Cart for a specific user
router.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

module.exports = router;



