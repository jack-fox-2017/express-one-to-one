var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/database.db');


db.serialize (function(){
  var query_create_contact = `CREATE TABLE IF NOT EXISTS Contact(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(100) not null, company varchar(100) not null,
    telp_number varchar(12) not null,
    email varchar(25))`

    db.run(query_create_contact);
    console.log(`Succes create Table Contact`);

  db.serialize(function(){
    var query_create_profile = `CREATE TABLE IF NOT EXISTS Profile(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname varchar(255) not null,
      account varchar(255),
      contact_id INTEGER, FOREIGN KEY(contact_id) REFERENCES Contact(id), UNIQUE(contact_id))`

    db.run(query_create_profile);
    console.log(`Sucess cerate Table Profile`);
  })
})

//module.exports = createTable();
