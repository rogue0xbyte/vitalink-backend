import express from "express";
import { Router } from "express";

import { createPatient } from '../../services/databasepg.mjs';
import { authenticateToken } from '../../services/middlewares.mjs';

const addPatientRoute = Router();

// Define a route to add a patient by a doctor
addPatientRoute.post('/doctor/add-patient', async (req, res) => {
    let ID; // Declare ID variable outside of the try block
    try {
        // Generate patient ID based on the current date
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const date = ('0' + now.getDate()).slice(-2);
        ID = `${year}PAT${month}${date}`;

        // Extract patient details from the request body
        const {Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate } = req.body;

        // Call function to add a patient to the database
        await createPatient(Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate);

        // Send response indicating success
        res.status(201).json({ message: 'Patient added successfully' });
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { addPatientRoute };
