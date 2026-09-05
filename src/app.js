import express from "express"
import cors from 'cors'
import cookieparser from 'cookie-parser'

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credentials:true
}))
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"))
app.use(cookieparser())

// Add a log right at the top of your Express app to verify requests are hitting the server:
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next(); // If next() is missing in any custom middleware, requests freeze here!
});

import userroutes from './routes/user.routes.js'
app.use("/api/v1/users",userroutes)  // Mount the user routes at http://localhost:8000/api/v1/users

import productroutes from './routes/product.routes.js'
app.use("/api/v1/products",productroutes)  // Mount the product routes at http://localhost:8000/api/v1/products

// Express global error handler
app.use((err, req, res, next) => {
    console.log("ERROR OBJECT:", err);
    console.log("ERROR STACK:", err.stack);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export {app}