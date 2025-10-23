// server.js

// --- Dependencies ---
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // for generating unique IDs

// --- Initialization ---
const app = express();
const PORT = 3000;

// ===============================================
// Task 2: In-Memory Data Store (Resource: products)
// ===============================================

let products = [
    {
        id: uuidv4(),
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals.',
        price: 1299.99,
        category: 'Electronics',
        inStock: true
    },
    {
        id: uuidv4(),
        name: 'Mechanical Keyboard',
        description: 'Tactile and responsive typing experience.',
        price: 99.50,
        category: 'Peripherals',
        inStock: true
    },
    {
        id: uuidv4(),
        name: 'Organic Coffee Beans',
        description: 'Single-origin, medium roast.',
        price: 15.00,
        category: 'Groceries',
        inStock: false
    }
];

// ===============================================
// Task 3: Middleware Implementation
// ===============================================

// 1. Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

// 2. Body-Parser Middleware (already imported as body-parser)
// We use express.json() which is part of Express now, replacing body-parser for JSON.
app.use(express.json());

// 3. Simple API Key Authentication Middleware (STUB)
const requireAuth = (req, res, next) => {
    // In a real app, the API key would be stored securely (e.g., in a DB or .env)
    const API_KEY = 'mysecretapikey'; 
    const providedKey = req.headers['x-api-key'];

    if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({ message: 'Authentication required. Invalid or missing API key.' });
    }
    next();
};

// 4. Validation Middleware for Product (STUB)
const validateProduct = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
        // Task 4: Using a basic error response for now
        return res.status(400).json({ 
            message: 'Validation failed: name, description, category are required strings, price must be a number, and inStock must be a boolean.',
            fields: { name, description, price, category, inStock } 
        });
    }
    next();
};


// --- Apply Global Middleware ---
app.use(loggerMiddleware); // Apply the custom logger globally
// Note: Authentication can be applied globally or per-route/router
// app.use(requireAuth); // Uncomment to apply to ALL routes

// ===============================================
// Task 1: Express.js Setup (Hello World)
// ===============================================

// Root endpoint: "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World! Welcome to the Express.js Product API.');
});

// ===============================================
// Task 2: RESTful API Routes (CRUD for /api/products)
// ===============================================

// Base path for the API
const API_BASE = '/api/products';


// --- GET /api/products: List all products (Task 5 Filtering/Pagination STUB) ---
app.get(API_BASE, (req, res, next) => {
    // Task 5: Implement filtering by category
    let filteredProducts = products;
    const { category, page = 1, limit = 10 } = req.query; // Default pagination values

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Task 5: Implement simple pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.status(200).json({
        total: filteredProducts.length,
        page: pageNum,
        limit: limitNum,
        data: paginatedProducts
    });
});


// --- GET /api/products/:id: Get a specific product by ID ---
app.get(`${API_BASE}/:id`, (req, res, next) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (product) {
        res.status(200).json(product);
    } else {
        // Task 4: Basic error response (will be replaced by custom error class later)
        res.status(404).json({ message: `Product with ID ${id} not found.` });
    }
});


// --- POST /api/products: Create a new product ---
// Applying authentication and validation middleware
app.post(API_BASE, requireAuth, validateProduct, (req, res, next) => {
    // Destructure properties from the validated body
    const { name, description, price, category, inStock } = req.body;
    
    const newProduct = {
        id: uuidv4(), // Generate unique ID
        name,
        description,
        price,
        category,
        inStock
    };

    products.push(newProduct);
    // 201 Created status
    res.status(201).json(newProduct);
});


// --- PUT /api/products/:id: Update an existing product ---
// Applying authentication and validation middleware
app.put(`${API_BASE}/:id`, requireAuth, validateProduct, (req, res, next) => {
    const { id } = req.params;
    const updateIndex = products.findIndex(p => p.id === id);

    if (updateIndex !== -1) {
        // Product found, apply updates
        const updatedProduct = {
            id: products[updateIndex].id, // Keep the original ID
            ...req.body // Spread the new properties from the validated body
        };
        products[updateIndex] = updatedProduct;
        res.status(200).json(updatedProduct);
    } else {
        // Task 4: Basic error response
        res.status(404).json({ message: `Product with ID ${id} not found for update.` });
    }
});


// --- DELETE /api/products/:id: Delete a product ---
// Applying authentication middleware
app.delete(`${API_BASE}/:id`, requireAuth, (req, res, next) => {
    const { id } = req.params;
    const initialLength = products.length;
    
    // Filter out the product to be deleted
    products = products.filter(p => p.id !== id);

    if (products.length < initialLength) {
        // Successfully deleted (204 No Content is common for successful deletion)
        res.status(204).send();
    } else {
        // Task 4: Basic error response
        res.status(404).json({ message: `Product with ID ${id} not found for deletion.` });
    }
});

// ===============================================
// Task 4: Global Error Handling (STUB)
// ===============================================

// Catch-all route for 404 Not Found errors
app.use((req, res, next) => {
    // Task 4: Basic 404 handler
    res.status(404).json({ message: 'Resource not found' });
});

// Global error handling middleware (must have 4 arguments: err, req, res, next)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';
    
    // Task 4: Basic error response
    res.status(statusCode).json({
        message: message,
        // In a production app, avoid sending internal details like err.stack
        // details: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
});


// ===============================================
// Task 1: Start Server
// ===============================================

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log('API Documentation:');
    console.log('GET /: "Hello World"');
    console.log('GET /api/products: List all products (supports ?category, ?page, ?limit)');
    console.log('GET /api/products/:id: Get product by ID');
    console.log('POST /api/products: Create product (requires x-api-key header)');
    console.log('PUT /api/products/:id: Update product (requires x-api-key header)');
    console.log('DELETE /api/products/:id: Delete product (requires x-api-key header)');
});