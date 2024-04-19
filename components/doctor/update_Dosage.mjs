import express from "express";
import { Router } from "express";

import { updateDosage } from '../../services/databasepg.mjs'; // Assuming you have a function to update patient dosage
import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for authentication

const updatePatDosage = Router();

// Define a route to update dosage of a patient
updatePatDosage.put('/doctor/patient/update-dosage/:patientId', async (req, res) => { // Extract patient ID from the URL parameter
    try {
        // Extract dosage details from the request body
        const { Drug_Name,DateTime,Strength,Remark,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Patient_ID } = req.body;

        // Call function to update patient dosage in the database
        await updateDosage(Drug_Name,DateTime,Strength,Remark,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Patient_ID);

        // Send response indicating success
        res.status(200).json({ message: 'Patient dosage updated successfully' });
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { updatePatDosage };
