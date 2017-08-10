const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database/data.db');


db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username text, firstname text, lastname text, email text)`)

    db.run(`CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT, hometown text, birth_year INTEGER, relationship_status text, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES Users(id), UNIQUE(user_id))`)

    // db.run(`DROP TABLE Profiles`)
})
