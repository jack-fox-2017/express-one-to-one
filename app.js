//require
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('sqlite3').verbose();

let db = new sql.Database('./db/data.db'); //instances sql db with parameter: path of db file

app.use(bodyParser.json()); //use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); //set views directory with ejs file inside

//index
app.get('/', (req,res) => {
  res.render('index');
});

//users: show all users data
app.get('/users', (req, res)=>{
  let qry_showUsers = `SELECT * FROM Users`;
  db.all(qry_showUsers, (err, rows)=>{
    if (err)
      res.render('users', {data:err});
    else
      res.render('users',{data:rows});
  });
});

//users: insert user data
app.post('/users', (req, res)=>{
  let qry_InsertUser = `INSERT INTO Users (username, firstname, lastname, email) VALUES (
    '${req.body.username}',
    '${req.body.firstname}',
    '${req.body.lastname}',
    '${req.body.email}')`;
  db.run(qry_InsertUser);
  res.redirect('/users');
});

//users: get/show user data
app.get('/users/edit/:id', (req, res)=>{
  let qry_showUser = `SELECT * FROM Users WHERE id=${req.params.id}`;
  db.all(qry_showUser, (err, row)=>{
    if (err)
      res.render('edit-user', {data:err});
    else
      res.render('edit-user', {data:row[0]});
  });
});

//users: update user data
app.post('/users/edit/:id', (req,res)=>{
  let qry_updateUser = `UPDATE Users SET
    username='${req.body.username}',
    firstname='${req.body.firstname}',
    lastname='${req.body.lastname}',
    email='${req.body.email}'`;
  db.run(qry_updateUser);
  res.redirect('/users');
});

//users: delete user data
app.get('/users/delete/:id', (req, res)=>{
  let qry_delUser = `DELETE FROM Users WHERE id=${req.params.id}`;
  db.run(qry_delUser);
  res.redirect('/users');
});

//profiles: show all profiles data
app.get('/profiles', (req, res)=>{
  let qry_ShowProfiles = `SELECT * FROM Profiles`;
  let qry_showUsers = `SELECT * FROM Users`;
  db.all(qry_ShowProfiles, (err, rowProfile)=>{
    if(err)
      res.render('profiles', {dataProfiles:err});
    else
    db.all(qry_showUsers, (err, rowUser)=>{
      if (err)
        res.render('profiles', {dataUsers:err});
      else
        res.render('profiles',{dataUsers:rowUser, dataProfiles:rowProfile});
    });
      //res.render('profiles', {dataProfiles:rowProfile});
  });
});

app.get('/profiles', (req, res)=>{

});

app.post('/profiles', (req, res)=>{
  let qry_InsertProfile = `INSERT INTO Profiles (hometown, birth_year, relationship_status, users_id) VALUES
    ('${req.body.hometown}',${req.body.birth_year},'${req.body.relationship_status}', ${req.body.users_id})`;
  db.run(qry_InsertProfile);
  res.redirect('/profiles');
});

// //profiles
//
// app.get('/profiles/edit/:id', (req, res)=>{
//   db.all(`SELECT * FROM PROFILES WHERE id=${req.params.id}`, (err,rows) =>{
//     if(err){
//       throw err;
//     }
//     res.render('edit-profile',{data:rows});
//   });
// });
//
// app.post('/profiles/edit/:id', (req, res)=>{
//   db.run(`UPDATE PROFILES SET date_of_birth='${req.body.date_of_birth}', age='${req.body.age}', hobby='${req.body.hobby}' WHERE id=${req.params.id}`);
//   res.redirect('/profiles');
// });
//
// app.get('/profiles/del/:id', (req, res)=>{
//   db.run(`DELETE FROM PROFILES WHERE id=${req.params.id}`);
//   res.redirect('/profiles');
// });
//
//listen to localhost:3000
app.listen(3000, ()=>{
  console.log('listening on port 3000');
});
