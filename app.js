const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database('./db/data.db')

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//====================================Index
app.get('/', function(req,res){
  res.render('index')
})
//====================================TAMPILKAN User
app.get('/users', function(req,res){
  db.all('SELECT * FROM Users', function(err,rows){
    if(!err){
      res.render('users',{data: rows})
    }
  })
})
//=======================================CREATE User
app.post('/users', function(req,res){
  db.run(`INSERT INTO Users(user_name,first_name,last_name,email)
  VALUES ('${req.body.user_name}','${req.body.first_name}','${req.body.last_name}','${req.body.email}')
  `)
  res.redirect(`/users`)
})


//========================================HAPUS User
app.get('/users/delete/:id', function(req,res){
  db.run(`DELETE FROM Users WHERE id = ${req.params.id};`)
  res.redirect('/users')
})
//=====================================EDIT User sc1
app.get('/users/edit/:id', function(req,res) {
  db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`, function(err,rows){
    if(!err){
      res.render('users-edit',{
        data: rows
      })
    }
  })
})
//=====================================EDIT User sc2
app.post(`/users/edit/:id`, function(req,res){
  db.run(`UPDATE Users set user_name = '${req.body.user_name}',
    first_name = '${req.body.first_name}',
    last_name = '${req.body.last_name}',
    email = '${req.body.email}';`)
  res.redirect('/users')
})
//====================================TAMPILKAN Profiles
app.get('/profiles', function(req,res){
  db.all('SELECT * FROM Profiles', function(err,rows){
    db.all('SELECT * FROM Users', function(err,rowsU){
    if(!err){
      res.render('profiles',{data: rows , dataU: rowsU})
    }
    })
  })
})

//=======================================CREATE Profiles
app.post('/profiles', function(req,res){
  db.run(`INSERT INTO Profiles(home_town,birth_year,relationship_status)
  VALUES ('${req.body.home_town}','${req.body.birth_year}','${req.body.relationship_status}')
  `)
  res.redirect(`/profiles`)
})

//========================================HAPUS Profiles
app.get('/profiles/delete/:id', function(req,res){
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id};`)
  res.redirect('/profiles')
})
//=====================================EDIT Profiles sc1
app.get('/profiles/edit/:id', function(req,res) {
  db.all(`SELECT * FROM Profiles WHERE id = ${req.params.id}`, function(err,rows){
    if(!err){
      res.render('profiles-edit',{
        data: rows
      })
    }
  })
})
//=====================================EDIT Profiles sc2
app.post(`/profiles/edit/:id`, function(req,res){
  db.run(`UPDATE Profiles set home_town = '${req.body.home_town}',
    birth_year = '${req.body.birth_year}',
    relationship_status = '${req.body.relationship_status}';`)
  res.redirect('/profiles')
})

//=============================================
app.listen(3000, function(){
  console.log('Jalan');
})
