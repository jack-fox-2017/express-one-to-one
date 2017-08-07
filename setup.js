var sqlite3 = require("sqlite3").verbose()
var db = new sqlite3.Database("./Database/data.db")

function createUsers(){
  db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username STRING, firstname STRING, lastname STRING, email STRING)`)
  //check apakah tabel berhasil di buat
  console.log("tabel berhasil di buat")
}

function createProfiles(){
  db.run(`CREATE TABLE IF NOT EXISTS profiles(id INTEGER PRIMARY KEY, hometown VARCHAR, birth_year INTEGER, relationship_status VARCHAR, user_id INTEGER UNIQUE, FOREIGN KEY (user_id) REFERENCES users(id))`)
  console.log("data berhasil masuk ke tabel")
}

// function createAddrees(){
//   db.run(`CREATE TABLE IF NOT EXISTS address(no INTEGER PRIMARY KEY AUTOINCREMENT, address text, city text, province text, postcode INT)`)
//   console.log("data berhasil masuk ke tabel")
// }
//
// function createProfile(){
//   db.run(`CREATE TABLE IF NOT EXISTS profiles(no INTEGER PRIMARY KEY AUTOINCREMENT, username text, password text)`)
//   console.log("data berhasil masuk ke tabel")
// }
//

// //function insert(){
//   db.run(`INSERT INTO groups (namegroup) VALUES("dimas")`)
//   console.log("masuk");
// }



 //createUsers()
createProfiles()
//insert()
//createAddrees()
//createProfile()
