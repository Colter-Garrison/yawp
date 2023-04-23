-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS reviews;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL
);

CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stars INT NOT NULL,
  detail TEXT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users(
  first_name,
  last_name,
  email,
  password_hash
)
VALUES
('Colter', 'Garrison', 'test@email.com', 'password');

INSERT INTO restaurants(
  name,
  cuisine
)
VALUES 
('Murphys', 'Diner'),
('American Dream', 'Pizza');

INSERT INTO reviews(
  stars,
  detail,
  restaurant_id,
  user_id
)
VALUES
('5', 'YUMMY', '1', '1');