import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = express.Router();
router.use(express.json());
dotenv.config();

const DOMAIN = process.env.DOMAIN_API_NODE || "";
const CREDENTIALES = Buffer.from(`${process.env.FIREFLY_CLIENT_ID}:${process.env.FIREFLY_CLIENT_SECRET}`).toString('base64');


const config = {
    headers: {
      'Authorization': `Basic ${CREDENTIALES}`,
      'Content-Type': 'application/json',
    }
  };

router.post('/create', async (req, res) => {
    try {
        if (!req.body.orgID || !req.body.orgName) {
            return resp.status(400).json({ message: "orgID, name and/or description is not defined" });
        }

        const apiUrl = `${DOMAIN}/transactions`;

        const requestData = { 
            headers: {
                type: "SendTransaction",
                signer: "tesseract_identity",
                channel: "default-channel",
                chaincode: "test_new"
            },
            func: "CreateOrg",
            args: [req.body.orgID, req.body.orgName],
            init: false
        };

        const response = await axios.post(apiUrl, requestData, config);

        res.status(response.status).json(response.data);
    
    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(error.response?.status || 500).json({ message: error.message || "Error en la solicitud" });
    }
});


router.get('/read/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            return resp.status(400).json({ message: "id is not defined" });
        }

        const apiUrl = `${DOMAIN}/query`;
        
        const requestData = { 
            headers: {
                type: "SendTransaction",
                signer: "tesseract_identity",
                channel: "default-channel",
                chaincode: "test_new"
            },
            func: "ReadOrg",
            args: [id],
            strongread: true
        };

        const response = await axios.post(apiUrl, requestData, config);

        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(error.response?.status || 500).json({ message: error.message || "Error en la solicitud" });
    }
});


router.get('/readall', async (req, res) => {
    try {
        const apiUrl = `${DOMAIN}/query`;
        
        const requestData = { 
            headers: {
                signer: "tesseract_identity",
                channel: "default-channel",
                chaincode: "test_new"
            },
            func: "GetAllOrgs",
            args: ["GetAllOrgs"],
            strongread: true
        };

        const response = await axios.post(apiUrl, requestData, config);
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(error.response?.status || 500).json({ message: error.message || "Error en la solicitud" });
    }
});

export default router;