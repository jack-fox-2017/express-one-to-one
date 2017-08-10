const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./database/data.db')
var app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//--------HomePage--------//
app.get("/", function(req, res) {
  res.render("index")
})


//--------UserPage--------//
app.get("/user", function(req, res) {
  db.all('SELECT * FROM Users', function(err, rows) {
    if(!err) {
      res.render('user', {data: rows})
    }
  })
})

app.post("/user", function(req, res) {
  db.run(`INSERT INTO Users(username, firstname, lastname, email) VALUES ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}')`)
  res.redirect('/user')
})

//***EditUser***//
app.get("/user/edit-user/:id", function(req, res) {
  db.all(`SELECT * FROM Users WHERE ID = '${req.params.id}'`, function(err, rows) {
    if(!err) {
      res.render('edit-user', {data: rows})
    }
  })
})

app.post("/user/edit-user/:id", function(req, res) {
  db.run(`UPDATE Users set username = '${req.body.username}', firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = ${req.params.id};`)
  res.redirect("/user")
})

//***DeleteUser***//
app.get("/user/delete/:id", function(req, res) {
  db.run(`DELETE FROM Users WHERE id = ${req.params.id}`)
  res.redirect("/user")
})


//--------ProfilePage--------//
app.get("/profile", function(req, res) {
  db.all('SELECT Profiles.*, Users.*, Profiles.id AS profile_id FROM Profiles LEFT JOIN Users ON Users.id = Profiles.user_id', function(err, rows) {
    db.all('SELECT * FROM Users', function(err,rowsUser) {
      if(!err) {
        res.render('profile', {data: rows, dataUser: rowsUser, pesan: false,})
      }
    })
  })
})

app.post("/profile", function(req, res) {
  db.run(`INSERT INTO Profiles (hometown, birth_year, relationship_status, user_id) VALUES ('${req.body.hometown}', '${req.body.birth_year}', '${req.body.relationship_status}', '${req.body.user_id}')`, function(err, msg) {
    if (!err) {
    res.redirect('/profile')
  }else {
    db.all('SELECT * FROM Profiles LEFT JOIN Users ON Users.id = Profiles.user_id', function(err, rows) {
      db.all('SELECT * FROM Users', function(err,rowsUser) {
        if(!err) {
          res.render('profile', {data: rows, dataUser: rowsUser, pesan: "Sudah Dipakai",})
        }
      })
    })
  }
  })
})

//***EditProfile***//
app.get("/profile/edit-profile/:id", function(req, res) {
  db.all(`SELECT * FROM Profiles WHERE id = '${req.params.id}'`, function(err, rows) {
    db.all(`SELECT * FROM Users`, function(err,rowsUser) {
      db.all(`SELECT * FROM Profiles LEFT JOIN Users ON Users.id = Profiles.user_id`, function(err, rowProfile) {
        if(!err) {
          res.render('edit-profile', {data: rows[0], dataUser:rowsUser, pesan2: false})
        }
      })
    })
  })
})

app.post("/profile/edit-profile/:id", function(req, res) {
  // res.send(req.body)
  db.run(`UPDATE Profiles set hometown = '${req.body.hometown}', birth_year = ${req.body.birth_year}, relationship_status = '${req.body.relationship_status}', user_id = ${req.body.user_id} WHERE id = ${req.params.id};`, function(err,msg) {
    if(!err) {
    res.redirect("/profile")
  }else {
    db.all('SELECT * FROM Profiles LEFT JOIN Users ON Users.id = Profiles.user_id', function(err, rows) {
      db.all('SELECT * FROM Users', function(err,rowsUser) {
        if(!err) {
          res.render('profile', {data: rows, dataUser: rowsUser, pesan2: "Sudah Dipakai",})
        }
      })
    })
  }
})
})
//***DeleteProfile***//
app.get("/profile/delete/:id", function(req, res) {
  db.run(`DELETE FROM Profiles WHERE id = ${req.params.id}`)
  res.redirect("/profile")
})



app.listen(3000, function() {
  console.log("Im Listen Port 3000!");
})
