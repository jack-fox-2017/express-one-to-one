const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('db/data.db')

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  // res.send('hello')
  res.render('index')
})

// ------------------------------------------------- USERS ----------------------------------------------------

app.get('/users', (req, res) => {
  let query = `SELECT * FROM Users;`
  db.all(query, (err, rows) => {
    res.render('users', {data: rows})
  })
})

app.post('/users', (req, res) => {
  let query = `INSERT INTO Users (username, firstname, lastname, email) VALUES ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}');`
  db.run(query)
  res.redirect('/users')
})

app.get('/users/delete/:id', (req, res) => {
  let query = `DELETE FROM Users WHERE id = ${req.params.id};`
  db.run(query)
  res.redirect('/users')
})

app.get('/users/edit/:id', (req, res) => {
  let query = `SELECT * FROM Users WHERE id = ${req.params.id};`
  db.all(query, (err, rows) => {
    res.render('users_edit', {data: rows[0]})
  })
})

app.post('/users/edit/:id', (req, res) => {
  let query = `UPDATE Users SET username = '${req.body.username}', firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', email = '${req.body.email}' WHERE id = ${req.params.id};`
  db.run(query)
  res.redirect('/users')
})



// ------------------------------------------------- USERS ----------------------------------------------------

app.get('/profiles', (req, res) => {
  let query = `SELECT * FROM Profiles;`
  let query2 = `SELECT * FROM Users;`
  db.all(query, (err, rows) => {
    db.all(query2, (err2, rows2) => {
      res.render('profiles', {data: rows, data2: rows2})
    })
  })
})

app.post('/profiles', (req, res) => {
  let query = `INSERT INTO Profiles (hometown, birth_year, relationship_status, UserId) VALUES ('${req.body.hometown}', '${req.body.birth_year}', '${req.body.relationship_status}', ${req.body.UserId});`
  db.run(query, (err, solve) => {
    // res.redirect('/profiles')
    if (!err) {
      res.redirect('/profiles')
    }
    else {
      res.send(err.code)
    }
  })
})

app.get('/profiles/delete/:id', (req, res) => {
  let query = `DELETE FROM Profiles WHERE id = ${req.params.id};`
  db.run(query)
  res.redirect('/profiles')
})

app.get('/profiles/edit/:id', (req, res) => {
  let query = `SELECT * FROM Profiles WHERE id = ${req.params.id};`
  let query2 = `SELECT * FROM Users;`
  db.all(query, (err, rows) => {
    db.all(query2, (err2, rows2) => {
      res.render('profiles_edit', {data: rows[0], data2: rows2})
    })
  })
})

app.post('/profiles/edit/:id', (req, res) => {
  let query = `UPDATE Profiles SET hometown = '${req.body.hometown}', birth_year = ${req.body.birth_year}, relationship_status = '${req.body.relationship_status}', UserId = ${req.body.UserId} WHERE id = ${req.params.id};`
  db.run(query, (err, solve) => {
    if (!err) {
      res.redirect('/profiles')
    }
    else {
      res.send(err.code)
    }
  })
})



app.listen(3000)
