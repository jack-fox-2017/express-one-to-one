var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

function Users() {
  db.serialize(function(){
    db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT, firstname TEXT,
      lastname TEXT, email TEXT)`)
  })
}

function Profiles() {
  db.serialize(function(){
    db.run(`CREATE TABLE IF NOT EXISTS Profiles (id INTEGER PRIMARY KEY AUTOINCREMENT,
      hometown TEXT, birth_year INTEGER,relationship_status TEXT,
      profiles_users INTEGER UNIQUE, FOREIGN KEY(profiles_users)
      REFERENCES Users(id))`)
  })
}

function insert_data(){
  db.run(`INSERT INTO Users(username, firstname, lastname)
VALUES('achim', 'achim', 'keren')`)

db.run(`INSERT INTO Users(username, firstname, lastname)
VALUES('dayat', 'dayat', 'bebas')`)

db.run(`INSERT INTO Users(username, firstname, lastname)
VALUES('dimas', 'dimas', 'cute')`)

db.run(`INSERT INTO Profiles(hometown, relationship_status, profiles_users)
VALUES('mataram', 'single', 1)`)

db.run(`INSERT INTO Profiles(hometown, relationship_status, profiles_users)
VALUES('padang', 'single', 2)`)

db.run(`INSERT INTO Profiles(hometown, relationship_status, profiles_users)
VALUES('cirebon', 'single', 3)`)
}

// db.run(`CREATE TABLE IF NOT EXIST Profiles(id INTEGER AUTOINCREMENT, hometown TEXT, birth_year INTEGER, email TEXT)`)
// function insert_data(){
// }

// insert_data()
// Users()
// Profiles()
