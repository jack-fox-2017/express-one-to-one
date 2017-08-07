const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  company VARCHAR(50) NOT NULL,
  telp_number VARCHAR(15) NOT NULL,
  email VARCHAR(30) NOT NULL
)`, err => {
  if (err) throw err
  console.log(`Table contacts created`);
})

db.run(`CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_of_group VARCHAR(50)
)`, err => {
  if (err) throw err
  console.log(`Table groups created`);
})

db.run(`CREATE TABLE IF NOT EXISTS groups_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id INTEGER,
  group_id INTEGER,
  FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE
)`, err => {
  if (err) throw err
  console.log(`Table groups_contacts created`);
})


db.run(`CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  street VARCHAR,
  city VARCHAR(50),
  province VARCHAR(50),
  zip VARCHAR(10),
  contact_id INTEGER,
  FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
)`, err => {
  if (err) throw err
  console.log(`Table addresses created`);
})

db.run(`CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(50) NOT NULL,
  contact_id INTEGER,
  FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  UNIQUE(contact_id)
)`, err => {
  if (err) throw err
  console.log(`Table profiles created`);
})

let dropTable = table => {
  db.run(`DROP TABLE ${table}`, err =>{
    if (err) throw err
    console.log(`${table} deleted`);
  })
}

// dropTable('contacts')
// dropTable('profiles')