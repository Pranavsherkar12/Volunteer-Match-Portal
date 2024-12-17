import express from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';

const APP = express();
APP.use(express.json());//middleware to process the request body

// Enable CORS for requests from http://localhost:5500
APP.use(cors({
    origin: 'http://127.0.0.1:5500'
  
}));

const PORT = 3200;

//Connection Object
const connectionConfig = createConnection({
    host: "localhost",
    user: "root",
    password: "cdac",
    database: "miniproject"
});

APP.get("/", (request, response) => {
    response.send("Welcome to Webistaan API");
});

//Create a new opportunity
APP.post("/create-opportunity", (request, response) => {
    try {
        const data = request.body;
        const insertQry = `INSERT INTO opportunities (title, description, category, location, date) VALUES (?, ?, ?, ?, ?)`;
        const values = [data.title, data.description, data.category, data.location, data.date];

        connectionConfig.query(insertQry, values, (error, result) => {
            if (error) {
                console.log(error);
                response.status(400).send({ message: "Error creating opportunity" });
            } else {
                response.status(201).send({ message: "Opportunity created successfully", id: result.insertId });
            }
        });
    } catch (error) {
        response.status(500).send({ message: "Internal server error" });
    }
});

// Fetch all opportunities
APP.get("/opportunities", (request, response) => {
    const category = request.query.category;
    let selectQry;
    
    //to check by category
    if (category) {
        selectQry = `SELECT * FROM opportunities WHERE category = ?`;
    } else {
        selectQry = `SELECT * FROM opportunities`;
    }
    
    connectionConfig.query(selectQry, [category], (error, results) => {
        if (error) {
            console.log(error);
            response.status(500).send({ message: "Error retrieving opportunities" });
        } else {
            response.status(200).send(results);
        }
    });
});

// Update opportunity by ID
APP.put("/update-opportunity/:id", (request, response) => {
    try {
        const { id } = request.params;
        const data = request.body;
        const updateQry = `UPDATE opportunities SET title = ?, description = ?, category = ?, location = ?, date = ? WHERE id = ?`;
        const values = [data.title, data.description, data.category, data.location, data.date, id];

        connectionConfig.query(updateQry, values, (error, result) => {
            if (error) {
                console.log(error);
                response.status(400).send({ message: "Error updating opportunity" });
            } else if (result.affectedRows === 0) {
                response.status(404).send({ message: "Opportunity not found" });
            } else {
                response.status(200).send({ message: "Opportunity updated successfully" });
            }
        });
    } catch (error) {
        response.status(500).send({ message: "Internal server error" });
    }
});

//  Delete opportunity by ID
APP.delete("/delete-opportunity/:id", (request, response) => {
    try {
        const { id } = request.params;
        const deleteQry = `DELETE FROM opportunities WHERE id = ?`;

        connectionConfig.query(deleteQry, [id], (error, result) => {
            if (error) {
                console.log(error);
                response.status(400).send({ message: "Error deleting opportunity" });
            } else if (result.affectedRows === 0) {
                response.status(404).send({ message: "Opportunity not found" });
            } else {
                response.status(200).send({ message: "Opportunity deleted successfully" });
            }
        });
    } catch (error) {
        response.status(500).send({ message: "Internal server error" });
    }
});

// Fetch unique categories
APP.get('/categories', (request, response) => {
    const query = 'SELECT DISTINCT category FROM opportunities';
    connectionConfig.query(query, (error, results) => {
        if (error) {
            console.log(error);
            response.status(500).send({ message: "Error retrieving categories" });
        } else {
            const categories = results.map(row => row.category); // Extract category names
            response.status(200).send(categories);
        }
    });
});


// Start server n connect to MySQL DB
APP.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    connectionConfig.connect((error) => {
        if (error) console.log(error);
        else console.log('Connected to MySQL database');
    });
});
