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
        const result = await client.query(deleteMovie, [id]);

        if (!result.rows.length) {
            return res.status(404).json({
                message: "Movie not found. No movie was deleted."
            });
        }
        res.status(200).json({
            message: "Movie deleted successfully!",
            deletedMovie: result.rows[0]
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
            }
        });
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

// 8. Adding a movie review.
app.post('/add_review', async (req, res) => {
    const { username, stars, review_text, movie_id } = req.body;

    try {
        const query = 'INSERT INTO reviews (user_id, movie_id, stars, review_text) SELECT user_id, $2, $3, $4 FROM users where username = $1 RETURNING *';
        const result = await client.query(query, [username, movie_id, stars, review_text]);

        res.status(201).json({
            message: "Review added successfully!",
            review: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding review:', error.message);
    }
});

// 9. Adding favorite movie for user
app.post('/add_favorite', async (req, res) => {
    const { username, movie_id } = req.body;

    try {
        const query = 'INSERT INTO favorites (user_id, movie_id) SELECT u.user_id, m.movie_id FROM users u JOIN movies m on m.movie_id = $1 WHERE u.username = $2 RETURNING *';
        const result = await client.query(query, [movie_id, username]);

        res.status(201).json({
            message: "Favorite movie added successfully!",
            favorite: result.rows[0]
        })
    } catch (error) {
        console.error('Error adding favorite movie:', error.message);
    }
});

// 10. Getting favorite movies by username.
app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const query = 'SELECT m.movie_id, m.movie_name, m.year, m.genre, m.keywords FROM favorites f JOIN users u ON u.user_id = f.user_id JOIN movies m on m.movie_id = f.movie_id WHERE u.username = $1';
        const result = await client.query(query, [username]);

        res.status(200).json({
            message: "Favorites retrieved successfully!",
            favorites: result.rows
        });
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
    }
});