const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/data.db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
 }));

app.set('view engine', 'ejs');

//TES INDEX
app.get('/', function(req,res){
  //res.send('index')
  res.render('index')
})

//----------------------------CONTACT-------------------------------
app.get('/users', function(req,res){
  db.all(`SELECT * FROM users`, function(err,rows){
    if(err){
      res.render('users',{data: rows,})
    }
  })
})

app.post('/users', function(req,res){
  db.run(`INSERT INTO users(username,firstname,lastname,email)
          VALUES ('${req.body.username}','${req.body.firstname}',
          '${req.body.lastname}','${req.body.email}')
          `)
  res.redirect(`/users`)
})

//cek
app.get('/users/edit/:id', function(req,res){
  db.each(`SELECT * FROM users WHERE id=${req.params.id}`, function(err,rows){
    if(!err){
      res.render('editusers',{data: rows})
    }
    else{
      res.render('editusers',{data: rows, err_msg:'error nih'})
    }
  })
})

//cek...
app.post('/users/edit/:id', function(req,res){
  db.run(`UPDATE users SET username='${req.body.username}',
  firstname='${req.body.firstname}',
  lastname='${req.body.lastname}',
  email='${req.body.email}' WHERE id=${req.params.id}`)
  res.redirect(`/users`)
  // res.send(req.body)
})

//cek
app.get('/users/delete/:id', function(req,res){
  db.run(`DELETE FROM users WHERE id=${req.params.id}`)
  res.redirect(`/users`)
})

//-------------------------------PROFILE----------------------------

app.get('/profile', function(req,res){
  db.all(`SELECT * FROM profiles`, function(err,rows){
    db.all(`SELECT * FROM users`, function(err2,rowsUser){
      // console.log(rows);
      if(!err2){
        res.render('profile',{data: rows, dataUsers:rowsUser})
      }
      else{
        res.render('profile',{data: rows, dataUsers:rowsUser,err_msg:'error nih'})
      }
    })
  })
})


app.post('/profile', function(req,res){
  db.run(`INSERT INTO profiles(hometown,birth_year,relationship_status,user_id)
          VALUES('${req.body.hometown}',
                  ${req.body.birth_year},
                  '${req.body.relationship_status}',
                  ${req.body.user_id})
                  `)
  res.redirect('/profile')
})

app.get('/profile/edit/:id', function(req,res){
  db.all(`SELECT * FROM profiles WHERE id = ${req.params.id}`, function(err,rows){
      db.all(`SELECT * FROM users`, function(err,rowsUser){
        if(!err){
          res.render('editprofile',{data: rows, dataUsers:rowsUser})
        }
      })
  })
})

app.post('/profile/edit/:id', function(req,res){
  db.run(`UPDATE profiles SET hometown='${req.body.hometown}',
          birth_year='${req.body.birth_year}',
          relationship_status='${req.body.relationship_status}',
          user_id=${req.body.user_id}
          WHERE id=${req.params.id}`)
  res.redirect('/profile')
})

app.get('/profile/delete/:id', function(req,res){
  db.run(`DELETE FROM profiles WHERE id=${req.params.id}`)
  res.redirect('/profile')
})

//----------------------------------------------------------------------------
app.listen(3000, function(){
  console.log("Port 3000 on my way");
});
