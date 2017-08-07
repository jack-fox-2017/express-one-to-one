'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const sql = require('sqlite3')

const db = new sql.Database('./db/data.db')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

///////////////////////////////  INDEX  ///////////////////////////////

app.get('/', function(req, res) {
  res.render('index')
})

///////////////////////////////  CONTACS  ///////////////////////////////

app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (!err) {
      res.render('contacts', {
        data: rows
      })
    }
  })
})

/////////////////////////////// POST CONTACTS  ///////////////////////////////

app.post('/contacts', (req, res) => {
  db.run(`INSERT INTO contacts(first_name, last_name, company, telp_number, email) VALUES ('${req.body.first_name}', '${req.body.last_name}', '${req.body.company}', '${req.body.telp_number}', '${req.body.email}')`)
  res.redirect('/contacts')
})


///////////////////////////////  EDIT CONTACTS  ///////////////////////////////

app.get('/contacts/edit/:id', (req, res) => {
  db.all(`SELECT * FROM contacts WHERE id = ${req.params.id}`, (err, rows) => {
    if (!err) {
      res.render('editcontact', {
        data: rows
      })
    }
  })
})

///////////////////////////////  UPDATE CONTACTS ///////////////////////////////

app.post('/contacts/edit/:id', (req, res) => {
  db.run(`UPDATE contacts set first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', company = '${req.body.company}', telp_number = '${req.body.telp_number}', email = '${req.body.email}' WHERE id = ${req.params.id};`)
  res.redirect('/contacts')
})

///////////////////////////////  DELETE CONTACTS  ///////////////////////////////

app.get('/contacts/delete/:id', (req, res) => {
  db.run(`DELETE FROM contacts WHERE id = ${req.params.id};`)
  res.redirect('/contacts')
})

///////////////////////////////  CONTACTS PROFILE  ///////////////////////////////

///////////////////////////////  GROUPS  ///////////////////////////////

app.get('/groups', (req, res) => {
  db.all('SELECT * FROM groups', (err, rows) => {
    if (!err) {
      res.render('groups', {
        data: rows
      })
    }
  })
})

app.get('/groups/details', (req, res) => {
  db.all(`SELECT groups_id, name_of_groups, name `)
})


///////////////////////////////  POST GROUPS  ///////////////////////////////

app.post('/groups', (req, res) => {
  db.run(`INSERT INTO groups(name_of_groups) VALUES ('${req.body.name_of_groups}')`)
  res.redirect('/groups')
})

///////////////////////////////  EDIT GROUPS  ///////////////////////////////

app.get('/groups/edit/:id', (req, res) => {
  db.all(`SELECT * FROM groups WHERE id = ${req.params.id}`, (err, rows) => {
    if (!err) {
      res.render('editgroups', {
        data: rows
      })
    }
  })
})

app.get('/groups/')

///////////////////////////////  UPDATE GROUPS  ///////////////////////////////

app.post('/groups/edit/:id', (req, res) => {
  db.run(`UPDATE groups set name_of_groups = '${req.body.name_of_groups}' WHERE id = ${req.params.id};`)
  res.redirect('/groups')
})

///////////////////////////////  DELETE GROUPS  ///////////////////////////////

app.get('/groups/delete/:id', (req, res) => {
  db.run(`DELETE FROM groups WHERE id = ${req.params.id};`)
  res.redirect('/groups')
})

///////////////////////////////  ADDRESS  ///////////////////////////////

app.get('/address', (req, res) => {
  db.all('SELECT * FROM address', (err, rows) => {
    if (!err) {
      res.render('address', {
        data: rows
      })
    }
  })
})

///////////////////////////////  POST ADDRESS  ///////////////////////////////

app.post('/address', (req, res) => {
  db.run(`INSERT INTO address(street, city, zip_code, province) VALUES('${req.body.street}', '${req.body.city}', '${req.body.zip_code}', '${req.body.province}')`)
  res.redirect('/address')
})

///////////////////////////////  EDIT ADDRESS  ///////////////////////////////

app.get('/address/edit/:id', (req, res) => {
  db.all(`SELECT * FROM address WHERE id = ${req.params.id}`, (err, rows) => {
    if (!err) {
      res.render('editaddress', {
        data: rows
      })
    }
  })
})

///////////////////////////////  UPDATE ADDRESS  ///////////////////////////////

app.post('/address/edit/:id', (req, res) => {
  db.run(`UPDATE address set street = '${req.body.street}', city = '${req.body.city}', zip_code = '${req.body.zip_code}', province = '${req.body.province}' WHERE id = ${req.params.id};`)
  res.redirect('/address')
})

///////////////////////////////  DELETE ADDRESS  ///////////////////////////////

app.get('/address/delete/:id', (req, res) => {
  db.run(`DELETE FROM address WHERE id = ${req.params.id};`)
  res.redirect('/address')
})

///////////////////////////////  PROFILES  ///////////////////////////////

app.get('/profiles', (req, res) => {
  db.all(`SELECT * FROM profiles`, (err, profileData) => {
    db.all(`SELECT id, first_name, last_name FROM contacts`, (error, contactData) => {
      res.render('profiles', {
        data: profileData, datacont: contactData, err_msg: false
      })
    })
  })
})

// app.get('/profiles', (req, res) => {
//   db.all('SELECT * FROM profiles', (err, rows) => {
//     if (!err) {
//       res.render('profiles', {
//         data: rows
//       })
//     }
//   })
// })

///////////////////////////////  POST PROFILES  ///////////////////////////////

app.post('/profiles', (req, res) => {
  db.run(`INSERT INTO profiles(id_name, username, password) VALUES ('${req.body.id_name}', '${req.body.username}', '${req.body.password}')`)
  res.redirect('/profiles')
})

///////////////////////////////  EDIT PROFILES  ///////////////////////////////

app.get('/profiles/edit/:id', (req, res) => {
  db.all(`SELECT * FROM profiles WHERE id = ${req.params.id}`, (err, rows) => {
    if (!err) {
      res.render('editprofiles', {
        data: rows
      })
    }
  })
})

///////////////////////////////  UPDATE PROFILES  ///////////////////////////////

app.post('/profiles/edit/:id', (req, res) => {
  db.run(`UPDATE profiles set id_name = '${req.body.id_name}', username = '${req.body.username}', password = '${req.body.password}' WHERE id = ${req.params.id};`)
  res.redirect('/profiles')
})

///////////////////////////////  DELETE PROFILES  ///////////////////////////////

app.get('/profiles/delete/:id', (req, res) => {
  db.run(`DELETE FROM profiles WHERE id = ${req.params.id};`)
  res.redirect('/profiles')
})

app.listen(3006, ()=> {
  console.log('I am listening port 3000');
})
