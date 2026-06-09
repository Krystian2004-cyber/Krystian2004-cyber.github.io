const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, 'movies.db');
const db = new DatabaseSync(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS movie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    rating INTEGER NOT NULL
)`);

module.exports = db;
