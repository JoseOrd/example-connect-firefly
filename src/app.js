import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

//Routes
import messagesRoutes from './routes/SendMessages.js';

const app = express();
dotenv.config();

app.use('/messages', messagesRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`El cliente está escuchando en http://localhost:${port}`)
})