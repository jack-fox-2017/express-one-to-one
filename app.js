"use strict"

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/data.db')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set("view engine","ejs")

//**************************index*************************
app.get('/',(req,res) => {
  res.render('index',{})
})


//*************************Users***********************
app.get('/users',(req,res) => {
  db.serialize( () =>{
    db.all(`SELECT*FROM Users`,(err,rows) => {
      res.render('users',{data:rows})
    })
  })
})

app.post('/users',(req,res) => {
  db.serialize(() => {
    db.run(`INSERT INTO Users (username,firstname,lastname,email) VALUES ('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}')`)
    res.redirect('/users')
  })
})

app.get('/users/editUsers/:id',(req,res) => {
  // db.serialize(() => {
    db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`,(err,rows) => {
      res.render('editUsers', {data:rows[0]})
    })
  // })
})

app.post('/users/editUsers/:id',(req,res) => {
  db.all(`UPDATE Users SET username = '${req.body.username}', firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = ${req.params.id}`)
  res.redirect('/users')
})

app.get('/users/deleteUsers/:id',(req,res) => {
  db.run(`DELETE FROM Users WHERE id =${req.params.id}`)
  res.redirect('/users')
})

//****************detail profiles di users*************

app.get('/users/detailProfilesUsers/:id',(req,res) => {
  db.all(`SELECT * FROM Users JOIN Profiles on Users.id = Profiles.user_id WHERE Users.id = ${req.params.id}`,(err,rows) => {
    res.render('detailProfilesUsers',{data:rows})
  })
})

//************************Profiles*********************
app.get('/profiles',(req,res) => {
  db.serialize(() => {
    db.all(`SELECT*FROM Profiles`,(err,rows) => {
      db.all(`SELECT id,username FROM Users`,(err,rows2) =>{
        res.render('profiles',{data:rows,data2:rows2,pesan_eror :false})
      })
    })
  })
})

app.post('/profiles',(req,res) => {
  // db.all(`SELECT id FROM Users`)
  db.all(`SELECT*FROM Profiles`,(err1,rows) => {
    db.all(`SELECT id,username FROM Users`,(err2,rows2) =>{
      db.run(`INSERT INTO Profiles (hometown,relationship_status,user_id) VALUES ('${req.body.hometown}','${req.body.relationship_status}','${req.body.user_id}')`,(err3) =>{
        if(!err3){
        res.redirect('/profiles')
      }  else {
        res.render('profiles', {data:rows,data2:rows2, pesan_eror :"Error : Punteun Id nya sudah terpakai "})
      }
      })
    })
  })
})


// app.post('/profiles',(req,res) => {
//   // db.all(`SELECT id FROM Users`)
//     db.run(`INSERT INTO Profiles (hometown,relationship_status,user_id) VALUES ('${req.body.hometown}','${req.body.relationship_status}','${req.body.user_id}')`)
//       res.redirect('/profiles')
// })

app.get('/profiles/editProfiles/:id',(req,res) => {
  db.all(`SELECT * FROM Profiles WHERE id = ${req.params.id}`,(err,rows) => {
    db.all(`SELECT id,username FROM Users`,(err2,rows2) => {
      res.render('editProfiles',{data:rows[0],data2:rows2})
    })
  })
})

app.post('/profiles/editProfiles/:id',(req,res) => {
  db.run(`UPDATE Profiles SET hometown = '${req.body.hometown}', relationship_status = '${req.body.relationship_status}', user_id = '${req.body.user_id}' WHERE id = ${req.params.id}`)
  res.redirect('/profiles')
})

app.get('/profiles/deleteProfiles/:id',(req,res) => {
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id}`)
  res.redirect('/profiles')
})




app.listen(3000)
