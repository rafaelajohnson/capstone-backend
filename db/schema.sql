-- wipe old tables so we can reset
DROP TABLE IF EXISTS options;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS users;

-- users table handles login/auth
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- stories belong to a user
CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- pages belong to a story
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  story_id INT REFERENCES stories(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  text TEXT NOT NULL
);

-- options belong to a page (choices for what happens next)
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  page_id INT REFERENCES pages(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL
);

