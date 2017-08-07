var express = require ('express');
var path = require ('path');
var app = express();
var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./db/data.db');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req,res){
  res.send('HALLOOO')
})

app.get('/users', function (req, res) {
  db.all (`SELECT * FROM Users` ,function (err,datas){
    res.render('users',{users:datas})
  })
})

app.post('/users', function (req,res){
  db.run(`INSERT INTO Users (username,firstname,lastname,email) VALUES ('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}');`)
  res.redirect(`/users`)
})

app.get('/users/delete/:id', function(req,res){
  db.run(`DELETE FROM Users WHERE id = ${req.params.id}`)
  res.redirect(`/users`)
})

app.get('/users/editusers/:id', function (req,res){
  db.all(`SELECT * FROM Users WHERE id = ${req.params.id}`, function (err,rows){
    if (!err){
      res.render(`editusers`, {input : rows});
    }
  })
})

app.post ('/users/editusers/:id' , function(req, res){
  db.run(`UPDATE Users SET username = '${req.body.username}', firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = '${req.params.id}'`)
  res.redirect(`/users`)
})

app.get('/profiles', function (req, res) {
  db.all (`SELECT Profiles.id as 'Profile_id', Profiles.hometown, Profiles.birth_year, Profiles.relationship_status,Profiles.user_id, Users.id, Users.username, Users.firstname, Users.lastname, Users.email  FROM Profiles JOIN Users ON Profiles.user_id = Users.id` ,function (err,rows){
        if(!err){
          res.render('profiles',{profiles:rows,  pesan:false})
        }
  })
})


app.post('/profiles', (req, res) => {
  db.all(`select * from Profiles where user_id=${req.body.user_id}`, (err, cekProfil) => {
    console.log(cekProfil);
    if(cekProfil.length == 0){
         db.run(`INSERT INTO Profiles (hometown,birth_year,relationship_status,user_id) VALUES ('${req.body.hometown}','${req.body.birth_year}','${req.body.relationship_status}','${req.body.user_id}');`)
        res.redirect(`/profiles`)
    } else {
      db.all (`SELECT Profiles.id as 'Profile_id', Profiles.hometown, Profiles.birth_year, Profiles.relationship_status,Profiles.user_id, Users.id, Users.username, Users.firstname, Users.lastname, Users.email  FROM Profiles JOIN Users ON Profiles.user_id = Users.id` ,function (err,rows){
            if(!err){
              res.render('profiles',{profiles:rows,  pesan:'Maaf!!!\nUsername dan Contact ID yang anda masukkan tidak dapat digunakan!!!'})
            }
      })
    }
  })
})


app.get('/profiles/delete/:id', function(req,res){
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id}`, function(err, success) {
    res.redirect(`/profiles`)
  })
})

app.get('/profiles/editprofiles/:id', function (req,res){
  db.all(`SELECT Profiles.id as 'Profile_id', Profiles.hometown, Profiles.birth_year, Profiles.relationship_status,Profiles.user_id FROM Profiles WHERE Profile_id = ${req.params.id}`, function (err,rows){
    if (!err){
      res.render(`editprofiles`, {data : rows});
    }
      console.log(rows);
  })
})

app.post ('/profiles/editprofiles/:id' , function(req, res){
  db.run(`UPDATE Profiles SET hometown = '${req.body.hometown}', birth_year = '${req.body.birth_year}', relationship_status = '${req.body.relationship_status}', user_id = '${req.body.user_id}' WHERE Profile_id = '${req.params.id}'`)
  res.redirect(`/profiles`)
})


app.listen(3000, function(){
  console.log("listen in port");
})
