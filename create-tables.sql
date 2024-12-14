CREATE TABLE movies(
    movie_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name VARCHAR(255),
    year INT,
    genre VARCHAR(255)
);

CREATE TABLE users(
    user_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    year_of_birth INT,
    UNIQUE (username)
);

CREATE TABLE reviews(
    review_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    movie_id INT,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    review_text TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

CREATE TABLE favorites(
    user_id INT,
    movie_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

INSERT INTO movies (movie_name, year, genre) VALUES 
('Inception', 2010, 'action'),
('The Terminator', 1984, 'action'),
('Tropic Thunder', 2008, 'comedy'),
('Borat', 2006, 'comedy'),
('Interstellar', 2014, 'drama'),
('Joker', 2019, 'drama');

INSERT INTO users (username, name, password, year_of_birth) VALUES
('SatanistiVuohi', 'Tommi Kumpula', 'qwerty123', 2001),
('lizzy', 'Lisa Simpson', 'abcdef', 1991 ),
('boss', 'Ben Bossy', 'salasana', 1981 ),
('Lemmy', 'Lemmy Kilmister', 'Motörhead', 1945);

INSERT INTO favorites (user_id, movie_id) VALUES
(1, 2),
(1, 5), 
(4, 2),
(3, 4);

INSERT INTO reviews (user_id, movie_id, stars, review_text) VALUES
(4, 2, 4, 'Shit so good I enjoyed.'),
(1, 5, 5, 'Best movie'),
(1, 1, 1, 'Have not watched yet.');