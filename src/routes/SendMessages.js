import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = express.Router();
router.use(express.json());
dotenv.config();

const hostFirefly = process.env.HOST_FIREFLY || "";
const namespace = process.env.NAMESPACE || "";

const credentials = Buffer.from(`${process.env.FIREFLY_CLIENT_ID}:${process.env.FIREFLY_CLIENT_SECRET}`).toString('base64');

const config = {
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
  }
};

router.post("/public-api", async (req, res) => {
    try {
        if (!req.body.value) {
            return res.status(400).json({ message: "Value is not defined" });
        }

        const apiUrl = `${hostFirefly}/api/v1/namespaces/${namespace}/messages/broadcast`;

        const requestData = { 
            header: {
                tag: req.body.tag || "default",
                topics: [req.body.topics] || []
            },
            data: [ {value: req.body.value} ] 
        };

        const response = await axios.post(apiUrl, requestData, config);

        res.status(response.status).json(response.data);
    
    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(error.response?.status || 500).json({ message: error.message || "Error en la solicitud" });
    }
});


router.post("/private-api", async (req, res) => {
    try {
        if (!req.body.value || !req.body.identity) {
            return res.status(400).json({ message: "Value and/or identity is not defined" });
        }

        const apiUrl = `${hostFirefly}/api/v1/namespaces/${namespace}/messages/private`;

        const requestData = { 
            header: {
                tag: req.body.tag || "default",
                topics: [req.body.topics] || []
            },
            data: [{ value: req.body.value }],
            group: {
                members: [
                    { identity: req.body.identity }
                ]
            }
        };

        const response = await axios.post(apiUrl, requestData, config);

        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(error.response?.status || 500).json({ message: error.message || "Error en la solicitud" });
    }
})

export default router;
