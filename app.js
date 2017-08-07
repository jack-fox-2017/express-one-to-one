const express = require('express')
const app = express()
const bodyParser = require('body-parser')

var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('./db/data.db')

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//---------Menu index-----------//
app.get('/', function(req, res){
  res.render('index', {data: "Welcome to menu"})
})


//-------------tampilan users--------//
app.get('/users', function(req, res){
  db.all(`SELECT * FROM Users`, (err, rows)=>{
    if(!err){
      res.render('users', {data: rows})
    }
  })
})
//------------Tambah users-----------//
app.post('/users', function(req, res){
  db.run(`INSERT INTO Users(username, firstname, lastname, email) VALUES('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}')`)
  res.redirect('/users')
})

//-------------edit user------------//
// => Tampil EDIT user
app.get('/users/edit/:id', function(req, res){
  db.all(` SELECT * FROM Users WHERE id = ${req.params.id}`, (err, rows) => {
    if(!err){
      res.render('usersEdit', {data:rows[0]})
    }
  })
})
// => Upadte edit user
app.post('/users/edit/:id', function(req, res){
  db.run(`UPDATE Users SET username = '${req.body.username}', firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = ${req.params.id}`)
  res.redirect('/users')
})

//-------------Delete user-----------//
app.get('/users/delete/:id', function(req, res){
  db.run(`DELETE FROM Users WHERE id = ${req.params.id} `)
  res.redirect('/users')
})

//--------------Tampil profile--------//
app.get('/profile', (req, res)=>{
  db.all(`SELECT * FROM Profiles LEFT JOIN users ON users.id = Profiles.user_id`, (err, rows)=>{
    db.all(`SELECT * FROM users`, (err2, rows2)=>{
      if(!err){
        res.render('profile', {data:rows, data2:rows2})
      }
    })
  })
})

//------------------Tambah profile-----------//
app.post('/profile', (req, res)=>{
  db.run(`INSERT INTO Profiles(hometown, birth_year, relationship_status, user_id) VALUES('${req.body.hometown}',${req.body.birth_year},'${req.body.relationship_status}','${req.body.user_id}')`, (err, pesan)=>{
    if(!err){
      res.redirect('/profile')
    }else {
      res.send('USER ID SUDAH TERPAKAI')
    }
  })
})

//-------------------edit profile-------------//
// => tampil edit profile
app.get('/profile/edit/:user_id', (req, res)=>{
  db.all(`SELECT * FROM Profiles WHERE user_id = ${req.params.user_id} `, (err, rows)=>{
    db.all(`SELECT * FROM Users`, (err, rows2)=>{
      if(!err){
        res.render('profileEdit', {data:rows[0], data2:rows2})
      }else {
        res.send('ID SUDAH TERPAKAI')
      }
    })
  })
})

// => update edit profile
app.post('/profile/edit/:user_id', (req, res)=>{
  db.run(`UPDATE Profiles SET hometown = '${req.body.hometown}', birth_year = '${req.body.birth_year}', relationship_status = '${req.body.relationship_status}' WHERE user_id = ${req.params.user_id} `, (err, pesan) => {
    if(!err){
      res.redirect('/profile')
    }
  })
})

//-------------------delete profile----------//
app.get('/profile/delete/:user_id', (req, res) => {
  db.run(`DELETE FROM Profiles WHERE user_id = ${req.params.user_id}`)
  res.redirect('/profile')
})

app.listen(3000, function(){
  console.log('sedang berjalan app.js');
})
