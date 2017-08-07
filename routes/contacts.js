const express = require('express')
let router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

router.get('/', (req, res) => {
  db.all(`SELECT * FROM contacts`, (errC, rowsC) => {
    if (errC) throw errC
    res.render('contact', {data: rowsC})
  })
})

router.post('/', (req, res) => {
  db.run(`INSERT INTO contacts (name, company, telp_number, email) VALUES (
    '${req.body.name}',
    '${req.body.company}',
    '${req.body.telp_number}',
    '${req.body.email}'
  )`, function() {
    res.redirect('/contacts')
  })

})

router.get('/edit/:id', (req, res) => {
  db.all(`SELECT * FROM contacts WHERE id=${req.params.id}`, (err, rows) => {
    if (err) throw err
    res.render('contacts-edit', {data: rows})
  })
})

router.post('/edit/:id', (req, res) => {
  db.run(`UPDATE contacts SET
    name = '${req.body.name}',
    company = '${req.body.company}',
    telp_number = '${req.body.telp_number}',
    email = '${req.body.email}'
    WHERE id = ${req.params.id}
  `, function(err) {
    res.redirect('/contacts')
  })
})

router.get('/delete/:id', (req, res) => {
  db.run(`DELETE FROM contacts WHERE id = ${req.params.id}`, function(err) {
    res.redirect('/contacts')
  })
})

module.exports = router
