import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const { Client } = pg;

app.listen(3001, () => {
    console.log('The server is running!');
});

const client = new Client({
    user: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD),
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
});

connect();

async function connect() {
    try {
        await client.connect();
        console.log('Connected to the database!');
    }
    catch (error) {
        console.log(error.message);

    }
}

app.get('/', (req, res) => {
    res.send('<h1>You have connected to the database!!</h1>')
})

// 1. Adding new movie genres

app.post('/add_genre', async (req, res) => {
    const { genre } = req.body;
    try {
        const query = 'INSERT INTO movies (genre) VALUES ($1)';
        await client.query(query, [genre]);
        res.status(201).json({ message: "Genre added successfully!" });
    } catch (error) {
        console.error('Error adding genre:', error.message);
    }
})
