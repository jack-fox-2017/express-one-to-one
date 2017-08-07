let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/data.db');

function createTable(){
  db.run('CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(50), first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(50))')
  console.log('Tabel User berhasil dibuat');

  db.run('CREATE TABLE  IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT, home_town VARCHAR(100), birth_year INT, relationship_status VARCHAR(50))')
  console.log('Tabel Profiles berhasil dibuat');
}

function insertTable(){
db.run('INSERT INTO Users(id, user_name, first_name, last_name, email)VALUES (1,"Prahastha","Galih Indra","Prahastha","galih@email.com")');

db.run('INSERT INTO Profiles(id, home_town, birth_year, relationship_status)VALUES (1,"Jakarta",1985,"Mumet")')

}

// createTable()
// insertTable()
