const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection with Success/Error Handling
mongoose.connect('mongodb+srv://choudharyharish226:Pass123@cluster1.d6hih.mongodb.net/Fitness-app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// MongoDB Connection Event Handlers
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err);
});

// Define a Schema for MongoDB
const consultationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String,
    goal: String,
    message: String
});

const Consultation = mongoose.model('Consultation', consultationSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission with async/await
app.post('/submit', async (req, res) => {
    try {
        const formData = new Consultation({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            goal: req.body.goal,
            message: req.body.message
        });

        // Save the form data to MongoDB
        await formData.save(); // Use await instead of callback
        // Redirect to the thank-you page after a successful submission
        res.redirect('/thanku');
    } catch (err) {
        res.status(500).send('Error saving the consultation request.');
    }
});

// Serve Thank You page
app.get('/thanku', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thanku.html'));
});

// Start the server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
