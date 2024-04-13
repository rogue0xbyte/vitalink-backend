import { createDosage } from '../../services/databasepg.mjs';
import express from "express";
import { Router } from "express";

import { authenticateToken } from '../../services/middlewares.mjs';

const takeDosage = Router();

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
takeDosage.post('/patient/takeDosage', authenticateToken, async (req, res) => {
    const sessionToken = req.token;
    try{
        // Check if session token exists in session tokens
        if (req.session.tokens.includes(sessionToken)) {
            try {
                // Retrieve patient details from session
                const patientDetails = req.session.users[sessionToken];
                const patientId = patientDetails.id;
                const currentDatetime = req.body.datetime ? req.body.datetime : getCurrentDatetimeString();
                console.log(req.body.datetime, currentDatetime);
                await createDosage(patientDetails.drugtype,
                             currentDatetime,
                             req.body.strength,
                             '', // Remark is '' for taken dose, and 'ASSIGNED_DOSE' for assigned dosage
                             patientId,
                             '', // startDate
                             '', // endDate
                             '', // file_ID
                             '', // mon
                             '', // tue
                             '', // wed
                             '', // thu
                             '', // fri
                             '', // sat
                             ''); // sun
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

export { takeDosage };