const express = require('express')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

router.get('/', (req, res) => {
  db.all(`SELECT * FROM profiles`, (errP, rowsP) => {
    if (errP) throw errP

    db.serialize(function() {
      rowsP.forEach((rowP, index) => {
        db.get(`SELECT name FROM contacts WHERE id = ${rowP.contact_id}`, (err, row) => {
          rowsP[index].contact_name = row.name
        })
      })

      db.all(`
        SELECT 
          contacts.id,
          contacts.name

          FROM contacts 
            LEFT JOIN profiles 
              ON contacts.id=profiles.contact_id 
                WHERE profiles.contact_id is null
      `, (errC, rowsC) => {
        if (errC) throw errC
        res.render('profiles', {
          data: rowsP,
          contacts: rowsC
        })
      })
      
    })

  })
})

router.post('/', (req, res) => {
  db.run(`INSERT INTO profiles (username, password, contact_id) VALUES (
    '${req.body.username}',
    '${req.body.password}',
    ${req.body.contact_id == '' ? null : req.body.contact_id}
  )`, function(err) {
    if (err) throw err
    res.redirect('/profiles')
  })
})

router.get('/edit/:id', (req, res) => {
  db.all(`
    SELECT
      profiles.*,
      contacts.name as contact_name
      
      FROM profiles 
        LEFT JOIN contacts 
          ON contacts.id = profiles.contact_id
            WHERE profiles.id = ${req.params.id}
  `, (errP, rowsP) => {
    if (errP) throw errP

      rowsP.forEach(item => {

      })

      db.all(`
        SELECT 
          contacts.id,
          contacts.name

          FROM contacts 
            LEFT JOIN profiles 
              ON contacts.id = profiles.contact_id
                WHERE profiles.contact_id = ${rowsP[0].contact_id} OR profiles.contact_id is null
      `, (errC, rowsC) => {
        if (errC) throw errC
        res.render('profiles-edit', {
          data: rowsP,
          contacts: rowsC
        })
      })
  })
})

router.post('/edit/:id', (req, res) => {
  db.run(`UPDATE profiles SET
    username = '${req.body.username}',
    password = '${req.body.password}',
    contact_id = ${req.body.contact_id == '' ? null : req.body.contact_id}
    WHERE id = ${req.params.id}
  `, function(err) {
    res.redirect('/profiles')
  })

})

router.get('/delete/:id', (req, res) => {
  db.run(`DELETE FROM profiles WHERE id = ${req.params.id}`, function(err) {
    res.redirect('/profiles')
  })
})

module.exports = router