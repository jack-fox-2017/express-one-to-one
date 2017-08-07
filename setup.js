const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/database.db')

db.serialize(function(){
  var queryUser = `CREATE TABLE IF NOT EXISTS Users(id INTEGER primary key AUTOINCREMENT, username text, firstname text, lastname INTEGER, email text)`
  var queryProfile = `CREATE TABLE IF NOT EXISTS Profiles (id INTEGER primary key AUTOINCREMENT, hometown TEXT, birth_year INTEGER, relationship_status TEXT, user_id INTEGER UNIQUE, FOREIGN KEY(user_id) REFERENCES Users(id))`
  db.run(queryUser)
  db.run(queryProfile)
})
