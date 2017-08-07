'use strict'

const sql = require('sqlite3')
const db = new sql.Database('./db/data.db')

db.serialize(function() {
  db.run(`CREATE TABLE IF NOT EXISTS contacts(id integer primary key autoincrement, first_name text, last_name text, company text, telp_number integer, email text)`)
  console.log('Contacts Created');

  db.run(` CREATE TABLE IF NOT EXISTS groups(id integer primary key autoincrement, name_of_groups text) `);
  console.log('Groups Created');

  db.run(`CREATE TABLE IF NOT EXISTS address(id integer primary key autoincrement, street text, city text, province text, zip_code integer)`)
  console.log('Address Created');

  db.run(`CREATE TABLE IF NOT EXISTS profiles(id integer primary key autoincrement, id_name text, username text, password text, contact_id)`)
  console.log('Profiles Created');

})
