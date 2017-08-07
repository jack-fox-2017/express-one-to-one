var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()
var database = require('./setup');
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./db/database.db');

app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, '/public')));
//sett database and checkit up
app.get('/setupdb', function(req, res){
	database()
	res.send('Berhasil setup database')
})

//halaman index route
app.get('/', function(req, res){
	res.render('index')
})

//contact route
app.get('/contact', function(req, res){
	db.all(`SELECT * FROM Contact`, function(err, rows){
		res.render('contact', {contact_data : rows})
	})
})

app.get('/addContact', function(req, res){
	res.render('addContact')
	//, ('addContact', {msg: err})
})

app.post('/addContact', function(req, res){
	if(req.body.name == "" && req.body.company == "" && req.body.telp == ""){
		res.redirect('/addContact?err=test')
	} else{
		db.run(`INSERT INTO Contact(name, company, telp_number, email) VALUES ('${req.body.name}', '${req.body.company}', '${req.body.telp_number}', '${req.body.email}')`)
	 	res.redirect('/contact');
	}
})

app.get('/contact/edit/:id', function (req, res){
	db.all(`SELECT * FROM Contact WHERE id = '${req.params.id}'`, function(err, rows){
		res.render('editContact', {edit_contact: rows});
	});
});

app.post('/contact/edit/:id', function(req, res){
	db.run(`UPDATE Contact SET name ='${req.body.name}', company = '${req.body.company}',telp_number ='${req.body.telp_number}',email ='${req.body.email}' WHERE id = '${req.params.id}'`)
	res.redirect('/contact')
});

app.get('/contact/delete/:id', function (req, res) {
	db.run(`DELETE FROM Contact WHERE id = '${req.params.id}' `, function(err, rows){
		res.redirect('/contact');
	});
});


//profile route
app.get('/profile', function(req, res){
	db.all(`SELECT * FROM Profile`, function(err, rows){
		res.render('profile', {profile_data: rows})
	})
})

app.get('/addProfile', function(req, res){
	db.all(`SELECT id, name FROM Contact`, function(err, data){
		res.render('addProfile', {contact: data, err_msg: false})
	})
})

app.post('/addProfile', function(req, res){
	db.all(`SELECT id, name FROM Contact`, function(err, data){
		db.run(`INSERT INTO Profile(nickname, account, contact_id) VALUES ('${req.body.nickname}', '${req.body.account}', '${req.body.contact_id}')`, function(err){
			if(!err){
				res.redirect('/profile')
			} else{
				res.render('addProfile', {contact: data, err_msg: "Kontak sudah terpakai, Pilih lainnya!!"})
			}
		})
	})
})

app.get('/profile/edit/:id', function(req, res){
	db.all(`SELECT * FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT id, name FROM Contact`, function(err, data){
				res.render('editProfile', {edit_profile : rows, edit_contact:data, err_msg : false})
			})
		}
	})
})

app.post('/profile/edit/:id', function(req, res){
	let queryUpdate = `UPDATE Profile SET nickname = '${req.body.nickname}',
	account = '${req.body.account}',
	contact_id = '${req.body.contact_id}' WHERE id = '${req.params.id}'`

	db.all(`SELECT * FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		if(!err){
			db.all(`SELECT * FROM Contact`, function(err, data){
				db.run(queryUpdate, function(err2){
					if(!err2){
						res.redirect('/profile')
					}
					else{
						res.render('editProfile', {edit_profile : rows, edit_contact:data, err_msg : "Maaf, kontak tersebut sudah digunakan"})
					}
				})
			})
		}
	})
})

app.get('/profile/delete/:id', function(req, res){
	db.run(`DELETE FROM Profile WHERE id = '${req.params.id}'`, function(err, rows){
		res.redirect('/profile')
	})
})


app.listen(3000, function(){
	console.log('Iam listen on port 3000')
})
