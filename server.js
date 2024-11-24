import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

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
        await client.query('SELECT * FROM movies');
        console.log('Connected to the database!');
    }
    catch (error) {
        console.log(error.message);
        
    }
}