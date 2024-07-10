const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/cafe-station', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Branch schema and model
const branchSchema = new mongoose.Schema({
    name: String
});

const Branch = mongoose.model('Branch', branchSchema);

// Product schema and model
const productSchema = new mongoose.Schema({
    category: String,
    name: String
});

const Product = mongoose.model('Product', productSchema);

// Order schema and model
const orderSchema = new mongoose.Schema({
    product: String,
    quantity: Number,
    reason: String
});

const Order = mongoose.model('Order', orderSchema);

// API endpoints

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send('User registered successfully');
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid email or password');
    }
});

// Get branches
app.get('/api/branches', async (req, res) => {
    const branches = await Branch.find();
    res.status(200).json(branches);
});

// Get products
app.get('/api/products', async (req, res) => {
    const { category } = req.query;
    const products = await Product.find({ category });
    res.status(200).json(products);
});

// Create order
app.post('/api/orders', async (req, res) => {
    const { product, quantity, reason } = req.body;
    const newOrder = new Order({ product, quantity, reason });
    await newOrder.save();
    res.status(201).send('Order created successfully');
});

// Get orders
app.get('/api/orders', async (req, res) => {
    const orders = await Order.find();
    res.status(200).json(orders);
});

app.listen(port, () => {
    console.log(`Cafe Station API is running at http://localhost:${port}`);
});
