import { connectToDatabase, closeConnectionAndTerminate, resetTimeout, createTables, dropAllTables, createDoctor, readDoctorByID, readAllDoctors, updateDoctor, deleteDoctor, createIT, readITByID, updateIT, deleteIT, createPatient, readPatientByID, readDoctorPatients, readMaxPatient, updatePatient, updatePatientDrugs, togMedSchedPatient, updatePatientDoctor, updatePatientCaretaker, deletePatient, createINRLevel, readINRLevelByID, readTodayaINRLevelByID, updateINRLevel, deleteINRLevel, createDosage, readDosageByID, updateDosage, deleteDosage, createReport, readReportByID,readMedicalHistory, updateReport, deleteReport, createFile, readFileByID, getFileID, updateFile, deleteFile, getReportsFile, getINRFile, getDosageFile, closeConnection } from './databasepg.js';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns';

// Function to add a new doctor to the system
async function addDoctor(cat, id, name, password = "password") {
    try {
        // Connect to the database
        await connectToDatabase();
        // Replace newline characters in the password
        password = password.replace("\n", "");

        // Compute the SHA-512 hash of the password
        const passHash = crypto.createHash('sha512').update(password).digest('hex');

        // Insert the doctor into the database
        await createDoctor(cat, id, name, passHash, "/static/images/empty_user.jpg");

        // Retrieve information about the newly added doctor and their patients
        const temp = await readDoctorByID(id);
        const t2 = await readDoctorPatients(id);
        let tt =[]
        for(let i=0;i<t2.length;i++){
            tt.push(t2[i]["id"])
        }
        // Doctor information
        const doctor = {
            'type': "Doctor",
            'category': temp["category"],
            'ID': temp["id"],
            'fullName': temp["fullname"],
            'PassHash': temp["passhash"],
            "PFP": temp["pfp"],
            "patients": tt
        };

        // Close the database cursor
        await closeConnectionAndTerminate();

        return doctor;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

async function addIT(id, name, password) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Replace newline characters in the password
        password = password.replace("\n", "");

        // Compute the SHA-512 hash of the password
        const passHash = crypto.createHash('sha512').update(password).digest('hex');

        // Insert the IT professional into the database
        await createIT(id, name, passHash, "/static/images/empty_user.jpg");

        // Retrieve information about the newly added IT professional
        const temp = await readITByID(id);

        // IT professional information
        const itProf = {
            'type': "IT",
            'category': "IT",
            'ID': temp["id"],
            'fullName': temp["fullname"],
            'PassHash': temp["passhash"],
            "PFP": temp[pfp]
        };

        // Close the database cursor
        await closeConnectionAndTerminate();

        return itProf;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}
async function removeUser(id) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Check the ID prefix and perform the corresponding deletion operation
        if (id.includes("IT")) {
            await deleteIT(id);
        } else if (id.includes("DOC")) {
            await updatePatientDoctor(id);
            await deleteDoctor(id);
        } else if (id.includes("PAT")) {
            let t1 = await getDosageFile(id);
            let t2 = await getINRFile(id);
            let t3 = await getReportsFile(id);
            await deleteReport(id);
            await deleteINRLevel(id);
            await deleteDosage(id);
            await deletePatient(id);
            for (let i=0;i<t1.length;i++)
            {
                await deleteFile(t1[i]["File_ID"]);
            }
            for (let i=0;i<t2.length;i++)
            {
                await deleteFile(t2[i]["File_ID"]);
            }
            for (let i=0;i<t3.length;i++)
            {
                await deleteFile(t3[i]["File_ID"]);
            }
        }

        // Close the database connection
        await closeConnectionAndTerminate();
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}


async function addPatient(DOC_ID, Name, History, Contact, Kin, Kin_cont, age, gender, ID, therapy, strength, bf, af, mor, after, night, days=[], StartDate='', TargetINR='0 - 0', EndDate='') {
    try {
        // Connect to the database
        await connectToDatabase();

        // Convert days array into structured format
        const drugSchedule = days.reduce((acc, [day, amount]) => {
            acc[day] = amount;
            return acc;
        }, {});

        // Extract MinINR and MaxINR from TargetINR
        const [MinINR, MaxINR] = TargetINR.split(' - ');

        // Insert patient information into the database
        await createPatient(ID, Name, Contact, Kin, Kin_cont, age, gender, therapy, strength, bf, af, mor, after, night, drugSchedule.MON, drugSchedule.TUE, drugSchedule.WED, drugSchedule.THU, drugSchedule.FRI, drugSchedule.SAT, drugSchedule.SUN, false, "UNSCHEDULED", StartDate, TargetINR, MinINR, MaxINR, "", DOC_ID, "", false, EndDate);

        // Insert medical history into the database
        for (const item of History) {
            await createReport("Medical History", item.condition, ID, item.duration, "", "", "", "", "");
        }

        // Retrieve patient information and medical history
        const temp = await readPatientByID(ID);
        const reports= await readReportByID(ID);
        const medicalHistory = await readMedicalHistory(ID);
        // Construct patient object
        const patient = {
            type: "Patient",
            Name: temp["Name"],
            Contact: temp["Contact"],
            Kin_name: temp["KinName"],
            Kin_Contact: temp["KinContact"],
            Age: temp["Age"],
            Gender: temp["Gender"],
            Patient_ID: temp["ID"],
            Drug: {
                type: temp["DrugType"],
                strength: temp["DrugStrength"],
                before_food: temp["BeforeFood"],
                after_food: temp["AfterFood"],
                morning: temp["Morning"],
                afternoon: temp["Afternoon"],
                night: temp["Night"],
                days: [
                    ["MON", temp["Monday"]],
                    ["TUE", temp["Tuesday"]],
                    ["WED", temp["Wednesday"]],
                    ["THU", temp["Thursday"]],
                    ["FRI", temp["Friday"]],
                    ["SAT", temp["Saturday"]],
                    ["SUN", temp["Sunday"]]
                ]
            },
            medical_history: medicalHistory,
            inr_levels: [],
            reports: reports,
            misdose_alert: temp["MisdoseAlert"],
            dosages: [],
            next_test_date: temp["NextTestDate"],
            start_date: temp["StartDate"],
            target_inr: temp["TargetINR"],
            StoppageReason: temp["StoppageReason"],
            Doctor_ID: temp["Doctor_ID"],
            CareTaker_ID: temp["CareTaker_ID"],
            stopped: temp["stopped"],
            EndDate: temp["EndDate"]
        };

        // Close the database connection
        await closeConnectionAndTerminate();

        // Return the patient object
        return patient;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

async function assignCaretaker(patientID, docID) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Update caretaker information for the specified patient in the database
        await updatePatientCaretaker(patientID, docID);

        // Close the database connection
        await closeConnectionAndTerminate();

        // Return true if the caretaker is successfully assigned
        return true;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

async function addPatientReport(PID, repType, details, datetime = "", file = "") {
    try {
        // Connect to the database
        await connectToDatabase();

        // Extract the last filename from the file path
        const Filename = file.substring(file.lastIndexOf("/") + 1);
        await createFile(Filename, file, "Report")
        const fid = await getFileID(Filename)
        // Insert the report into the database
        await createReport(repType, details, PID, datetime, "", "", "", "", fid);

        // Close the database connection
        await closeConnectionAndTerminate();

        // Create a report object
        const report = { type: repType, details };

        // Return the report object
        return report;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

async function addDosage(PID, Drug, amt, Date, rmk = "", start = "", end = "", file = "/", mon = "", tue = "", wed = "", thur = "", fri = "", sat = "", sun = "") {
    try {
        // Connect to the database
        await connectToDatabase();

        // Extract the last filename from the file path
        const Filename = file.substring(file.lastIndexOf("/") + 1);
        await createFile(Filename, file, "Dosage")
        const fid = await getFileID(Filename)

        // Insert dosage information into the database
        await createDosage(Drug, Date, amt, rmk, PID, start, end, fid, mon, tue, wed, thur, fri, sat, sun);


        // Create a dosage object
        const dose = await readDosageByID(PID);

        // Close the database connection
        await closeConnectionAndTerminate();

        // Return the dosage object
        return dose;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

async function updateINR(PID, level, location, labName, file, datetimeValue = moment.tz('Asia/Kolkata').format()) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Extract the last filename from the file path
        const Filename = file.substring(file.lastIndexOf("/") + 1);
        await createFile(Filename, file, "INRLevel")
        const fid = await getFileID(Filename)

        // Insert INR levels information into the database
        await createINRLevel(level, datetimeValue, PID, fid);
        await createReport("INRLevel", level, PID, datetimeValue, "", "", location, labName, fid);
        
        // Close the database connection
        await closeConnectionAndTerminate();

        // Return true indicating successful update of INR levels
        return true;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}



async function listMissedDoses(PID) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get current date
        const today = new Date().toISOString();

        // Get patient information
        const patient = await readPatientByID(PID);

        // Extract start date from patient information
        const { parse } = require('date-fns');
        const input_date = parse(patient["StartDate"], 'dd MMMM \'yy', new Date());

        const input_day = input_date.getDate();
        const input_year = input_date.getFullYear();
        const input_month = input_date.getMonth() + 1;
        const cal = `${input_year}-${input_month}-${input_day}T00:00:00`;
        const { parseISO } = require('date-fns');
        const start_date = parseISO(cal);

        // Calculate days elapsed since start date
        let dayDelt = Math.ceil((today - start_date) / (1000 * 60 * 60 * 24));

        // Limit days elapsed to 7
        if (dayDelt > 7) {
            dayDelt = 8;
            start_date.setDate(today.getDate() - 8);
        }

        const dates = [];
        const prescribedDays = [];

        // Determine prescribed days
        if (patient["Monday"].trim() !== "") prescribedDays.push("Monday");
        if (patient["Tuesday"].trim() !== "") prescribedDays.push("Tuesday");
        if (patient["Wednesday"].trim() !== "") prescribedDays.push("Wednesday");
        if (patient["Thursday"].trim() !== "") prescribedDays.push("Thursday");
        if (patient["Friday"].trim() !== "") prescribedDays.push("Friday");
        if (patient["Saturday"].trim() !== "") prescribedDays.push("Saturday");
        if (patient["Sunday"].trim() !== "") prescribedDays.push("Sunday");

        // Generate list of missed doses
        for (let i = 2; i <= dayDelt; i++) {
            const nextDate = new Date(start_date);
            nextDate.setDate(start_date.getDate() + i);
            if (prescribedDays.includes(nextDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase())) {
                dates.push(nextDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' }));
            }
        }

        // Get dosage information
        const doses = await readDosageByID(PID);

        // Remove dates with dosages administered
        for (const dosage of doses) {
            if (dosage["DateTime"]) {
                const { parseISO } = require('date-fns');
                const dosedate = parseISO(dosage["DateTime"].replace("I", ""));
                const dosage_date = dosedate.getDate() + '-' + (dosedate.getMonth() + 1) + '-' + dosedate.getFullYear().toString().substr(-2);
                const index = dates.indexOf(dosage_date);
                if (index !== -1) {
                    dates.splice(index, 1);
                }
            }
        }
        // Close the database connection
        await closeConnectionAndTerminate();

        // Return reversed list of missed doses
        return dates.reverse();
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}


function getMyWeek() {
    const today = new Date().toISOString();;
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 }); // Assuming Monday is the start of the week

    const dates = [];
    let currentDate = startOfWeekDate;
    while (currentDate <= endOfWeekDate) {
        // Format the date as "dd-MM-yy"
        dates.push(format(currentDate, 'dd-MM-yy'));
        // Move to the next day
        currentDate = addDays(currentDate, 1);
    }

    return dates;
}

async function toggleMedSched(PID, StopReas = "") {
    try {
        // Connect to the database
        await connectToDatabase();
        const EndDate = new Date().toISOString();;
        const patient = await readPatientByID(PID);  
        const stopVal = true;      
        if (patient["stopped"]){
            stopVal = false;
        }
        await togMedSchedPatient(StopReas, stopVal, EndDate, PID );

        // Close the database connection
        await closeConnectionAndTerminate();

        // Return true indicating toggling MedSched
        return true;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error
    }
}

//addDoctor("Cardiologist", "DOC000014", "Soobs");
export { addDoctor, addIT, removeUser, addPatient, assignCaretaker, addPatientReport, addDosage, updateINR, listMissedDoses, getMyWeek, toggleMedSched };
