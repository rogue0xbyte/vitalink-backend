import express from "express";
import { Router } from "express";

import path from "path";

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const viewFile = Router();

// Define a route to get today's INR levels for a patient for a doctor
viewFile.get('/file', async (req, res) => {
    try {
        const fileName = req.query.fileName;
        if (!fileName) {
            return res.status(400).json({ message: 'File name is required' });
        }

        const filePath = path.resolve(__dirname, fileName); // Resolving the absolute path

        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file: ', err);
                res.status(err.status).end();
            } else {
                console.log('File sent successfully');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { viewFile };
