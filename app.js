const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
const sql3 = require('sqlite3').verbose();
var db = new sql3.Database('./db/data.db');
app.set('view engine', 'ejs');


app.get('/', function(req,res){
  res.render('index')
})
//========================================================USER
app.get('/users', function(req,res){
  db.all(`SELECT * FROM Users`, function(err,rows){
    if (!err) {
      res.render('user', {dataU:rows})
    }
  })
})

app.post('/users', function(req,res){
  db.run(`INSERT INTO Users (username,firstname,lastname,email)
  VALUES('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}')`)
  res.redirect('/users')
})

app.get('/users/edit/:id', function(req,res){
  db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`, function(err,rows){
    res.render('edit_user', {dataU:rows})
  })
})

app.post('/users/edit/:id', function(req, res){
  db.run(`UPDATE Users SET username ='${req.body.username}',firstname = '${req.body.firstname}',
  lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id =${req.params.id}`)
  res.redirect('/users')
})

app.get('/users/delete/:id', function(req,res){
  db.run(`DELETE FROM Users WHERE id = '${req.params.id}'`)
  res.redirect('/users')
})




//========================================================PROFILE
app.get('/profiles', function(req,res){
  db.all(`SELECT * FROM Profiles`, function(err, rowsP){
    db.all(`SELECT * FROM Users`, function(err, rowsU){
      if (!err) {
        res.render('profiles', {dataP:rowsP, dataU:rowsU})
      }
      })
  })
})

app.post('/profiles', function(req,res){
  db.run(`INSERT INTO Profiles (hometown,birth_year,relationship_status,profiles_users)
  VALUES('${req.body.hometown}','${req.body.birth_year}','${req.body.relationship_status}','${req.body.profiles_users}')`, function(err,solved){
    if (!err) {
      res.redirect('/profiles')
    }else {
      res.send("Data telah dipakai")
    }
  })
})

app.get('/profiles/edit/:id', function(req,res){
  db.all(`SELECT * FROM Profiles WHERE id = ${req.params.id}`, function(err,rowsP){
    db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`, function(err,rowsU){
      if (!err) {
        res.render('edit_profiles', {dataP:rowsP, dataU:rowsU})
      }
    })
  })
})

app.post('/profiles/edit/:id', function(req, res){
  db.run(`UPDATE Profiles SET hometown ='${req.body.hometown}',birth_year = '${req.body.birth_year}',
  relationship_status = '${req.body.relationship_status}', profiles_users = '${req.body.profiles_users}' WHERE id =${req.params.id}`)
  res.redirect('/profiles')
})

app.get('/profiles/delete/:id', function(req,res){
  db.run(`DELETE FROM Profiles WHERE id = '${req.params.id}'`)
  res.redirect('/profiles')
})


app.listen(3007)
