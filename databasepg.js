import pg from 'pg';

const { Client } = pg;

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 8080, // default port for PostgreSQL
    password: "1234",
    database: "postgres",
    connectionTimeoutMillis: 5000, // 5 seconds connection timeout
    query_timeout: 10000, // 10 seconds query timeout
});


/*const { Pool } = pg;  the functions are not executed in chronological order , they are executed paralelly, which is an issue if 'pool' is used

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 8080, // default port for PostgreSQL
    password: "1234",
    database: "postgres",
    max: 20, // Maximum number of clients the pool should contain
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait in milliseconds when trying to connect a new client before timing out
});*/

// Function to connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to Client");
    } catch (err) {
        console.error(err.message);
    }
}

// Function to close the database connection and terminate the program
async function closeConnectionAndTerminate() {
    try {
        await client.end();
        console.log("Connection closed successfully");
        process.exit(0); // Terminate the program with exit code 0
    } catch (err) {
        console.error("Error closing connection:", err.message);
        process.exit(1); // Terminate the program with exit code 1 (indicating an error)
    }
}



// Clear the timeout if any activity occurs (e.g., database operation)
function resetTimeout() {
    clearTimeout(timeoutId); // Clear the previous timeout
    // Set a new timeout
    timeoutId = setTimeout(closeConnectionAndTerminate, timeoutMillis);
}

async function createTables() {
    try {
        
      
        // Create doctor table
        await client.query(`
            CREATE TABLE IF NOT EXISTS doctor (
                category VARCHAR(255),
                ID VARCHAR(255) PRIMARY KEY,
                fullName VARCHAR(255),
                PassHash VARCHAR(255),
                PFP VARCHAR(255)
            )
        `);

        // Create it table
        await client.query(`
            CREATE TABLE IF NOT EXISTS it (
                ID VARCHAR(255) PRIMARY KEY,
                fullName VARCHAR(255),
                PassHash VARCHAR(255),
                PFP VARCHAR(255)
            )
        `);

        // Create patients table
        await client.query(`
            CREATE TABLE IF NOT EXISTS patients (
                ID VARCHAR(255) PRIMARY KEY,
                Name VARCHAR(255),
                Contact VARCHAR(20),
                KinName VARCHAR(255),
                KinContact VARCHAR(20),
                Age INTEGER,
                Gender VARCHAR(10),
                DrugType VARCHAR(255),
                DrugStrength VARCHAR(50),
                BeforeFood BOOLEAN,
                AfterFood BOOLEAN,
                Morning BOOLEAN,
                Afternoon BOOLEAN,
                Night BOOLEAN,
                Monday VARCHAR(255),
                Tuesday VARCHAR(255),
                Wednesday VARCHAR(255),
                Thursday VARCHAR(255),
                Friday VARCHAR(255),
                Saturday VARCHAR(255),
                Sunday VARCHAR(255),
                MisdoseAlert BOOLEAN,
                NextTestDate VARCHAR(50),
                StartDate VARCHAR(50),
                TargetINR VARCHAR(255),
                MinINR VARCHAR(255),
                MaxINR VARCHAR(255),
                StoppageReason VARCHAR(255),
                Doctor_ID VARCHAR(255) REFERENCES doctor(ID),
                CareTaker_ID VARCHAR(255),
                stopped BOOLEAN,
                EndDate VARCHAR(50)
            )
        `);

        // Create files table
        await client.query(`
            CREATE TABLE IF NOT EXISTS files (
                ID SERIAL PRIMARY KEY,
                FileName VARCHAR(255),
                FilePath VARCHAR(255),
                Type VARCHAR(50)
            )
        `);


        // Create dosage table
        await client.query(`
            CREATE TABLE IF NOT EXISTS dosage (
                ID SERIAL PRIMARY KEY,
                Drug_Name VARCHAR(255),
                DateTime VARCHAR(255),
                Strength VARCHAR(50),
                Remark VARCHAR(255),
                Patient_ID VARCHAR(255) REFERENCES patients(ID),
                StartDate VARCHAR(50),
                EndDate VARCHAR(50),
                File_ID INTEGER REFERENCES files(ID),
                Monday VARCHAR(255),
                Tuesday VARCHAR(255),
                Wednesday VARCHAR(255),
                Thursday VARCHAR(255),
                Friday VARCHAR(255),
                Saturday VARCHAR(255),
                Sunday VARCHAR(255)
            )
        `);

        // Create inr_levels table
        await client.query(`
            CREATE TABLE IF NOT EXISTS inr_levels (
                ID SERIAL PRIMARY KEY,
                Level VARCHAR(255),
                DateTime VARCHAR(255),
                Patient_ID VARCHAR(255) REFERENCES patients(ID),
                File_ID INTEGER REFERENCES files(ID)
            )
        `);

        // Create reports table
        await client.query(`
            CREATE TABLE IF NOT EXISTS reports (
                Report_ID SERIAL PRIMARY KEY,
                Type VARCHAR(255),
                Details VARCHAR(255),
                Patient_ID VARCHAR(255) REFERENCES patients(ID),
                DateTime VARCHAR(255),
                startdate VARCHAR(255),
                enddate VARCHAR(255),
                Location VARCHAR(255),
                LabName VARCHAR(255),
                File_ID INTEGER REFERENCES files(ID)
            )
        `);

        console.log("Tables created successfully!");
    } catch (err) {
        console.error(err.message);
    } 
}
async function dropAllTables() {
    try {
       

        // Drop reports table
        await client.query(`
            DROP TABLE IF EXISTS reports
        `);

        // Drop inr_levels table
        await client.query(`
            DROP TABLE IF EXISTS inr_levels
        `);

        // Drop dosage table
        await client.query(`
            DROP TABLE IF EXISTS dosage
        `);

        // Drop files table
        await client.query(`
            DROP TABLE IF EXISTS files
        `);

        // Drop patients table
        await client.query(`
            DROP TABLE IF EXISTS patients
        `);

        // Drop IT table
        await client.query(`
            DROP TABLE IF EXISTS it
        `);

        // Drop doctor table
        await client.query(`
            DROP TABLE IF EXISTS doctor
        `);

        console.log("All tables dropped successfully!");
    } catch (err) {
        console.error("Error dropping tables:", err.message);
    } 
}
async function createDoctor(category, ID, fullName, passHash, PFP) {
    //let client;
    try {
        //client = await pool.connect();
        
        const query = `
            INSERT INTO doctor (category, ID, fullName, PassHash, PFP) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [category, ID, fullName, passHash, PFP];
        const result = await client.query(query, values);

        console.log("Doctor created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating doctor:", err.message);
    } /*finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }*/
}

async function readDoctorByID(ID) {
    //let client;
    try {
        //client = await pool.connect();
        const query = `
            SELECT * FROM doctor
            WHERE ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("Doctor found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Doctor not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading doctor:", err.message);
    } /*finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }*/
}
async function readAllDoctors() {
    //let client;
    try {
        //client = await pool.connect();
        const query = `
            SELECT * FROM doctor
            ORDER BY ID
        `;
        const result = await client.query(query);

        if (result.rows.length > 0) {
            console.log("Doctor found:", result.rows);
            return result.rows;
        } else {
            console.log("Doctor table empty");
            return null;
        }
    } catch (err) {
        console.error("Error reading doctor:", err.message);
    } /*finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }*/
}

async function updateDoctor(ID, category, fullName, passHash, PFP) {

    try {
        
        
        const query = `
            UPDATE doctor
            SET category = $1, fullName = $2, PassHash = $3, PFP = $4
            WHERE ID = $5
            RETURNING *
        `;
        const values = [category, fullName, passHash, PFP, ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Doctor updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Doctor not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating doctor:", err.message);
    } 
}

async function deleteDoctor(ID) {
    //let client;
    try {
        //client = await pool.connect();
       
        const query = `
            DELETE FROM doctor
            WHERE ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("Doctor deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Doctor not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting doctor:", err.message);
    } /*finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }*/
}

async function createIT(ID, fullName, passHash, PFP) {
    try {
        

        const query = `
            INSERT INTO it (ID, fullName, PassHash, PFP) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [ID, fullName, passHash, PFP];
        const result = await client.query(query, values);

        console.log("IT staff created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating IT staff:", err.message);
    } 
}

async function readITByID(ID) {
    try {
        

        const query = `
            SELECT * FROM it
            WHERE ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("IT staff found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("IT staff not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading IT staff:", err.message);
    } 
}

async function updateIT(ID, fullName, passHash, PFP) {
    try {
        

        const query = `
            UPDATE it
            SET fullName = $1, PassHash = $2, PFP = $3
            WHERE ID = $4
            RETURNING *
        `;
        const values = [fullName, passHash, PFP, ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("IT staff updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("IT staff not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating IT staff:", err.message);
    } 
}

async function deleteIT(ID) {
    try {
        

        const query = `
            DELETE FROM it
            WHERE ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("IT staff deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("IT staff not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting IT staff:", err.message);
    } 
}

async function createPatient(patientData) {
    try {
        

        const query = `
            INSERT INTO patients (ID, Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
            RETURNING *
        `;
        const values = [ID, Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate];
        const result = await client.query(query, values);

        console.log("Patient created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating patient:", err.message);
    } 
}

async function readPatientByID(ID) {
    try {
        

        const query = `
            SELECT * FROM patients
            WHERE ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("Patient found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading patient:", err.message);
    } 
}
async function readDoctorPatients(DoctorID) {
    try {
        

        const query = `
            SELECT * FROM patients
            WHERE Doctor_ID = $1 or CareTaker_ID = $2
        `;
        const result = await client.query(query, [DoctorID,DoctorID]);

        if (result.rows.length > 0) {
            console.log("Patient found:", result.rows);
            return result.rows;
        } else {
            console.log("Patient not found with Doctor_ID:", DoctorID);
            return null;
        }
    } catch (err) {
        console.error("Error reading patient:", err.message);
    } 
}
async function readMaxPatient() {
    try {
        

        const query = `
            SELECT MAX(ID) FROM patients
        `;
        const result = await client.query(query);

        if (result.rows.length > 0) {
            console.log("Patient found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient table empty:");
            return null;
        }
    } catch (err) {
        console.error("Error reading patient:", err.message);
    } 
}

async function updatePatient(Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate,ID) {
    try {
        

        const query = `
            UPDATE patients
            SET Name = $1, Contact = $2, KinName = $3, KinContact = $4, Age = $5, Gender = $6, DrugType = $7, DrugStrength = $8, BeforeFood = $9, AfterFood = $10, Morning = $11, Afternoon = $12, Night = $13, Monday = $14, Tuesday = $15, Wednesday = $16, Thursday = $17, Friday = $18, Saturday = $19, Sunday = $20, MisdoseAlert = $21, NextTestDate = $22, StartDate = $23, TargetINR = $24, MinINR = $25, MaxINR = $26, StoppageReason = $27, Doctor_ID = $28, CareTaker_ID = $29, stopped = $30, EndDate = $31
            WHERE ID = $32
            RETURNING *
        `;
        const values = [Name, Contact, KinName, KinContact, Age, Gender, DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, MisdoseAlert, NextTestDate, StartDate, TargetINR, MinINR, MaxINR, StoppageReason, Doctor_ID, CareTaker_ID, stopped, EndDate,ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Patient updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating patient:", err.message);
    } 
}
async function updatePatientDrugs(DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, ID) {
    try {
        

        const query = `
            UPDATE patients
            SET DrugType = $1, DrugStrength = $2, BeforeFood = $3, AfterFood = $4, Morning = $5, Afternoon = $6, Night = $7, Monday = $8, Tuesday = $9, Wednesday = $10, Thursday = $11, Friday = $12, Saturday = $13, Sunday = $14
            WHERE ID = $15
            RETURNING *
        `;
        const values = [DrugType, DrugStrength, BeforeFood, AfterFood, Morning, Afternoon, Night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Patient updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating patient:", err.message);
    } 
}
async function togMedSchedPatient(StoppageReason, stopped, EndDate,ID) {
    try {
        

        const query = `
            UPDATE patients
            SET StoppageReason = $1, stopped = $2, EndDate = $3
            WHERE ID = $4
            RETURNING *
        `;
        const values = [StoppageReason, stopped, EndDate,ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Patient updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating patient:", err.message);
    } 
}
async function updatePatientDoctor(Doctor_ID) {
    try {
        

        const query = `
            UPDATE patients
            SET Doctor_ID = NULL
            WHERE Doctor_ID = $4
            RETURNING *
        `;
        const result = await client.query(query, [Doctor_ID]);

        if (result.rows.length > 0) {
            console.log("Patient updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", Doctor_ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating patient:", err.message);
    } 
}
async function updatePatientCaretaker(ID,CareTakerID) {
    try {
        

        const query = `
            UPDATE patients
            SET CareTaker_ID = $1
            WHERE ID = $2
            RETURNING *
        `;
        const result = await client.query(query, [CareTakerID, ID]);

        if (result.rows.length > 0) {
            console.log("Patient updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating patient:", err.message);
    } 
}
async function deletePatient(ID) {
    try {
        

        const query = `
            DELETE FROM patients
            WHERE ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("Patient deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Patient not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting patient:", err.message);
    } 
}
async function createINRLevel(Level, DateTime, Patient_ID, File_ID) {
    try {
        

        const query = `
            INSERT INTO inr_levels (Level, DateTime, Patient_ID, File_ID) 
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [Level, DateTime, Patient_ID, File_ID];
        const result = await client.query(query, values);

        console.log("INR Level created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating INR Level:", err.message);
    } 
}

async function readINRLevelByID(Patient_ID) {
    try {
        

        const query = `
            SELECT * FROM inr_levels
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("INR Level found:", result.rows);
            return result.rows;
        } else {
            console.log("INR Level not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading INR Level:", err.message);
    } 
}
async function readTodayaINRLevelByID(Patient_ID) {
    try {
        const moment = require('moment-timezone');

        // Assuming IST is 'Asia/Kolkata' time zone
        const IST = 'Asia/Kolkata';

        const currentDate = moment().tz(IST).format('YYYY-MM-DD');
        const currentDateWithPercentage = currentDate + '%';

        //console.log(currentDate);
        //console.log(currentDateWithPercentage);


        const query = `
            SELECT * FROM inr_levels 
            WHERE Patient_ID = $1 AND (DateTime = $2 OR DateTime LIKE $3)
        `;
        const result = await client.query(query, [Patient_ID,currentDate,currentDateWithPercentage]);

        if (result.rows.length > 0) {
            console.log("INR Level found:", result.rows);
            return result.rows;
        } else {
            console.log("INR Level not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading INR Level:", err.message);
    } 
}

async function updateINRLevel(Level, DateTime, File_ID, Patient_ID) {
    try {
        

        const query = `
            UPDATE inr_levels
            SET Level = $1, DateTime = $2, Patient_ID = $3, File_ID = $4
            WHERE Patient_ID = $5
            RETURNING *
        `;
        const values = [Level, DateTime, File_ID, Patient_ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("INR Level updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("INR Level not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating INR Level:", err.message);
    } 
}

async function deleteINRLevel(Patient_ID) {
    try {
        

        const query = `
            DELETE FROM inr_levels
            WHERE Patient_ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("INR Level deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("INR Level not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting INR Level:", err.message);
    } 
}
async function createDosage(Drug_Name,DateTime,Strength,Remark,Patient_ID,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday) {
    try {
        

        const query = `
            INSERT INTO dosage (Drug_Name, DateTime, Strength, Remark, Patient_ID, StartDate, EndDate, File_ID, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        const values = [Drug_Name,DateTime,Strength,Remark,Patient_ID,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday];
        const result = await client.query(query, values);

        console.log("Dosage created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating dosage:", err.message);
    } 
}

async function readDosageByID(Patient_ID) {
    try {
        

        const query = `
            SELECT * FROM dosage
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("Dosage found:", result.rows);
            return result.rows;
        } else {
            console.log("Dosage not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading dosage:", err.message);
    } 
}

async function updateDosage(Drug_Name,DateTime,Strength,Remark,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Patient_ID) {
    try {
        

        const query = `
            UPDATE dosage
            SET Drug_Name = $1, DateTime = $2, Strength = $3, Remark = $4, StartDate = $5, EndDate = $6, File_ID = $7, Monday = $8, Tuesday = $9, Wednesday = $10, Thursday = $11, Friday = $12, Saturday = $13, Sunday = $14
            WHERE Patient_ID = $15
            RETURNING *
        `;
        const values = [Drug_Name,DateTime,Strength,Remark,StartDate,EndDate,File_ID,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Patient_ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Dosage updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Dosage not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating dosage:", err.message);
    } 
}

async function deleteDosage(Patient_ID) {
    try {
        

        const query = `
            DELETE FROM dosage
            WHERE Patient_ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("Dosage deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Dosage not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting dosage:", err.message);
    } 
}
async function createReport(Type, Details, Patient_ID, DateTime, startdate, enddate, Location, LabName, File_ID) {
    try {
        

        const query = `
            INSERT INTO reports (Type, Details, Patient_ID, DateTime, startdate, enddate, Location, LabName, File_ID) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [Type, Details, Patient_ID, DateTime, startdate, enddate, Location, LabName, File_ID];
        const result = await client.query(query, values);

        console.log("Report created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating report:", err.message);
    } 
}

async function readReportByID(Patient_ID) {
    try {
        

        const query = `
            SELECT * FROM reports
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("Report found:", result.rows);
            return result.rows;
        } else {
            console.log("Report not found with ID:", Report_ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading report:", err.message);
    } 
}
async function readMedicalHistory(Patient_ID) {
    try {
        

        const query = `
            SELECT * FROM reports
            WHERE Patient_ID = $1 AND Type = 'Medical History'
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("Medical History found:", result.rows);
            return result.rows;
        } else {
            console.log("Medical History not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading report:", err.message);
    } 
}
async function updateReport(Patient_ID, type, details, patient_id, datetime, startdate, enddate, location, labname, file_id) {
    try {
        

        const query = `
            UPDATE reports
            SET Type = $1, Details = $2, DateTime = $3, startdate = $4, enddate = $5, Location = $6, LabName = $7, File_ID = $8
            WHERE Patient_ID = $9
            RETURNING *
        `;
        const values = [type,details,datetime,startdate, enddate,location,labname,file_id,patient_id];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Report updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Report not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating report:", err.message);
    } 
}

async function deleteReport(Patient_ID) {
    try {
        

        const query = `
            DELETE FROM reports
            WHERE Patient_ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [Patient_ID]);

        if (result.rows.length > 0) {
            console.log("Report deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("Report not found with ID:", Patient_ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting report:", err.message);
    } 
}
async function createFile(fileName, filePath, type) {
    try {
        

        const query = `
            INSERT INTO files (FileName, FilePath, Type) 
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [fileName, filePath, type];
        const result = await client.query(query, values);

        console.log("File created successfully:", result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error("Error creating file:", err.message);
    } 
}

async function readFileByID(ID) {
    try {
        

        const query = `
            SELECT * FROM files
            WHERE ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("File found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("File not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading file:", err.message);
    } 
}
async function getFileID(filename) {
    try {
        
        //This is to get the ID form the files table of the currently stored file to store in other table with FileID field
        const query = `
            SELECT ID FROM files
            WHERE FileName = $1
        `;
        const result = await client.query(query, [filename]);

        if (result.rows.length > 0) {
            console.log("File found:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("File not found with ID:", filename);
            return null;
        }
    } catch (err) {
        console.error("Error reading file:", err.message);
    } 
}

async function updateFile(ID, fileName, filePath, type) {
    try {
        

        const query = `
            UPDATE files
            SET FileName = $1, FilePath = $2, Type = $3
            WHERE ID = $4
            RETURNING *
        `;
        const values = [fileName, filePath, type, ID];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("File updated successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("File not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error updating file:", err.message);
    } 
}

async function deleteFile(ID) {
    try {
        

        const query = `
            DELETE FROM files
            WHERE ID = $1
            RETURNING *
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("File deleted successfully:", result.rows[0]);
            return result.rows[0];
        } else {
            console.log("File not found with ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error deleting file:", err.message);
    } 
}
async function closeConnection() {
    try {
        await client.end();
        console.log("Connection closed successfully");
    } catch (err) {
        console.error("Error closing connection:", err.message);
    }
}


async function getDosageFile(ID) {
    try {
        
        //This is to get the ID form the files table of the currently stored file to store in other table with FileID field
        const query = `
            SELECT File_ID FROM dosage
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("File_ID found:", result.rows);
            return result.rows;
        } else {
            console.log("File_ID not found with Patient_ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading file:", err.message);
    } 
}

async function getINRFile(ID) {
    try {
        
        //This is to get the ID form the files table of the currently stored file to store in other table with FileID field
        const query = `
            SELECT File_ID FROM inr_levels
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("File_ID found:", result.rows);
            return result.rows;
        } else {
            console.log("File_ID not found with Patient_ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading file:", err.message);
    } 
}

async function getReportsFile(ID) {
    try {
        
        //This is to get the ID form the files table of the currently stored file to store in other table with FileID field
        const query = `
            SELECT File_ID FROM reports
            WHERE Patient_ID = $1
        `;
        const result = await client.query(query, [ID]);

        if (result.rows.length > 0) {
            console.log("File_ID found:", result.rows);
            return result.rows;
        } else {
            console.log("File_ID not found with Patient_ID:", ID);
            return null;
        }
    } catch (err) {
        console.error("Error reading file:", err.message);
    } 
}
//createTables();
// Connect to the database
connectToDatabase();

// Set a timeout to close the connection and terminate the program after 30 seconds of inactivity
const timeoutMillis = 3000; // 3 seconds
const timeoutId = setTimeout(closeConnectionAndTerminate, timeoutMillis);
//JUST call the functions after this , no need to call close after that

//readAllDoctors();
//readDoctorByID("DOC000013");
//readDoctorPatients("DOC00007")
//updateDoctor("DOC00001","Eswaran","oidjfodis","23424");

//deleteDoctor("DOC00007");
