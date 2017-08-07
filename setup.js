const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/data.db')

db.serialize(function() {
  var query_create_user = `CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100), firstname VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100))`
  db.run(query_create_user)

  var query_create_profile = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,
  hometown VARCHAR(100), relationship_status VARCHAR(100), user_id INTEGER UNIQUE, FOREIGN KEY(user_id) REFERENCES Users(id))`

  db.run(query_create_profile)



db.run(`INSERT INTO Users(username,firstname,lastname,email) VALUES ('aridwia','ari','dwi','aridwia@mail.com')`)
db.run(`INSERT INTO Users(username,firstname,lastname,email) VALUES ('resti','resti','nurul','resti@mail.com')`)
db.run(`INSERT INTO Users(username,firstname,lastname,email) VALUES ('yoga','yoga','pratama','yoga@mail.com')`)

db.run(`INSERT INTO Profiles(hometown,relationship_status,user_id) VALUES ('Bandung','single','1')`)
db.run(`INSERT INTO Profiles(hometown,relationship_status,user_id) VALUES ('Bandung','single','2')`)
db.run(`INSERT INTO Profiles(hometown,relationship_status,user_id) VALUES ('Bandung','single','3')`)

})
