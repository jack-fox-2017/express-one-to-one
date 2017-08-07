var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('./db/data.db')

db.parallelize(function() {
  var query_create_user =`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100), firstname VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100))`
  db.run(query_create_user)

  var query_create_profile = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,
    hometown VARCHAR(100), relationship_status VARCHAR(100), user_id INTEGER REFERENCES Users(id), UNIQUE(user_id))`
  db.run(query_create_profile)

  // db.run(`INSERT INTO Users(username, firstname, lastname, email)
  // VALUES('rahid', 'Rahmat', 'Hidayat', 'rahid@gmail.com')`)

  // db.run(`INSERT INTO Users(username, firstname, lastname, email)
  // VALUES('bro', 'John', 'Doe', 'johndoe@gmail.com')`)

  // db.run(`INSERT INTO Profiles(hometown, relationship_status, user_id)
  // VALUES('Padang', 'single', 1)`)
})
