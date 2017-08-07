const express = require('express');
const app = express()
const bodyParser = require('body-parser')
var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('./db/data.db')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

app.get('/', function(req,res) {
  res.render('index')
})

app.get('/users', function(req,res) {
  db.all(`SELECT * FROM Users`, (err, userData) => {
    // console.log(userData);
    res.render('users', {user: userData})
  })
})

app.post('/users', (req,res) => {
  db.run(`INSERT INTO Users (username, firstname, lastname, email)
          VALUES ('${req.body.username}','${req.body.firstname}','${req.body.lastname}','${req.body.email}')`)
  res.redirect('/users')
})

app.get('/users/edit/:id', function(req,res) {
  let id = req.params.id
  db.all(`SELECT * FROM Users WHERE id = ${id}`, (err, userData) => {
    res.render('edit-user', {user: userData[0]})
  })
})

app.post('/users/edit/:id', function(req, res) {
  let id = req.params.id
  db.run(`UPDATE Users SET username='${req.body.username}',
  firstname='${req.body.firstname}',lastname='${req.body.lastname}',email='${req.body.email}'
  WHERE id=${id}`)
  res.redirect('/users')
})

app.get('/users/delete/:id', (req,res) => {
  db.run(`DELETE FROM Users WHERE id=${req.params.id}`)
  res.redirect('/users')
})

app.get('/profiles', function(req,res) {
  db.all(`SELECT * FROM Profiles`, (err, profileData) => {
    db.all(`SELECT id,username FROM Users`, (err2, userData) => {
      for(let i = 0; i < profileData.length; i++){
          for (var j = 0; j < userData.length; j++) {
            if(profileData[i].user_id == userData[j].id){
              profileData[i].username = userData[j].username
            }
          }
        }
      res.render('profiles', {prf: profileData, user:userData, err_msg:false})
    })
  })
})

// app.post('/profiles', (req,res) => {
//   db.all(`SELECT * FROM Profiles`, (err, profileData) => {
//     db.all(`SELECT id,username FROM Users`, (err2, userData) => {
//       db.run(`INSERT INTO Profiles (hometown, relationship_status, user_id)
//           VALUES ('${req.body.hometown}','${req.body.relationship_status}','${req.body.user_id}')`, (err3) => {
//             if(!err3) {
//               // console.log(data);
//               res.redirect('/profiles')
//             } else {
//               res.render('profiles', {prf: profileData, user:userData, err_msg: "user sudah ada"})
//             }
//       })
//     })
//   })
// })

app.post('/profiles', (req,res) => {
  db.run(`INSERT INTO Profiles (hometown, relationship_status, user_id)
          VALUES ('${req.body.hometown}','${req.body.relationship_status}','${req.body.user_id}')`, (err3) => {
            if(!err3) {
              // console.log(data);
              res.redirect('/profiles')
            } else {
              db.all(`SELECT * FROM Profiles`, (err, profileData) => {
                db.all(`SELECT id,username FROM Users`, (err2, userData) => {
                  for(let i = 0; i < profileData.length; i++){
                      for (var j = 0; j < userData.length; j++) {
                        if(profileData[i].user_id == userData[j].id){
                          profileData[i].username = userData[j].username
                        }
                      }
                    }
                  res.render('profiles', {prf: profileData, user:userData, err_msg: "user sudah ada"})
                })
              })
            }
  })
})

app.get('/profiles/edit/:id', function(req,res) {
  let id = req.params.id
  db.all(`SELECT * FROM Profiles WHERE id = ${id}`, (err, profilData) => {
    db.all(`SELECT id,username FROM Users`, (err2, userData) => {
      res.render('edit-profile', {prf: profilData[0], user: userData, err_msg:false})
    })
  })
})

app.post('/profiles/edit/:id', function(req, res) {
  let id = req.params.id
  db.all(`SELECT * FROM Profiles WHERE id = ${id}`, (err, profilData) => {
    db.all(`SELECT id,username FROM Users`, (err2, userData) => {
      db.run(`UPDATE Profiles SET hometown='${req.body.hometown}',
      relationship_status='${req.body.relationship_status}', user_id='${req.body.user_id}'
      WHERE id=${id}`, err3 => {
        if(!err3) {
          res.redirect('/profiles')
        } else {
          res.render('edit-profile', {prf: profilData[0], user: userData, err_msg:"Sorry user sudah ada"})
        }
      })
    })
  })
})

app.get('/profiles/delete/:id', (req,res) => {
  db.run(`DELETE FROM Profiles WHERE id=${req.params.id}`)
  res.redirect('/profiles')
})

app.listen(3000, function() {
  console.log('I am listening port 3000');
})
