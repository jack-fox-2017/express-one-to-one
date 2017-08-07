const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('db/data.db')

var createTable = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR, firstname VARCHAR, lastname VARCHAR, email VARCHAR)`)
    db.run(`CREATE TABLE IF NOT EXISTS Profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, hometown VARCHAR, birth_year INTEGER, relationship_status VARCHAR, UserId INTEGER UNIQUE, FOREIGN KEY (UserId) REFERENCES Users(id))`)

    // db.parallelize(( => {
    //   //
    // }))
  })
}

createTable()
