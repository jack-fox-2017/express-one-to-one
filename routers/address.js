'use strict'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');
const express = require('express');
const app = express.Router();
// address ke contacts: SELECT * FROM Addresses
// JOIN Contacts
// ON Contacts.id=Addresses.contacts_id
// WHERE Addresses.contacts_id  =2;
app.get('/', function(req, res){
  db.all(`SELECT Addresses.id AS id,
    street,
    city,
    zip_code,
    contacts_id,
    company,
    telp_number,
    email,
    name
    FROM Addresses
    JOIN Contacts
    ON Addresses.contacts_id = Contacts.id`, function (err, rows) {
      db.all(`SELECT * FROM Contacts`, function (err, rows2) {
        if(!err) {
          res.render('address', {data: rows, data_contact:rows2});
        }
      })
  })
});

app.post('/', function(req,res) {
  db.run(`INSERT INTO Addresses (
    street,
    city,
    zip_code,
    contacts_id
  ) VALUES ('${req.body.street}','${req.body.city}', '${req.body.zip_code}', '${req.body.contacts_id}')`);
  res.redirect('/addresses');
})


app.get('/edit/:id', function(req, res){
  db.all(`SELECT Addresses.id AS id,
    street,
    city,
    zip_code,
    contacts_id,
    name
  	FROM Addresses
    JOIN Contacts
    ON Addresses.contacts_id = Contacts.id WHERE Addresses.id = ${req.params.id}`, function (err, rows) {
    db.all(`SELECT * FROM Contacts`, function (err, rows2) {
        if(!err) {
          res.render('addressEdit', {data: rows, data_contact:rows2});
        }
    })
  })
});

app.post('/edit/:id', function(req, res){
  db.run(`UPDATE Addresses SET
    street = '${req.body.street}',
    city = '${req.body.city}',
    zip_code = '${req.body.zip_code}',
    contacts_id = '${req.body.contacts_id}'
    WHERE id = '${req.params.id}';`);
  res.redirect('/addresses');
})

app.get('/delete/:id', function(req, res){
  db.run(`DELETE FROM Addresses WHERE id = ${req.params.id}`);
  res.redirect('/addresses');
});

module.exports = app;
