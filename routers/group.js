'use strict'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');
const express = require('express');
const app = express.Router();

app.get('/', function(req, res){
  db.all(`SELECT g.id AS groups_id, name,contacts_id,name_of_group
    FROM Groups  g
    LEFT JOIN ContactGroups  gc
    ON g.id = gc.groups_id
    LEFT JOIN Contacts  c
    ON c.id = gc.contacts_id`, function (err, rows) {
      var result = contactsInOneLine(rows);
      if(!err) {
            res.render('group', {data: result});
          }
  })
});

function contactsInOneLine(rows) {
  var listGroupId = [];
  for (let i=0; i<rows.length;i++) {
    listGroupId.push(rows[i].groups_id);
  }
  var newlist = listGroupId.filter(function (x, i, a) {
      return a.indexOf(x) == i;
  });
  var masterObj = [];
  for (let l=0; l<newlist.length;l++){
    var obj = {};
    obj['group_id']=newlist[l];
    var names = [];
    for (let i=0; i<rows.length;i++) {
      if (rows[i].groups_id == newlist[l]){
        obj['group_name']=rows[i].name_of_group;
        names.push(rows[i].name);
      }
    }
  obj['names']=names;
  masterObj.push(obj);
  }
  return masterObj;
}


// app.get('/', function(req, res){
//   db.all(`SELECT * FROM Groups`, function (err, rows) {
//     if(!err) {
//       res.render('group', {data: rows});
//     }
//   })
// });

app.post('/', function(req,res) {
  db.run(`INSERT INTO Groups (
    name_of_group
  ) VALUES ('${req.body.name_of_group}')`);
  res.redirect('/groups');
})


app.get('/edit/:id', function(req, res){
  db.all(`SELECT * FROM Groups WHERE id = ${req.params.id}`, function (err, rows) {
    if(!err) {
      res.render('groupEdit', {data: rows});
    }
  })
})

app.post('/edit/:id', function(req, res){
  db.run(`UPDATE Groups SET
    name_of_group = '${req.body.name_of_group}'`);
  res.redirect('/groups');
})

app.get('/contact/:id', function(req, res){
  db.all(`SELECT * FROM Groups WHERE id = ${req.params.id}`, function (err, rows) {
    db.all(`SELECT * FROM Contacts`, function (err, rows2) {
    if(!err) {
      res.render('groupContact', {data_group: rows, data_contact: rows2});
    }
    })
  })
});

app.post('/contact/:id', function(req, res){
  db.run(`INSERT INTO ContactGroups (
    groups_id,
    contacts_id
  ) VALUES ('${req.params.id}','${req.body.contacts_id}')`);
  res.redirect('/groups');
})

app.get('/delete/:id', function(req, res){
  db.run(`DELETE FROM Groups WHERE id = ${req.params.id}`);
  res.redirect('/groups');
});

module.exports = app;
