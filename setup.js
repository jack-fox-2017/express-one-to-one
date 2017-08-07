var sql = require('sqlite3').verbose()
var db = new sql.Database('./db/data.db')


function createUsersTable(){
  db.run(`CREATE TABLE IF NOT EXISTS users
        (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50))`)
}

function createProfileTable(){
  db.run(`CREATE TABLE IF NOT EXISTS profiles
        (id INTEGER PRIMARY KEY AUTOINCREMENT, hometown VARCHAR(50),
         birth_year INTEGER, relationship_status VARCHAR(20), user_id INTEGER UNIQUE, FOREIGN KEY(user_id) REFERENCES users(id))`)
}

createUsersTable()
createProfileTable()
