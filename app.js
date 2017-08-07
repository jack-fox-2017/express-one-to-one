const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const app = express();
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/database.db')
app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))


//=====home

app.get("/",function(req, res) {
  res.render("home")
})
//=====USER
app.get("/users", function (req, res) {
  db.all(`SELECT * FROM Users`, function(err, db_Users) {
    res.render("users", {data_users : db_Users})
  })
})

app.get("/users/add", function(req, res) {
  res.render("users-add")
})

app.post("/users/add", function(req, res) {
  db.run(`INSERT INTO Users(username, firstname, lastname, email) VALUES ("${req.body.username}", "${req.body.firstname}", "${req.body.lastname}", "${req.body.email}")`)
    res.redirect("/users")
})

app.get("/users/edit/:id", function(req, res) {
  db.all(`SELECT * FROM Users WHERE id = "${req.params.id}"`, function(err, db_Users) {
    res.render("users-edit", {data_users : db_Users[0]})
  })
})
app.post("/users/edit/:id",function(req, res) {
  db.run(`UPDATE Users SET username = "${req.body.username}", firstname = "${req.body.firstname}", lastname = "${req.body.lastname}", email = "${req.body.email}" WHERE id = "${req.params.id}"`)
  res.redirect("/users")
})

app.get("/users/delete/:id", function(req, res) {
  db.run(`DELETE FROM Users WHERE id = ${req.params.id}`)
    res.redirect("/users")
})
//=====Profile

app.get("/profiles", function(req, res) {
  db.all(`SELECT * FROM Profiles`, function(err, db_Profiles) {
      db.all(`SELECT * FROM Users`, function(err, db_Users) {
        for(let i = 0; i < db_Profiles.length; i++){
          for (var j = 0; j < db_Users.length; j++) {
            if(db_Profiles[i].user_id == db_Users[j].id){
              db_Profiles[i].username = db_Users[j].username
            }
          }
        }
        res.render("profiles", {data_profiles : db_Profiles})
      })
  })
})

app.get("/profiles/add", function(req, res) {
  db.all(`SELECT * FROM Users`, function(err, db_Users) {
    // res.send(db_Users)
    res.render("profiles-add", {data_users : db_Users})
  })
})

app.post("/profiles/add", function(req, res) {
  db.run(`INSERT INTO Profiles(hometown, birth_year, relationship_status, user_id) VALUES
  ("${req.body.hometown}", "${req.body.birth_year}", "${req.body.relationship_status}", "${req.body.user_id}")`, function(err, solved) {
    if(!err){
      res.redirect("/profiles")
    }else{
      res.send("User Sudah Dipakai")
    }
  })
})

app.get("/profiles/edit/:id", function(req, res) {
  db.all(`SELECT * FROM Profiles WHERE id = "${req.params.id}"`, function(err, db_Profiles) {
    db.all(`SELECT * FROM Users`, function(err, db_Users) {
      res.render("profiles-edit", {data_profiles : db_Profiles[0], data_users : db_Users})
    })
  })
})
app.post("/profiles/edit/:id",function(req, res) {
  db.run(`UPDATE Profiles SET hometown = "${req.body.hometown}", birth_year = "${req.body.birth_year}",
  relationship_status = "${req.body.relationship_status}", user_id = "${req.body.user_id}" WHERE id = "${req.params.id}"`, function(err, solved) {
    if(!err){
      res.redirect("/profiles")
    }else{
      res.send("User Sudah Dipakai")
    }
  })
})

app.get("/profiles/delete/:id", function(req, res) {
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id}`)
    res.redirect("/profiles")
})

app.listen(3001)
