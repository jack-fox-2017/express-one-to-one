'use strict'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');
const express = require('express');
const app = express.Router();

app.get('/', function(req, res){
  db.all(`SELECT Profiles.id AS id,
    username,
    password,
    contacts_id,
    name
    FROM Profiles
    JOIN Contacts ON  Profiles.contacts_id = Contacts.id`, function (err, rows) {
        db.all(`SELECT * FROM Contacts`, function (err, rows2) {
          if(!err) {
            res.render('profile', {data : rows, data_contact: rows2, message:''});
          }
        });
  })
});

app.post('/', function(req,res) {
  db.run(`INSERT INTO Profiles (
    username,
    password,
    contacts_id
  ) VALUES ('${req.body.username}','${req.body.password}', '${req.body.contacts_id}')`, function (errs, rows) {
    if(!errs) {
      res.redirect('/profiles');
    } else {
      db.all(`SELECT Profiles.id AS id,
        username,
        password,
        contacts_id,
        name
        FROM Profiles
        JOIN Contacts ON  Profiles.contacts_id = Contacts.id`, function (err, rows) {
            db.all(`SELECT * FROM Contacts`, function (err, rows2) {
                res.render('profile', {data : rows, data_contact: rows2, message:errs});
            });
          })
      // console.log(err);
    }
  })
});


app.get('/edit/:id', function(req, res){
  db.all(`SELECT Profiles.id AS id,
    username,
    password,
    contacts_id,
    name
    FROM Profiles
    JOIN Contacts ON  Profiles.contacts_id = Contacts.id
    WHERE Profiles.id = ${req.params.id}`, function (err, rows) {
      db.all(`SELECT * FROM Contacts`, function (err, rows2) {
        if(!err) {
          res.render('profileEdit', {data: rows, data_contact: rows2, message:''});
        }
      })
  })
})

app.post('/edit/:id', function(req, res){
  db.run(`UPDATE Profiles SET
    username = '${req.body.username}',
    password = '${req.body.password}',
    contacts_id = '${req.body.contacts_id}'
    WHERE id = '${req.params.id}'`, function (errs, rows) {


      if(!errs) {
        res.redirect('/profiles');
      } else {
        db.all(`SELECT Profiles.id AS id,
          username,
          password,
          contacts_id,
          name
          FROM Profiles
          JOIN Contacts ON  Profiles.contacts_id = Contacts.id WHERE Profiles.id = ${req.params.id}`, function (err, rows) {
              db.all(`SELECT * FROM Contacts`, function (err, rows2) {
                  // console.log(rows);
                  res.render('profileEdit', {data : rows, data_contact: rows2, message:errs});
              });
            })
        // res.render('profileEdit', {data: arrTemp, message: errs})
        // console.log(err);
      }
    });
})

app.get('/delete/:id', function(req, res){
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id}`);
  res.redirect('/profiles');
});

module.exports = app;
