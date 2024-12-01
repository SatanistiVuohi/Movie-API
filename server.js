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

app.get('/movies', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM movies')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching movies: ', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
})

app.get('/users', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users: ', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
})

app.get('/reviews', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM reviews')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching reviews: ', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
})

app.get('/favorites', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM favorites')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching favorites: ', error.message);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
})
//Dummy response even if this code already works well with connection and fetching data from the server
app.get('/jason', (req, res) => {
    res.json({name: 'Jason', surname: 'Voorhees', age: 40});
});