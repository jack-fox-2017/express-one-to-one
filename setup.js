var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db/data.db')

db.serialize(function(){
  var query_create_user = `CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100), firstname VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100))`
  db.run(query_create_user)

  // var query_create_profile = `CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,
  // hometown VARCHAR(100),birth_year INTEGER, relationship_status VARCHAR(100), user_id INTEGER UNIQUE, FOREIGN KEY(user_id) REFERENCES Users(id))`
  //
  // db.run(query_create_profile)

})

function insertTable(){
  db.run(`INSERT INTO Users(username, firstname, lastname, email) VALUES('achim', 'achim', 'keren', 'zainal@gamail')`)

  db.run(`INSERT INTO Profiles(hometown, birth_year, relationship_status, user_id) VALUES('mataram',10,'single',1)`)

  console.log("data ke dua berhasil masuk ke tabel");
}
// insertTable()





// Users: id type integer, username type string, firstname type string, lastname type string, email type string
// * Profiles: id type integer, hometown type string, birth_year type integer, relationship_status
// * tambahkan foreign key yang diperlukan!
