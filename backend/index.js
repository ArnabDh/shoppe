const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Product = require("./schema/product");
const User = require("./schema/user");

const { verifyToken } = require('./middleware/auth');
const { validateObjectId, validateSearchQuery } = require('./middleware/validation');
const { errorHandler } = require('./middleware/error');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/products", async (req, res) => {
    const product= new Product(req.body);
    try {
        await product.validate();
        await product.save();
        console.log("Product saved successfully");
        res.status(201).send(product);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }else{
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }
    }
});

app.get("/products", async (req, res) => {
    const products = await Product.find();
    try {
        console.log(res.json(products));
    } catch (err) {
        console.log(err);
    }
});

// Update the search route with validation
app.get("/products/search", validateSearchQuery, async (req, res) => {
    try {
        // Extract and sanitize the search term
        const searchTerm = req.query.name?.trim() || "";
        
        
        // Escape special characters in the search term for regex safety
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedSearchTerm, "i");

        // Debug log for clarity during development
        console.log("Search Term:", searchTerm);

        // Search through `name` and `categories` fields only
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { category: searchRegex }
            ]
        }).sort({ createdAt: -1 });

        // Return the search results
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ 
            success: false, 
            error: "An error occurred while searching for products" 
        });
    }
});


app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update product by ID
app.put("/products/update/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // This option returns the updated document
        );
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});



// Delete product by ID
app.delete("/products/:id", validateObjectId, async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
          return res.status(404).json({ 
              message: "Product not found" 
          });
      }

      await Product.findByIdAndDelete(req.params.id);
      
      res.status(200).json({ 
          message: "Product deleted successfully",
          deletedProduct: product 
      });
  } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ 
          message: "Error deleting product",
          error: err.message 
      });
  }
});


// Generic update route that can handle both ID and name
app.put("/products/updates/:query", async (req, res) => {
    try {
        let product;
        
        // Try to find by ID first
        if (req.params.query.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndUpdate(
                req.params.query,
                { $set: req.body },
                { new: true }
            );
        }
        
        // If not found by ID, try to find by name
        if (!product) {
            product = await Product.findOneAndUpdate(
                { name: new RegExp(req.params.query, 'i') },
                { $set: req.body },
                { new: true }
            );
        }
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Register route
app.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "User with this email or username already exists" 
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login route
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Protected route example
app.get("/auth/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Password reset request
// app.post("/auth/reset-password-request", async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const resetToken = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         // In a real application, send this token via email
//         // For now, we'll just return it
//         res.json({ 
//             message: "Password reset token generated",
//             resetToken 
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

app.get("/api/products", async (req, res) => {
    try {
        const { name, category } = req.query;
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use(errorHandler);