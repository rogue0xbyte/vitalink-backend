const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Pool } = require("pg");
const crypto = require("crypto");
const http = require("http");
const path = require('path');


const app = express(); //One for GET POST OPUT GEDIT

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: false }));

const server = http.createServer(app);
dotenv.config();

// Database connection setup
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// Function to handle hashing
function hashPassword(password) {
  return crypto.createHash("sha512").update(password).digest("hex");
}

const port = process.env.PORT || 4502;

try
{
    app.get("/", ((req, res)=>{
    const { login, password } = req.body;
    console.log(login, password);
    res.json({details: "Welcome to the project"}); //response should always be at the last as the sesssion will be done
    })) //Just like flask we give a path then what is the method next is used in middleware
}catch(err)
{
    console.log(err);
}

// Route for handling user login
app.route("/login").all(async (req, res) => {
  if (req.method === "POST") {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const client = await pool.connect();

        if (username.includes("DOC")) {
            const doc_data = await client.query("SELECT * FROM doctor WHERE id = $1", [username]);
            if (doc_data.rows.password === hashPassword(password)) {
                session.logged_in = true;
                session.logged_in_as = "doctor";
                const pat = data_stub_instance.get_doctor_patients(cursor, username);
                const pats = pat.map(item => item[0]);
                const User = { type: "Doctor", category: doc_data[0], ID: doc_data[1], fullName: doc_data[2], PassHash: doc_data[3], PFP: doc_data[4], patients: pats };
                session.user = JSON.stringify(User);
                return 'welcome doc' // res.redirect("/doctor_home");
            }
        } else if (username.includes("PAT")) {
            const pat_data = await client.query("SELECT * FROM patients WHERE id = $1", [username]);
            let mypass = pat_data.rows[0].contact.replace("+91", "").split(" ")[1].trim();
            mypass = hashPassword(mypass);
            console.log(mypass, hashPassword(password), mypass === hashPassword(password))
            if (mypass === hashPassword(password)) {
                session.logged_in = true;
                session.patient = true;
                session.logged_in_as = "patient";
                const User = pat_data;
                session.user = JSON.stringify(User);
                res.json({'message':'welcome pat'})
            }
        } else {
            res.json({'message':'invalid login'})
        }
    } catch (error) {
        console.error("Error:", error);
        res.json({'message':'error 500'})
    }
  } else {
    res.sendFile(path.join(__dirname, "templates/generic/login.html"));
  }
});


app.listen(port, function(){
    console.log("Express.js app listening on port " + port);
})