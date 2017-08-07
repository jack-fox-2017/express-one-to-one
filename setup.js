var sqlite3 = require('sqlite3')
    .verbose();
var db = new sqlite3.Database('./db/data.db');

function createTable() {
    db.run(`CREATE TABLE if not exists users
           (id integer primary key autoincrement, username string, firstname string, lastname string, email string);`);
    console.log("Table created");
}

function createTableG() {
    db.run(`CREATE TABLE if not exists profiles
           (id integer primary key autoincrement, hometown string, birth_year integer, relationship_status int);`);
    console.log("Table created");
}

createTable()
createTableG()