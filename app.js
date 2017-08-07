let express = require("express")
const app = express()
const bodyParser = require("body-parser")
let sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./Database/data.db")

app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
//  index
app.get('/', function(req, res){
  res.render('index')
})

// users
app.get ('/users', function (req, res) {
  db.all(`select * from users`, function (err, data) {
    if (!err) {
      res.render('users', {
        data: data
      })
    }
  })
})

app.post('/users', function(req, res) {
  db.run(`INSERT INTO users(username, firstname,lastname,email)VALUES("${req.body.username}","${req.body.firstname}","${req.body.lastname}","${req.body.email}")`)
  res.redirect('/users')
})

// users edit

app.get("/users/edit/:id", function(req,res){
  db.all(`SELECT * FROM users WHERE id = '${req.params.id}'`, function(err,rows){
    if(!err){
      res.render("editusers",{
        data:rows
      })
    }
  })
})


app.post('/users/edit/:id', function(req,res) {
  db.run(`UPDATE  users SET username = "${req.body.username}", firstname = "${req.body.firstname}",lastname = "${req.body.lastname}",email = "${req.body.email}" WHERE id = ${req.params.id}`)
  res.redirect('/users')
})

// users delete

app.get('/users/delete/:id', function(req,res){
  db.run(`DELETE FROM users WHERE id = '${req.params.id}'`)
  res.redirect('/users')
})

// profiles

app.get("/profiles", function (req,res){
  db.all(`SELECT * FROM profiles`, function (err, rows){
    db.all(`SELECT * FROM users`, function(err, rows2){
      res.render('profiles', {data : rows, data1 : rows2})
    })
  })
})

app.post('/profiles', function(req, res) {
  db.run(`INSERT INTO profiles(hometown, birth_year,relationship_status, user_id)VALUES("${req.body.hometown}","${req.body.birth_year}","${req.body.relationship_status}","${req.body.user_id}")`, function (err, data){
    if(!err){
        res.redirect('/profiles')
    }else{
      res.send('user terpakai')
    }
  })
})

//profiles edit

app.get("/profiles/edit/:id", function (req,res){
  db.all(`SELECT * FROM profiles WHERE id = ${req.params.id}`, function(err, data){
    db.all(`SELECT * FROM users`, function(err,data1){
      res.render(`editprofiles`, {data : data, data1 : data1})
    })
  })
})


app.post('/profiles/edit/:id', function(req,res) {
  db.run(`UPDATE  profiles SET hometown = "${req.body.hometown}", birth_year = "${req.body.birth_year}",relationship_status = "${req.body.relationship_status}", user_id = "${req.body.user_id}" WHERE id = ${req.params.id})`, function(err, data1){
    if(!err){
      res.redirect('/profiles')
    }
    else{
      res.send("id sudah terpakai")
    }
  })
})

//profile delete

app.get('/profiles/delete/:id', function(req,res){
  db.run(`DELETE FROM profiles WHERE id = '${req.params.id}'`)
  res.redirect('/profiles')
})

app.listen(3000, function() {
  console.log("sudah jalan di port 3000")
})
