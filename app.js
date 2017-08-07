var express = require('express');
var path = require('path');
var sqlite3 = require('sqlite3')
    .verbose();
var bodyParser = require('body-parser')
// var setup = require('./setup.js')


var db = new sqlite3.Database('./db/data.db');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))



app.get('/', function (req, res) {
    res.render('index', {
        title: 'WELCOME'
    })
})

//EDIT PAGE
app.get('/users/edit/:id', function (req, res) {
    db.all(`select * from users where id = ${req.params.id}`, function (err, rows) {
        if (!err) {
            res.render('editU', {
                cont: rows
            })
        }
    })
})

// EDIT
app.post('/users/edit/:id', function (req, res) {
    // console.log(req.body);
    db.run(`UPDATE users SET username = '${req.body.username}', firstname = '${req.body.fname}', lastname = '${req.body.lname}', email = '${req.body.email}'  WHERE id = ${req.params.id};`)
    res.redirect('/users')
})

//DELETE
app.get('/users/delete/:id', function (req, res) {
    // console.log(req.body);
    db.run(`DELETE FROM users WHERE id = ${req.params.id};`)
    res.redirect('/users')
})

// LIST
app.get('/users', function (req, res) {
    db.all(`SELECT * FROM users`, function (err, rows) {
        if (!err) {
            res.render('users', {
                dataUser: rows,
                error_msg: req.query.err
            })
        }
    })
})

// ADD
app.post('/users', function (req, res) {
    // console.log(req.body);
    if (req.body.username == '') {
        res.redirect('/users?err=Username Must Not Empty')
    } else {
        db.run(`INSERT INTO users (username, firstname, lastname, email)
    VALUES ('${req.body.username}', '${req.body.fname}', '${req.body.lname}', '${req.body.email}');`)
        console.log('Data created');
        res.redirect('/users')
    }
})


//profiles


app.get('/profiles', function (req, res) {
    db.all(`SELECT * FROM profiles`, function (err, rows) {
        if (!err) {
            res.render('profiles', {
                dataProfiles: rows,
                error_msg: req.query.err
            })
        }
    })
})

app.post('/profiles', function (req, res) {
    // console.log(req.body);
    if (req.body.hometown == '') {
        res.redirect('/profiles?err=Hometown Must Not Empty')
    } else {
        db.run(`INSERT INTO profiles (hometown, birth_year, relationship_status)
    VALUES ('${req.body.hometown}', '${req.body.year}', '${req.body.status}');`)
        console.log('Data created');
        res.redirect('/profiles')
    }

})

app.get('/profiles/add/:id', function (req, res) {
    db.all(`select * from users`, function (err, rows) {
        if (!err) {
            res.render('addUser', {
                data: rows
            })
        }
    })
})

app.post('/profiles/add/:id', function (req, res) {
    // console.log(req.body);
    db.run(`UPDATE profiles SET user_id = '${req.body.id}'  WHERE id = '${req.params.id}';`)
    console.log('Data created');
    res.redirect('/profiles')
})

//EDIT PAGE
app.get('/profiles/edit/:id', function (req, res) {
    db.all(`select * from profiles where id = ${req.params.id}`, function (err, rows) {
        if (!err) {
            res.render('editP', {
                cont: rows
            })
        }
    })
})

// EDIT
app.post('/profiles/edit/:id', function (req, res) {
    // console.log(req.body);
    db.run(`UPDATE profiles SET hometown = '${req.body.hometown}', birth_year = '${req.body.year}', relationship_status = '${req.body.status}'  WHERE id = ${req.params.id};`)
    res.redirect('/profiles')
})

//DELETE
app.get('/profiles/delete/:id', function (req, res) {
    // console.log(req.body);
    db.run(`DELETE FROM profiles WHERE id = ${req.params.id};`)
    res.redirect('/profiles')
})


app.listen(3000);