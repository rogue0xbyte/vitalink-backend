import { createINRLevel, createFile } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';
import { upload } from '../../services/fileUpload.mjs';

const updateINR = Router();

function getCurrentDatetimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}I`;
}

// Define a new route to get patient details
updateINR.post('/patient/updateINR', upload.single("file"), authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try{
        // Check if session token exists in session tokens
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve patient details from session
                const patientDetails = req.session.users[sessionToken];
                const patientId = patientDetails.id;
                const currentDatetime = req.body.datetime ? req.body.datetime : getCurrentDatetimeString();
                
                const fileName = req.file.originalname; // Assuming the filename is sent in the request
                
                // Construct file path and type
                const filePath = `../../files/${fileName}`;
                const type = "INR_Report"; // Assuming the file type is sent in the request

                // // store the received INR file here
                const savedFile = await createFile(fileName, filePath, type);
                
                // // Call the function to update INR level in the database
                await createINRLevel(req.body.level, currentDatetime, savedFile.id, patientId);
                
                res.json({message: 'Transaction Complete'});
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error'});
            }
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error'});
    }
});

export { updateINR };
