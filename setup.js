const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/data.db');

// function createTable() {
db.serialize(function() {
  db.run(`CREATE TABLE if not exists 'Contact' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' text, 'company' text, 'phone' INTEGER, 'email' text)`);
  console.log('Contact Table Created!');

  db.run(`CREATE TABLE if not exists 'Grup' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' text)`)
  console.log('Group Table Created!');

  db.run(`CREATE TABLE if not exists 'Profile' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'username' text, 'password' text, 'firstname' text, 'lastname' text, 'ContactId' INTEGER, FOREIGN KEY(ContactId) REFERENCES Contact(id))`);
  console.log('Profile Table Created!');

  db.run(`CREATE TABLE if not exists 'Address' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'address' text, 'city' text, 'zipcode' INTEGER, 'ContactId' INTEGER, FOREIGN KEY(ContactId) REFERENCES Contact(id))`);
  console.log('Address Table Created!');

  db.run(`CREATE TABLE if not exists 'CG' ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'ContactId' INTEGER, 'GroupId' INTEGER)`)
})


function insertData() {
  db.run("INSERT INTO CONTACT (name, company, phone, email) VALUES ('Achim Baggins', 'Hacktiv8 Indonesia', 081803704343, 'achim_baggins@yahoo.com')");
}
// createTable()
// insertData()
