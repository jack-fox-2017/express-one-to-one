var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

db.serialize(function(){
  var create_user = `CREATE TABLE IF NOT EXISTS Users
  (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(100),
  firstname VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100))`
  db.run(create_user)

  var create_profile= `CREATE TABLE IF NOT EXISTS Profiles
  (id INTEGER PRIMARY KEY AUTOINCREMENT, hometown VARCHAR(225),
   birth_year VARCHAR(225), relationship_status VARCHAR(225),
   user_id INTEGER UNIQUE, FOREIGN KEY(user_id) REFERENCES Users(id))`
   db.run(create_profile)
})
