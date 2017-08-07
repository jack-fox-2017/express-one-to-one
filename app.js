const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  // res.send('ok running yak')
  res.render('index')
})

//ROUTING KONTAK
app.get('/contacts', (req, res) => {
  db.all(`SELECT * FROM Contact ORDER BY id DESC`, (err, data) => {
    res.render('contact', {contactData: data})
  })
})

app.post('/contacts', (req, res) => {
  db.run(`INSERT INTO Contact (name, company, phone, email) VALUES
  ('${req.body.name}', '${req.body.company}', ${req.body.phone}, '${req.body.email}')`)
  res.redirect('/contacts')
})

app.get('/contacts/:id/edit', (req, res) => {
  db.all(`SELECT * FROM Contact where id=${req.params.id}`, (err, data) => {
    res.render('contact-edit', {edit: data[0]})
  })
})

app.post('/contacts/:id/edit', (req, res) => {
  db.run(`UPDATE Contact SET name='${req.body.name}', company='${req.body.company}', phone='${req.body.phone}', email='${req.body.email}' WHERE id='${req.params.id}'`)
  res.redirect('/contacts')
})

app.get('/contacts/:id/delete', (req, res) => {
  db.run(`DELETE from Contact where id=${req.params.id};`);
  res.redirect('/contacts')
})


//ROUTER GROUPS
app.get('/groups', (req, res) => {
  db.all(`select * from Grup ORDER BY id DESC`, (err, data) => {
    if(!err){
      res.render('group', {groupData: data})
    }
  });
})

app.post('/groups', (req, res) => {
  db.run(`INSERT INTO Grup (name) VALUES ('${req.body.name}')`);
  res.redirect('/groups')
})


app.get('/groups/:id/edit', (req, res) => {
  db.all(`select * from Grup where id='${req.params.id}'`, (err, data) => {
    res.render('group-edit', {edit: data[0]})
    // res.send(data)
  })
})

app.post('/groups/:id/edit', (req, res) => {
  db.run(`UPDATE Grup set name='${req.body.name}' where id=${req.params.id}`)
  res.redirect('/groups')
})

app.get('/groups/:id/delete', (req, res) => {
  db.run(`delete from Grup where id=${req.params.id}`)
  res.redirect('/groups')
})

//ROUTER PROFILE
app.get('/profiles', (req, res) => {
  db.all(`select * from Contact`, (err, data) => {
    db.all(`select * from Profile ORDER BY id DESC`, (err, profile) => {
      res.render('profile', {kontak: data, profileData: profile, pesan: false})
    })
  })
})

app.post('/profiles', (req, res) => {
  db.all(`select * from Profile where ContactId=${req.body.ContactId} OR username='${req.body.username}'`, (err, cekProfil) => {
    if(cekProfil.length == 0){
      db.run(`INSERT INTO Profile (username, password, firstname, lastname, ContactId) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.firstname}', '${req.body.lastname}', ${req.body.ContactId})`)
      res.redirect('/profiles')
    } else {
      db.all(`select * from Contact`, (err, data) => {
        db.all(`select * from Profile ORDER BY id DESC`, (err, profile) => {
          res.render('profile', {kontak: data, profileData: profile, pesan: 'Maaf!!!\nUsername dan Contact ID yang anda masukkan tidak dapat digunakan!!!'})
        })
      })
    }
  })
})

app.get('/profiles/:id/edit', (req, res) => {
  db.all(`select * from Profile where id=${req.params.id}`, (err, data) => {
    db.all(`select * from Contact`, (err, dataKontak) => {
      res.render('profile-edit', {dataProfile: data[0], dataKontak: dataKontak, pesan: false})
    })
  })
})

app.post('/profiles/:id/edit', (req, res) => {
  db.all(`select * from Profile where ContactId=${req.body.ContactId} OR username='${req.body.username}'`, (err, cekProfil) => {
    // res.send(cekProfil)
    if(cekProfil.length == 1){
      db.run(`UPDATE Profile set  username='${req.body.username}', password='${req.body.password}', firstname='${req.body.firstname}', lastname='${req.body.lastname}' where id=${req.params.id}`)
      res.redirect('/profiles')
    } else {
      db.all(`select * from Profile where id=${req.params.id}`, (err, data) => {
        db.all(`select * from Contact`, (err, dataKontak) => {
          res.render('profile-edit', {dataProfile: data[0], dataKontak: dataKontak, pesan: 'Contact Id sudah terdaftar!!!'})
        })
      })
    }
  })
})

app.get('/profiles/:id/delete', (req, res) => {
  db.run(`DELETE from Profile where id=${req.params.id}`)
  res.redirect('/profiles')
})


//ROUTER ADDRESS
app.get('/addresses', (req, res) => {
  db.all(`select * from Contact`, (err, data) => {
    db.all(`select * from Address ORDER BY id DESC`, (err, dataAddress) => {
      res.render('address', {kontak: data, addressData: dataAddress})
    })
  })
})

app.post('/addresses', (req, res) => {
  db.run(`insert into Address (address, city, zipcode, ContactId) VALUES ('${req.body.address}', '${req.body.city}', ${req.body.zipcode}, ${req.body.ContactId})`)
  res.redirect('/addresses')
})

app.get('/addresses/:id/edit', (req, res) => {
  db.all(`select * from Address where id=${req.params.id}`, (err, data) => {
    db.all(`select * from Contact`, (err, dataKontak) => {
      res.render('address-edit', {data: data[0], kontak: dataKontak})
    })
  })
})

app.post('/addresses/:id/edit', (req, res) => {
  db.run(`UPDATE Address set
    address='${req.body.address}',
    city='${req.body.city}',
    zipcode=${req.body.zipcode},
    ContactId=${req.body.ContactId}
    where id=${req.params.id}`)
  res.redirect('/addresses')
})

app.get('/addresses/:id/delete', (req, res) => {
  db.run(`DELETE from Address where id=${req.params.id}`)
  res.redirect('/addresses')
})


app.listen(process.env.PORT || 3000)
