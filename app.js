const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.set('view engine', 'ejs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/data.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//=============USERS=============//
//home page
app.get('/home', function(req, res){
  res.render('home')
});

//users page
app.get('/users', function(req, res){
  db.all(`SELECT * FROM Users`, function(err, rows){
    res.render('users', {dataUsers: rows})
  })
})

//users add form page
app.get('/users/add', function(req, res){
  res.render('user-add-form')
})

//users add data users
app.post('/users/add', function(req, res){
  db.run(`INSERT INTO Users (username, firstname, lastname, email)
  VALUES ('${req.body.username}', '${req.body.firstname}',
  '${req.body.lastname}', '${req.body.email}')`)
  res.redirect('/users')
})

//user edit form page
app.get('/users/edit/:id', function(req, res){
  db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`, function(err, rows){
    res.render('user-edit-form', {dataUsers: rows[0]})
  })
})

//user edit users
app.post('/users/edit/:id', function(req, res){
  db.run(`UPDATE Users SET username = '${req.body.username}', firstname = '${req.body.firstname}',
  lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = ${req.params.id}`)
  res.redirect('/users')
})

//delete data users
app.get('/users/delete/:id', function(req, res){
  db.run(`DELETE FROM Users WHERE id = ${req.params.id}`)
  res.redirect('/users')
})

//==============PROFILES================//

//profile home page
app.get('/profiles', function(req, res){

  db.all(`SELECT * FROM Profiles`, function(err, rows){

      db.all(`SELECT * FROM Users `, function(err, rows2){

        for(let i=0; i<rows.length; i++)
        {
          for(let j=0; j<rows2.length; j++)
          {
            if(rows[i].user_id == rows2[j].id)
            {
              rows[i].username = rows2[j].username
            }
          }
        }
        res.render('profiles', {dataProfiles:rows})
    })
  })
})

//profile add form page
app.get('/profiles/add',function(req, res){
  db.all(`SELECT * FROM Users`, function(err, dataUsers){
    res.render('profiles-add-form', {dataUsers:dataUsers})
  })
})

//profiles add data profiles
app.post('/profiles/add', function(req, res){
  db.run(`INSERT INTO Profiles (hometown, birth_year, relationship_status, user_id)
  VALUES ('${req.body.hometown}', '${req.body.birth_year}', '${req.body.relationship_status}',
  '${req.body.user_id}')`, function(err, solved){
    if(!err)
    {
      res.redirect('/profiles')
    }
    else {
      res.send('Data telah di pakai')
    }
  })
})

//user edit form page
app.get('/profiles/edit/:id', function(req, res){
  db.all(`SELECT * FROM Profiles WHERE id = ${req.params.id}`, function(err, rows){
    db.all(`SELECT * FROM Users`, function(err, rows1){
      res.render('profiles-edit-form', {dataProfiles:rows, dataUsers:rows1})
    })
  })
})

//user edit users
app.post('/profiles/edit/:id', function(req, res){
  db.run(`UPDATE Profiles SET hometown = '${req.body.hometown}', birth_year = '${req.body.birth_year}',
  relationship_status = '${req.body.relationship_status}', user_id = '${req.body.user_id}' WHERE id = ${req.params.id}`)
  res.redirect('/profiles')
})

app.get('/profiles/delete/:id', function(req, res){
  db.run(`DELETE FROM Profiles WHERE id= ${req.params.id}`)
  res.redirect('/profiles')
})


app.listen(3000);
