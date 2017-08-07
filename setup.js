const Sql = require('sqlite3').verbose();
let db = new Sql.Database('./db/data.db');

db.serialize(()=>{
  //create table contacts
  let qry_createUsers = `CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(25), firstname VARCHAR(25), lastname VARCHAR(25), email VARCHAR(25))`;
  db.run(qry_createUsers);

  //create table profiles
  let qry_createProfile = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,
    hometown VARCHAR(25), birth_year INT, relationship_status VARCHAR(50), users_id INTEGER UNIQUE, FOREIGN KEY(users_id) REFERENCES Users(id))`;
  db.run(qry_createProfile);
});
