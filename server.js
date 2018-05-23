// SQLite3 initialisieren
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('webshop.db');

// Express initialisieren
const express = require('express');
const app = express()

// Public-Ordner
app.use(express.static( "public" ));

// Body-Parser initialisieren
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Server starten
const port = 3000;
app.listen(port, function() {
	console.log('listening on port' + port);
});

// Express-Session initialisieren
const session = require('express-session');
app.use(session({ 
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

// Main
app.get(['/'], function(req, res){
	req.session['start'] = parseInt(0);
	req.session['end'] = parseInt(2);
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});
app.post(['/shopNext'], function(req, res){
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['end']) <= parseInt(rows.length)){
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 2;
			} else {
				req.session['end'] = parseInt(req.session['end']) + 2;
				req.session['start'] = parseInt(req.session['start']) + 2;
			}
			console.log(req.session['start']);
			res.render('shop', {
				message: '',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['end']) <= parseInt(rows.length)){
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 2;
			} else {
				req.session['end'] = parseInt(req.session['end']) + 2;
				req.session['start'] = parseInt(req.session['start']) + 2;
			}
			res.render('shop', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});
app.post(['/shopBack'], function(req, res){
	if (req.session['authenticated']){
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['start'])-2 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 2;
			} else {
				req.session['start'] = parseInt(req.session['start']) - 2;
				req.session['end'] = parseInt(req.session['end']) - 2;
			}
			console.log(req.session['start']);
			res.render('shop', {
				message: '',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '', 
				'logedIn': true,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
				
			});
		});
	}
	else {
		db.all('SELECT * FROM products', function(err, rows){
			if (parseInt(req.session['start'])-2 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 2;
			} else {
				req.session['start'] = parseInt(req.session['start']) - 2;
				req.session['end'] = parseInt(req.session['end']) - 2;
			}
			res.render('shop', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': '',
				'errors': '', 
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
});

//Product
app.post('/product/:id', function(req, res){
	req.session['id'] = req.params['id'];;
	// Artikelinformationen übermitteln
	if (req.session['authenticated']){
		db.all(`SELECT * FROM products WHERE id =` + req.session['id'], function(err, rows){
			res.render('product', {
				message: 'Willkommen',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '',
				'logedIn': true,
				
				/// Product ///
				'rows': rows || []
			});
		});
	}
	else {
		db.all(`SELECT * FROM products WHERE id =` + req.session['id'], function(err, rows){
			res.render('product', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': '',
				'errors': '',
				'logedIn': false,
				
				/// Product ///
				'rows': rows || []
			});
		});
	}
});
// Eine extra LogIn-Methode zum Anmelden von der Produktinformationsseite aus; Damit die Produktseite auch wieder gerendert wird, und nicht die Shop-Seite
app.post('/productLogIn', function(req, res){
	const mail = req.body["mail"];
	const password = req.body["password"];
	let errors = [];
	
	if(mail == null || mail == '' || password == null || password == ''){
		if (mail == null || mail == ''){
			console.log('Mail leer');
			errors[0] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if (password == null || password == ''){
			console.log('PW leer');
			errors[1] = 'Bitte Passwort eingeben.';
		}
		db.all(`SELECT * FROM products WHERE id =` + req.session['id'], function(err, rows){
			res.render('product', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': mail,
				'errors': errors,
				'logedIn': false,
				
				/// Product ///
				'rows': rows || []
			});
		});
	}
	else {
		db.all(`SELECT * FROM customers WHERE mail = '${mail}'`, function(err, rows) {
			if (err){
				console.log(err.message);
			}
			else{
				const firstName = rows[0].firstName;
				const surName = rows[0].surName;
				const passwordCont = rows[0].password;
				if (password === passwordCont){
					req.session['authenticated'] = true;
					req.session['firstName'] = firstName;
					req.session['surName'] = surName;
					req.session['mail'] = mail;
					
					db.all(`SELECT * FROM products WHERE id =` + req.session['id'], function(err, rows){
						res.render('product', {
							message: 'Willkommen',
							'firstName': req.session['firstName'],
							'surName': req.session['surName'],
							'mail': '',
							'errors': '',
							'logedIn': true,
							
							/// Product ///
							'rows': rows || []
						});
					});
				}
				else {
					errors[1] = 'Falsches Passwort';
					
					db.all(`SELECT * FROM products WHERE id =` + req.session['id'], function(err, rows){
						res.render('product', {
							message: '',
							'firstName': '',
							'surName': '',
							'mail': mail,
							'errors': errors,
							'logedIn': false,
							
							/// Product ///
							'rows': rows || []
						});
					});
				}
			}
		});
	}
});

// Cart
app.post('/cart', (req, res) =>{
	if (req.session['authenticated']){
		db.all('SELECT * FROM cart WHERE user = ' + req.session['mail'], function(err, rows){
			let sum;
			for (var o = 0; i <= rows.length; i ++) {
				let count = parseFloat(rows[i].counter) + parseFloat(rows[i].price);
				sum = parseFloat(sum) + parseFloat(count);
			}
			res.render('shop', {
				message: 'Willkommen',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': errors,
				'logedIn': true,
				
				/// Cart ///
				'rows': rows || [],
				'sum': sum
			});
		});
	} else {
		console.log('Warenkorb nur erreichbar wenn angemeldet')
	}
});
// Methode nur zum Hinzufügen des Produkts zum Warenkorb; hat keine Ausgabe
app.post('/cartInsert/:id, name, quantity, price', function(req, res){
	// Variablen aus den req. uebernehmen
	const id = req.params['id'];
	const name = req.params['name'];
	const quantity = req.params['quantity'];
	const price = req.params['price'];
	// Artikel dem Warenkorb hinzufügen
	db.run(`INSERT INTO cart (mail, id, name, quantity, price) 
	VALUES ('${req.session['mail']}', '${id}', '${name}', '${quantity}', '${price}')`, function(err){
		console.log(name + 'wurde dem Warenkorb hinzugefügt')
	});
});
app.post('/cartDelete/:id', function(req, res){
	const id = req.params['id'];
	// Loeschen des Artikels aus dem Warenkorb
	db.run(`DELETE FROM cart WHERE mail = '${req.session['mail']} AND id =` + id, function(err){
		console.log(name + 'wurde aus dem Warenkorb entfernt')
	});
	// Ausgabe des neuen Warenkorbes
	db.all('SELECT * FROM cart WHERE user = ' + req.session['mail'], function(err, rows){
		let sum;
		for (var o = 0; i <= rows.length; i ++) {
			let count = parseFloat(rows[i].counter) + parseFloat(rows[i].price);
			sum = parseFloat(sum) + parseFloat(count);
		}
		res.render('shop', {
			message: 'Willkommen',
			'firstName': req.session['firstName'],
			'surName': req.session['surName'],
			'mail': '',
			'errors': errors,
			'logedIn': true,
			
			/// Cart ///
			'rows': rows || [],
			'sum': sum
		});
	});
});
app.post('/buy', function(req, res){
	//neue orderID herausfinden
	let orderId;
	db.run(`SELECT * FROM orders`, function(err, rowsID) {
		for (let i = 0; i <= rowsID.length; i ++){
			orderId = parseInt(rowsID[i].orderID) + 1;
		}
	});
	// Warenkorb des Benutzers auswählen
	db.run(`SELECT * FROM cart WHERE mail = ` + req.session['mail'], function(err, rowsCart) {
		// ausgewählter Warenkorb den orders hinzufügen
		for (let i = 0; i <= rowsCart.length; i ++){
			db.run(`INSERT INTO orders (orderID, mail, id, name, price, quantity) 
			VALUES ('${orderID}', '${req.session['mail']}', '${rowsCart[i].id}', '${rowsCart[i].name}', '${rowsCart[i].price}', '${rowsCart[i].quantity}')`, function(err){
				consol.log('Warenkorb wurde den Auftraegen hinzugefuegt.');
			});
		}
	});
	// löschen des Benutzerwarenkorbes
	db.run(`DELETE FROM cart WHERE mail = ` + req.session['mail'], function(err){
		consol.log('Warenkorb des Benutzers wurde geloescht.');
	});
	// Ausgabe der Bestellbestätigung
	db.all(`SELECT * FROM orders WHERE mail = '${req.session['mail']}' AND orderID =` + orderID, (err, rows) => {
		let sum;
		for (var i = 0; i <= rows.length; i ++) {
			let price = parseFloat(rows[i].quantity) + parseFloat(rows[i].price);
			sum = parseFloat(sum) + parseFloat(price);
		}
		res.render('shop', {
			message: 'Willkommen',
			'firstName': req.session['firstName'],
			'surName': req.session['surName'],
			'mail': '',
			'errors': errors,
			'logedIn': true,
			
			/// Bestellbestätigung ///
			'rows': rows || [],
			'sum': sum
		});
	});
});

// Register
app.get('/register', function(req, res){
	res.render('register', {
		'errors': [],
		'firstName': '',
		'surName': '',
		'mail': '',
		'street': '',
		'number': '',
		'postcode': '',
		'place': ''
	});
});
app.post('/onRegister', function(req, res){
	const firstName = req.body["firstName"];
	const surName = req.body["surName"];
	const mail = req.body["mail"];
	const password = req.body["password"];
	const passwordCont = req.body["passwordCont"];
	const street = req.body["street"];
	const number = req.body["number"];
	const postcode = req.body["postcode"];
	const place = req.body["place"];
	
	if(firstName == null || firstName == '' || surName == null || surName == '' || mail == null || mail == '' ||
	password == null || password == '' || passwordCont == null || passwordCont == '' || password != passwordCont || 
	street == null || street == '' || number == null || number == '' || postcode == null || postcode == '' || place == null || place == ''){
		let errors = [];
		if(firstName == null || firstName == ''){
			console.log('Vorname leer');
			errors[0] = 'Bitte Vornamen eingeben.';
		}
		if(surName == null || surName == ''){
			console.log('Nachname leer');
			errors[1] = 'Bitte Nachnamen eingeben.';
		}
		if(mail == null || mail == ''){
			console.log('Mail leer');
			errors[2] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if(password == null || password == ''){
			console.log('Passwort leer');
			errors[3] = 'Bitte ein Passwort eingeben.';
		}
		if(passwordCont == null || passwordCont == ''){
			console.log('Passwortkontrolle leer');
			errors[4] = 'Bitte Passwort wiederholen.';
		}
		else if(password != passwordCont){
			console.log('Passwort stimmt nicht ueberein');
			errors[5] = 'Passwörter stimmen nicht überein.';
		}
		if(street == null || street == ''){
			console.log('Strasse leer');
			errors[6] = 'Bitte Straße eingeben.';
		}
		if(number == null || number == ''){
			console.log('Hausnummer leer');
			errors[7] = 'Bitte Hausnummer eingeben.';
		}
		if(postcode == null || postcode == ''){
			console.log('PLZ leer');
			errors[8] = 'Bitte Postleitzahl eingeben.';
		}
		if(place == null || place == ''){
			console.log('Ort leer');
			errors[9] = 'Bitte Wohnort eingeben.';
		}
		res.render('register', {
			'errors': errors,
			'firstName': firstName,
			'surName': surName,
			'mail': mail,
			'street': street,
			'number': number,
			'postcode': postcode,
			'place': place	
		});
	} 
	else {
		const sql = `INSERT INTO customers (firstName, surName, mail, password, street, number, postcode, place) VALUES ('${firstName}', '${surName}', '${mail}', '${password}', '${street}', '${number}', '${postcode}', '${place}')`;
		console.log(sql);
		db.run(sql, function(err){
			req.session['firstName'] = firstName;
			req.session['surName'] = surName;
			req.session['mail'] = mail;
			req.session['authenticated'] = true;
			db.all('SELECT * FROM products', function(err, rows){
				res.render('shop', {
					message: 'Willkommen',
					'firstName': req.session['firstName'],
					'surName': req.session['surName'],
					'mail': '',
					'errors': '',
					'logedIn': true,
					
					/// Shop ///
					'start': req.session['start'],
					'end': req.session['end'],
					'rows': rows || []
				});
			});
		});
	}
});

app.post('/onLogIn', function(req, res){
	const mail = req.body["mail"];
	const password = req.body["password"];
	let errors = [];
	
	if(mail == null || mail == '' || password == null || password == ''){
		if (mail == null || mail == ''){
			console.log('Mail leer');
			errors[0] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if (password == null || password == ''){
			console.log('PW leer');
			errors[1] = 'Bitte Passwort eingeben.';
		}
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': mail,
				'errors': errors,
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	}
	else {
		db.all(`SELECT * FROM customers WHERE mail = '${mail}'`, function(err, rows) {
			if (err){
				console.log(err.message);
			}
			else{
				const firstName = rows[0].firstName;
				const surName = rows[0].surName;
				const passwordCont = rows[0].password;
				if (password === passwordCont){
					req.session['authenticated'] = true;
					req.session['firstName'] = firstName;
					req.session['surName'] = surName;
					req.session['mail'] = mail;
					
					db.all('SELECT * FROM products', function(err, rows){
						if (parseInt(req.session['start'])-2 <= 0){
							req.session['start'] = 0;
							req.session['end'] = 2;
						} else {
							req.session['start'] = parseInt(req.session['start']) - 2;
							req.session['end'] = parseInt(req.session['end']) - 2;
						}
						res.render('shop', {
							message: 'Willkommen',
							'firstName': req.session['firstName'],
							'surName': req.session['surName'],
							'mail': '',
							'errors': errors,
							'logedIn': true,
							
							/// Shop ///
							'start': req.session['start'],
							'end': req.session['end'],
							'rows': rows || []
						});
					});
				}
				else {
					errors[1] = 'Falsches Passwort';
					db.all('SELECT * FROM products', function(err, rows){
						res.render('shop', {
							message: '',
							'firstName': '',
							'surName': '',
							'mail': mail,
							'errors': errors,
							'logedIn': false,
							
							/// Shop ///
							'start': req.session['start'],
							'end': req.session['end'],
							'rows': rows || []
						});
					});
				}
			}
		});
	}
});

app.post('/einkaufsbestaetigung', function (req, res) {
	db.all(`SELECT * FROM orders WHERE mail = '${req.session['mail']}'`, function(err, rows){
		let sum;
		for (var i = 0; i <= rows.length; i ++) {
			let price = parseFloat(rows[i].quantity) + parseFloat(rows[i].price);
			sum = parseFloat(sum) + parseFloat(price);
		}
		res.render('shop', {
			message: 'Willkommen',
			'firstName': req.session['firstName'],
			'surName': req.session['surName'],
			'mail': '',
			'errors': errors,
			'logedIn': true,
			
			/// Bestellbestätigung ///
			'rows': rows || [],
			'sum': sum
		});
	});
});

app.post('/onLogOut', function (req, res) {
	//Sessionvariable löschen
	delete req.session['authenticated'];
	db.all('SELECT * FROM products', function(err, rows){
		db.all('SELECT * FROM products', function(err, rows){
			res.render('shop', {
				message: '',
				'firstName': '',
				'surName': '',
				'mail': '',
				'errors': '',
				'logedIn': false,
				
				/// Shop ///
				'start': req.session['start'],
				'end': req.session['end'],
				'rows': rows || []
			});
		});
	});
});