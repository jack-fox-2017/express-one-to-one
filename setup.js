var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/data.db');


db.serialize(function() {
  var query_create_user = `CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR, firstname VARCHAR, lastname VARCHAR, email VARCHAR)`
  db.run(query_create_user)

  var query_create_profiles = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT, hometown VARCHAR, birth_year INTEGER, relationship_status VARCHAR, user_id INTEGER, UNIQUE(user_id), FOREIGN KEY(user_id) REFERENCES Users(id))`
  db.run(query_create_profiles)

  console.log("table succes create");
})
