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
};

app.get('/', (req, res) => {
    res.send('<h1>You have connected to the database!!</h1>')
});

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
});

// 2. Adding new movies with properties

app.post('/add_movie', async (req, res) => {
    const { movie_name, year, genre } = req.body;

    try {
        const query = 'INSERT INTO movies (movie_name, year, genre) VALUES ($1, $2, $3) RETURNING *;';
        const result = await client.query(query, [movie_name, year, genre]);

        res.status(201).json({
            message: "Movie added successfully!",
            movie: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding movie:', error.message);
    }
});

// 3. Registering a new user 

app.post('/add_user', async (req, res) => {
    const { name, username, password, year_of_birth } = req.body;

    try {
        const query = 'INSERT INTO users (name, username, password, year_of_birth) VALUES ($1, $2, $3, $4) RETURNING *;';
        const result = await client.query(query, [name, username, password, year_of_birth]);

        res.status(201).json({
            message: "User registered successfully!",
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
    }
});

// 4. Getting movies by id

app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM movies WHERE movie_id = $1';
        const result = await client.query(query, [id]);

        res.status(200).json({
            message: "Movie retrieved successfully!",
            movie: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching movie:', error.message);
    }
});

// 5. Removing movies by id
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteMovie = 'DELETE FROM movies WHERE movie_id = $1';
        await client.query(deleteMovie, [id]);

        res.status(200).json({
            message: "Movie deleted successfully!"
        })
    } catch (error) {
        console.error('Error deleting movie:', error.message);
    }
});

// 6. Getting all movies
app.get('/movies', async (req, res) => {
    const { page = 1 } = req.query;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    try {
        const query = 'SELECT * FROM movies ORDER BY movie_id LIMIT $1 OFFSET $2';
        const result = await client.query(query, [pageSize, offset]);

        const countQuery = 'SELECT COUNT(*) AS total_movies FROM movies';
        const countResult = await client.query(countQuery);
        const totalMovies = parseInt(countResult.rows[0].total_movies, 10);
        const totalPages = Math.ceil(totalMovies / pageSize);

        res.status(200).json({
            message: "Movies retrieved successfully!",
            movies: result.rows,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages,
                totalMovies,
                pageSize
            }});
    } catch (error) {
        console.error('Error fetching movies: ', error.message);
    }
});

// 7. Getting movies by keyword.
app.get('/movies/search/:keywords', async (req, res) => {
    const { keywords } = req.params;

    try {
        const query = 'SELECT * FROM movies WHERE keywords ILIKE $1';
        const result = await client.query(query, [`%${keywords}%`]);

        res.status(200).json({
            message: "Movies retrieved successfully!",
            movies: result.rows
        });
    } catch (error) {
        console.error('Error fetching movies:', error.message);
    }
});