'use strict'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');
const express = require('express');
const app = express.Router();

// app.get('/', function(req, res){
//   db.all(`SELECT * FROM Contacts`, function (err, rows) {
//     if(!err) {
//       res.render('contact', {data: rows});
//     }
//   })
// });

app.get('/', function(req, res){
  db.all(`SELECT c.id AS contacts_id, name, company, telp_number, email, name_of_group , groups_id
    FROM Contacts  c
    LEFT JOIN ContactGroups  gc
    ON c.id = gc.contacts_id
    LEFT JOIN Groups  g
    ON g.id = gc.groups_id`, function (err, rows) {
      db.all(`SELECT * FROM Groups`, function (err, rows2) {
      var result = contactsInOneLine(rows);
          if(!err) {

            console.log("----",result);
            res.render('contact', {data: result, data_group: rows2});
          }
    })
  })
});

function contactsInOneLine(rows) {
  var listGroupId = [];
  for (let i=0; i<rows.length;i++) {
    listGroupId.push(rows[i].contacts_id);
  }
  var newlist = listGroupId.filter(function (x, i, a) {
      return a.indexOf(x) == i;
  });
  var masterObj = [];
  for (let l=0; l<newlist.length;l++){
    var obj = {};
    obj['contact_id']=newlist[l];
    var names = [];
    for (let i=0; i<rows.length;i++) {
      if (rows[i].contacts_id == newlist[l]){
        obj['contact_name']=rows[i].name;
        obj['telp_number']=rows[i].telp_number;
        obj['company']=rows[i].company;
        obj['email']=rows[i].email;
        names.push(rows[i].name_of_group);
      }
    }
  obj['group_names']=names;
  masterObj.push(obj);
  }
  return masterObj;
}

app.post('/', function(req,res) {
  db.run(`INSERT INTO Contacts (
    name,
    company,
    telp_number,
    email
  ) VALUES ('${req.body.name}','${req.body.company}', '${req.body.telp_number}', '${req.body.email}')`, function(){
    if(req.body.hasOwnProperty('groups_id')) {
      let contacts_id = this.lastID;
      db.run(`INSERT INTO ContactGroups (
        contacts_id,
        groups_id
      ) VALUES (${contacts_id},'${req.body.groups_id}')`);
    }

  });
  // db.run(`INSERT INTO ContactGroups (
  //   contacts_id,
  //   groups_id
  // ) VALUES ('${req.params.id}','${req.body.groups_id}')`);
  res.redirect('/contacts');
})


app.get('/edit/:id', function(req, res){
  db.all(`SELECT * FROM Contacts WHERE id = ${req.params.id}`, function (err, rows) {
    if(!err) {
      res.render('contactEdit', {data: rows});
    }
  })
})

app.post('/edit/:id', function(req, res){
  db.run(`UPDATE Contacts SET
    name = '${req.body.name}',
    company = '${req.body.company}',
    telp_number = '${req.body.telp_number}',
    email = '${req.body.email}'
    WHERE id = '${req.params.id}';`);
  res.redirect('/contacts');
})

// app.get('/group/:id', function(req, res){
//   db.all(`SELECT * FROM Contacts WHERE id = ${req.params.id}`, function (err, rows) {
//     db.all(`SELECT * FROM Groups`, function (err, rows2) {
//     if(!err) {
//       res.render('contactGroup', {data_group: rows2, data_contact: rows});
//     }
//     })
//   })
// });
//
// app.post('/group/:id', function(req, res){
//   db.run(`INSERT INTO ContactGroups (
//     contacts_id,
//     groups_id
//   ) VALUES ('${req.params.id}','${req.body.groups_id}')`);
//   res.redirect('/contacts');
// })

app.get('/delete/:id', function(req, res){
  db.run(`DELETE FROM Contacts WHERE id = ${req.params.id}`);
  res.redirect('/contacts');
});

app.get('/address/:id', function(req, res){
  db.all(`SELECT * FROM Contacts
  JOIN Addresses
  ON Contacts.id=Addresses.contacts_id
  WHERE Contacts.id=${req.params.id}`, function (err, rows) {
    console.log(rows);
    console.log(rows[0]);
    if(!err) {
      res.render('contactAddress', {data: rows});
    }
  })
});

app.post('/address/:id', function(req, res){
  db.run(`INSERT INTO Addresses (
    street,
    city,
    zip_code,
    contacts_id
  ) VALUES ('${req.body.street}','${req.body.city}', '${req.body.zip_code}', ${req.params.id})`);
  res.redirect('/contacts'); // knpa klo k dia lg jd error
});
module.exports = app;
