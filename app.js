const express = require(`express`);
const app = express()

const bodyParser = require(`body-parser`)
// body parser true
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const sqlite3 = require(`sqlite3`).verbose();
const db = new sqlite3.Database(`./db/data.db`)



app.set(`view engine`,`ejs`)

app.get(`/`, function(req,res){
  res.render('index', {welcome: `Selamat datang di landing page`})
})

// users page
app.get(`/users`,function(req,res){
  db.all(`SELECT * FROM users`, function(err, dataUsers) {
    res.render('users', {data: dataUsers})
  })
})

app.post(`/users`,function(req,res){
  //res.send(req.body)
  var add = `INSERT INTO
  users(username,firstname,lastname,email)
  VALUES('${req.body.username}','${req.body.first_name}','${req.body.last_name}','${req.body.email}')`
  db.run(add)
  res.redirect(`/users`)
})

app.get(`/users/edit`, function(req,res){
  var getData = `SELECT * FROM users WHERE id='${req.query.id}'`
  //res.send(getData)
  db.get(getData,function(err,dataUsers){
    //res.send(dataUsers)
    res.render('users-edit',{data: dataUsers})
  })
})

app.post(`/users/edit`, function(req,res){
  var updateData = `UPDATE users SET username='${req.body.username}',firstname='${req.body.first_name}',lastname='${req.body.last_name}',email='${req.body.email}' WHERE id='${req.query.id}'`
  db.run(updateData)
  res.redirect(`/users`)
})

app.get(`/users/delete`, function(req,res){
  var deleteData = `DELETE FROM users WHERE id='${req.query.id}'`
  db.run(deleteData)
  res.redirect(`/users`)
})


// profile
app.get(`/profiles`,function(req,res){
  var getProfilesJoinUsers = `SELECT * from users join profiles WHERE users.id = profiles.user_id`
  var getUsers = `SELECT * from users`
  db.all(getProfilesJoinUsers, function(err, dataProfiles) {
    if (!err) {
      db.all(getUsers, function(err,dataUsers){
        //res.send(dataProfiles)
        res.render('profiles', {profiles:dataProfiles, users:dataUsers, error:req.query.error})
      })
    } else {
      res.render('profiles', {profiles:dataProfiles, users:dataUsers, error:req.query.error})
    }
  })
})

app.post(`/profiles`,function(req,res){
  //res.send(req.body)
  var addProfiles = `INSERT INTO
  profiles(hometown,relationship_status,user_id)
  VALUES('${req.body.hometown}','${req.body.relationship_status}','${req.body.id_users}')`
  db.run(addProfiles,[],function(err,row){
    if(!err){
      res.redirect(`/profiles`)
    } else {
      res.redirect(`/profiles?error=`+err)
    }
  })

})

app.get(`/profiles/edit`, function(req,res){
  var getData = `SELECT * from users join profiles WHERE users.id = profiles.user_id AND profiles.id = '${req.query.id}'`
  db.get(getData,function(err,dataUsers){
    //res.send(dataUsers)
    res.render('profiles-edit',{data: dataUsers})
  })
})

app.post(`/profiles/edit`, function(req,res){
  var updateData = `UPDATE profiles SET hometown='${req.body.username}',relationship_status='${req.body.relationship_status}' WHERE id='${req.query.id}'`
  db.run(updateData)
  res.redirect(`/profiles`)
})

app.get(`/profiles/delete`, function(req,res){
  var deleteData = `DELETE FROM profiles WHERE id='${req.query.id}'`
  db.run(deleteData)
  res.redirect(`/profiles`)
})


app.listen(3003, function(){
  console.log(`Launch in port 3003`);
})
