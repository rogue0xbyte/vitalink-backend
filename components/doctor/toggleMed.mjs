import express from "express";
import { Router } from "express";
import { client } from "../../services/databasepg.mjs"; // Import client from database service

import { readDosageByID, updateDosage, createDosage } from '../../services/databasepg.mjs'; // Assuming you have a function to toggle medication schedule for a patient
import { authenticateToken } from '../../services/middlewares.mjs'; // Assuming you have a middleware for authentication
const toggleTherapy = Router();

// Define a route to toggle therapy for a patient
toggleTherapy.put('/doctor/patient/toggle-therapy/:Patient_ID', async (req, res) => {
    try {
        const { stopped, StoppageReason, EndDate, Patient_ID } = req.body; // Extract other properties from request body

        // Retrieve patient dosage from the database
        const patDos = await readDosageByID(Patient_ID);
        const patientDosage = patDos[0];
        console.log("LALALALAIAMGAYLALALALA\n", patientDosage, "LALALAIAMNOTGAYANYMORELALALALA\n");
        patientDosage.Patient_ID = patientDosage.patient_id;
        

        // Toggle therapy based on the stopped attribute
        if (stopped) {
            await pauseTherapy(patientDosage);
            res.status(200).json({ message: 'Therapy stopped successfully' });
        } else {
            if (patientDosage.paused) {
                await startTherapy(patientDosage);
                res.status(200).json({ message: 'Therapy started successfully' });
            } else {
                res.status(400).json({ message: 'Therapy already ongoing' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


async function startTherapy(patientDosage) {
    const currentDate = new Date().toISOString().split('T')[0];
    const remark = patientDosage.paused ? 'RESUME_THERAPY' : 'START_THERAPY';

    // Update dosage in patients table
    await updateDosagePat(patientDosage.Patient_ID, currentDate, remark, patientDosage.EndDate);

    // Add dosage to dosages table
    await createDosage(patientDosage.Drug_Name, currentDate, patientDosage.Strength, remark, patientDosage.Patient_ID, currentDate, patientDosage.EndDate, patientDosage.File_ID, patientDosage.Monday, patientDosage.Tuesday, patientDosage.Wednesday, patientDosage.Thursday, patientDosage.Friday, patientDosage.Saturday, patientDosage.Sunday);
}

// Function to pause therapy
async function pauseTherapy(patientDosage) {
    const currentDate = new Date().toISOString().split('T')[0];

    // Update dosage in patients table
    await updateDosagePat(patientDosage.Patient_ID, currentDate, 'STOP_THERAPY', patientDosage.EndDate)

    // Update dosages table
    await updateDosage(patientDosage.Drug_Name, patientDosage.DateTime, patientDosage.Strength, 'STOP_THERAPY', patientDosage.StartDate, currentDate, patientDosage.File_ID, patientDosage.Monday, patientDosage.Tuesday, patientDosage.Wednesday, patientDosage.Thursday, patientDosage.Friday, patientDosage.Saturday, patientDosage.Sunday, patientDosage.Patient_ID);
}

async function updateDosagePat(Patient_ID, currentDate, remark, endDate) {
    const query = `
        UPDATE patients
        SET StoppageReason = $1, stopped = TRUE, EndDate = $2
        WHERE ID = $3
    `;
    const values = [remark, endDate, Patient_ID];
    await client.query(query, values);
}
export { toggleTherapy, client }; // Export client along with toggleTherapy
