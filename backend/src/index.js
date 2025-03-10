// Importing necessary libraries and modules
import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import db from "./database/db-helper.js";

// Importing routers
import userRouter from "./routers/user-router.js";
import outfitRouter from "./routers/outfit-router.js";
import clothingItemRouter from "./routers/clothing-item-router.js";

// Creating an instance of express
const app = express();
const port = 3000;

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routing setup
app.use('/users', userRouter);
app.use('/outfits', outfitRouter);
app.use('/clothingItems', clothingItemRouter);

// Global error handling
app.use((err, req, res, next) => {
    console.log("status", err.status);
    console.log("message", err.message);
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            message: err.message || 'Something went wrong!'
        });
});

// Server setup, listening on port 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});