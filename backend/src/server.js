import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json()); // this middleware is used to parse JSON bodies: req.body

app.use((req, res, next) => {
    console.log(`Request method is ${req.method} and Request URL is ${req.url}`);
    next();
});

app.use("/api/notes", notesRoutes);

connectDB().then(() => { 
    app.listen(PORT, () => {    
        console.log("Server is running on port 5001", PORT);
    });
});
