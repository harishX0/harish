const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

const stripe = Stripe('sk_test_51QAdhIHC7xdurqOq50qg7gyrpiomL4gNhc4mtv1i22IztkYg89872AQSA7mqv2xQIobpMK9Pxyjgyx1WHtgLfpLe00dOzZRI1A'); // Your actual secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://choudharyharish226:Pass123@cluster1.d6hih.mongodb.net/Fitness-app?retryWrites=true&w=majority',)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a Payment Schema
const paymentSchema = new mongoose.Schema({
    amount: Number,
    paymentMethodId: String,
    paymentIntentId: String,
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

// Payment Intent Route
app.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodId, amount } = req.body;

    try {
        // Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents
            currency: 'inr', // Change to your desired currency
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
        });

        // Save payment info to MongoDB
        const payment = new Payment({
            amount,
            paymentMethodId,
            paymentIntentId: paymentIntent.id,
        });
        
        await payment.save(); // Save the payment record

        res.status(200).send({ success: true, paymentIntent });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
