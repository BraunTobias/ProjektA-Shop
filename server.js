// SQLite3 initialisieren
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('webshop.db');

// Express initialisieren
const express = require('express');
const app = express()

// Public-Ordner für öffentliche Elemente wie Bilder angeben
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
	req.session['end'] = parseInt(10);
	if (req.session['authenticated']){
		db.all(`SELECT * FROM products`, function(err, rows){
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
		db.all(`SELECT * FROM products`, function(err, rows){
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
		db.all(`SELECT * FROM products`, function(err, rows){
			if (parseInt(req.session['end']) < parseInt(rows.length) - 2){
				req.session['end'] = parseInt(req.session['end']) + 9;
				req.session['start'] = parseInt(req.session['start']) + 9;
			} else {
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 9;
			}
			console.log("reload: shop from " +  req.session['start'] + " - " + req.session['end']);
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
			if (parseInt(req.session['end']) < parseInt(rows.length) - 2){
				req.session['end'] = parseInt(req.session['end']) + 9;
				req.session['start'] = parseInt(req.session['start']) + 9;
			} else {
				req.session['end'] = parseInt(rows.length);
				req.session['start'] = parseInt(req.session['start']) + 9;
			}
			console.log("reload: shop from " +  req.session['start'] + " - " + req.session['end']);
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
			if (parseInt(req.session['start']) - 9 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 10;
			} else if (parseInt(req.session['end']) >= parseInt(rows.length) - 1) {
				req.session['end'] = parseInt(req.session['start']) + 1;
				req.session['start'] = parseInt(req.session['end']) - 10
			} else {
				req.session['end'] = parseInt(req.session['end']) - 9;
				req.session['start'] = parseInt(req.session['start']) - 9;
			}
			console.log("reload: shop from " +  req.session['start'] + " - " + req.session['end']);
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
			if (parseInt(req.session['start']) - 9 <= 0){
				req.session['start'] = 0;
				req.session['end'] = 10;
			} else if (parseInt(req.session['end']) >= parseInt(rows.length) - 1) {
				req.session['end'] = parseInt(req.session['start']) + 1;
				req.session['start'] = parseInt(req.session['end']) - 10;
			} else {
				req.session['start'] = parseInt(req.session['start']) - 9;
				req.session['end'] = parseInt(req.session['end']) - 9;
			}
			
			console.log("reload: shop from " +  req.session['start'] + " - " + req.session['end']);
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
	req.session['prodId'] = parseInt(req.params['id']);
	console.log('Product index: ' + req.session['prodId']);
	// Artikelinformationen übermitteln
	if (req.session['authenticated']){
		db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
			res.render('product', {
				message: '',
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
		db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
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
/*app.get('/getProduct/:id', function(req, res){
	req.session['prodId'] = parseInt(req.params['id']);
	console.log('Product index: ' + req.session['prodId']);
	// Artikelinformationen übermitteln
	db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
		res.render('product', {
			message: '',
			'firstName': req.session['firstName'],
			'surName': req.session['surName'],
			'mail': '',
			'errors': '',
			'logedIn': true,
			
			/// Product ///
			'rows': rows || []
		});
	});
});*/
app.post('/productLogIn', function(req, res){
	// Eine extra LogIn-Methode zum Anmelden von der Produktinformationsseite aus; Damit die Produktseite auch wieder gerendert wird, und nicht die Shop-Seite
	const mail = req.body["mail"];
	const password = req.body["password"];
	let errors = [];
	if(mail == null || mail == '' || password == null || password == ''){
		if (mail == null || mail == ''){
			console.log('Mail empty');
			errors[0] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if (password == null || password == ''){
			console.log('PW empty');
			errors[1] = 'Bitte Passwort eingeben.';
		}
		console.log('Reload: product index: ' + req.session['prodId']);
		db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
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
		db.all(`SELECT * FROM customers WHERE mail = '${mail}'`, function(err, rowsC) {
			if (err){
				console.log(err.message);
			}
			else{
				const firstName = rowsC[0].firstName;
				const surName = rowsC[0].surName;
				const passwordCont = rowsC[0].password;
				if (password === passwordCont){
					req.session['authenticated'] = true;
					req.session['firstName'] = firstName;
					req.session['surName'] = surName;
					req.session['mail'] = mail;
					console.log('LogedIn.');
					console.log('Reload: product index: ' + req.session['prodId']);
					db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
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
					console.log('Wrong PW');
					console.log('Reload: product index: ' + req.session['prodId']);
					db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
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
app.post('/productLogOut', function(req, res){
	// Eine extra LogOut-Methode zum Abmelden von der Produktinformationsseite aus; Damit die Produktseite auch wieder gerendert wird, und nicht die Shop-Seite
	console.log('LogedOut.');
	console.log('Reload: product index: ' + req.session['prodId']);
	//Sessionvariable löschen
	delete req.session['authenticated'];
	// Artikelinformationen übermitteln
	db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
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
});

// Cart
app.get('/cart', (req, res) =>{
	if (req.session['authenticated']){
		db.all(`SELECT * FROM cart WHERE mail = '${req.session['mail']}'`, function(err, rows){
			// Endpreis berechnen
			let sum = 0;
			for (var i = 0; i < rows.length; i ++) {
				sum = Number((parseFloat(sum) + parseFloat(rows[i].price) * parseInt(rows[i].quantity)).toFixed(2));
				//Runden auf 2 Stellen nach dem Komma
			}
			res.render('cart', {
				message: '',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '',
				'logedIn': true,
				
				/// Cart ///
				'rows': rows || [],
				'sum': sum
			});
		});
	}
});
app.post('/cartInsert/:name/:price', function(req, res){
	// Methode nur zum Hinzufügen des Produkts zum Warenkorb; hat nureine Texteinblendung als Rückmeldung
	// Variablen aus dem req. uebernehmen
	const id = req.session['prodId']
	const name = req.params['name'];
	let quantity = parseInt(req.body['quantity']);
	const price = req.params['price'];
	
	db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err,rowsProd){
		// Prüfen ob genügend Artikel im Lager sind
		if (rowsProd[0].stock >= quantity) {
			db.all(`SELECT * FROM cart WHERE mail = '${req.session['mail']}' AND id = '${req.session['prodId']}'`, function(err, rowsCheck){
				// Prüfen ob der Artikel schon im Warenkorb ist
				if (rowsCheck.length == 0) {
					// Falls das ausgewählte Produkt noch nicht im Warenkorb ist, wird der Artikel dem Warenkorb hinzufügt
					db.run(`INSERT INTO cart (mail, id, name, quantity, price) VALUES ('${req.session['mail']}', '${req.session['prodId']}', '${name}', '${quantity}', '${price}')`, function(err){
						console.log(quantity + ' ' + name + '(s) inserted into cart')
						// Produktseite wieder laden mit neuer Message: wurde hinzugefügt
						db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
							res.render('product', {
								message: 'Wurde ihrem Warenkorb hinzugefügt',
								'firstName': '',
								'surName': '',
								'mail': '',
								'errors': '',
								'logedIn': true,
								
								/// Product ///
								'rows': rows || []
							});
						});
					});
				}
				else {
				// Falls das ausgewählte Produkt schon im Warenkorb ist, wird die Anzahl hochgezählt
				quantity += parseInt(rowsCheck[0].quantity);
				db.run(`UPDATE cart SET quantity = '${quantity}' WHERE mail = '${req.session['mail']}' AND id = '${req.session['prodId']}'`, function(err){
					console.log(quantity + ' ' + name + '(s) updated into cart')
					// Produktseite wieder laden mit neuer Message: wurde hinzugefügt
					db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
						res.render('product', {
							message: 'Wurde ihrem Warenkorb hinzugefügt',
							'firstName': '',
							'surName': '',
							'mail': '',
							'errors': '',
							'logedIn': true,
							
							/// Product ///
							'rows': rows || []
						});
					});
				});
			}
			});
		}
		else {
			console.log('nicht genügend auf Lager');
			let errors = [];
			errors[2] = "Nicht genügend Artikel auf Lager";
			db.all(`SELECT * FROM products WHERE id = '${req.session['prodId']}'`, function(err, rows){
				res.render('product', {
					message: '',
					'firstName': req.session['firstName'],
					'surName': req.session['surName'],
					'mail': '',
					'errors': errors,
					'logedIn': true,
					
					/// Product ///
					'rows': rows || []
				});
			});
		}
	});
});
app.post('/cartDelete/:id', function(req, res){
	const id = req.params['id'];
	// Loeschen des Artikels aus dem Warenkorb
	db.all(`DELETE FROM cart WHERE mail = '${req.session['mail']}' AND id = '${id}'`, function(err){
		console.log('product id ' + id + ' deleted from cart')
		// Ausgabe des neuen Warenkorbes
		db.all(`SELECT * FROM cart WHERE mail = '${req.session['mail']}'`, function(err, rows){
			// Endpreis berechnen
			let sum = 0;
			for (var i = 0; i < rows.length; i ++) {
				sum = parseFloat(sum) + parseFloat(rows[i].price) * parseInt(rows[i].quantity);
			}
			res.render('cart', {
				message: '',
				'firstName': req.session['firstName'],
				'surName': req.session['surName'],
				'mail': '',
				'errors': '',
				'logedIn': true,
				
				/// Cart ///
				'rows': rows || [],
				'sum': sum
			});
		});
	});
});
app.post('/buy', function(req, res){
	//neue orderID herausfinden
	req.session['orderId'] = parseInt(0);
	db.all(`SELECT * FROM orders`, function(err, rowsID) {
		if (rowsID.length != 0) {
			const lastID = parseInt(rowsID.length) -1;
			//console.log('Last Index: ' + lastID);
			//console.log('Old orderID: ' + rowsID[lastID].orderId]);
			req.session['orderId'] = parseInt(rowsID[lastID].orderId) + 1;
			console.log('New orderID: ' + req.session['orderId']);
		}
		// Warenkorb des Benutzers auswählen
		db.all(`SELECT * FROM cart WHERE mail = '${req.session['mail']}'`, function(err, rowsCart) {
			
			for (let j = 0; j < rowsCart.length; j ++){
								
				// Runterzählen des Lagerbestandes
				const prodId = rowsCart[j].id;
				const quantity = rowsCart[j].quantity;
				console.log('Product id2: ' + prodId + ' Quantity: ' + quantity);
				db.all(`SELECT * FROM products WHERE id = '${prodId}'`, function (err, rowsProd) {
					const oldStock = parseInt(rowsProd[0].stock);
					const newStock = parseInt(oldStock) - parseInt(quantity);
					console.log('Product stock (old): ' + oldStock + ' / Product stock (new): ' + newStock);
					db.run(`UPDATE products SET stock = '${newStock}' WHERE id = '${prodId}'`, function(err) {
						console.log('updated stock in products id: ' + prodId + ' from ' + oldStock + ' to ' + newStock);
					});
				});
				
				// ausgewählter Warenkorb den Bestellungen hinzufügen
				db.run(`INSERT INTO orders (orderID, mail, id, name, price, quantity) 
				VALUES ('${req.session['orderId']}', '${req.session['mail']}', '${rowsCart[j].id}', '${rowsCart[j].name}', '${rowsCart[j].price}', '${rowsCart[j].quantity}')`, function(err){
					console.log('Product id: ' + rowsCart[j].id + ' inserted into orders with orderID: ' + req.session['orderId']);
					// Löschen des Benutzerwarenkorbes
					db.run(`DELETE FROM cart WHERE mail = '${req.session['mail']}' AND id = '${prodId}'`, function(err){
						console.log('Product id: ' + prodId + ' deleted from cart');
					});
				});
			}
			// Ausgabe der Bestellbestätigung
			
			/*db.all(`SELECT * FROM orders WHERE mail = '${req.session['mail']}'`, function(err, rows){
				console.log('User: ' + req.session['mail'] + ' / Arraylength: ' + rows.length);
				res.render('confirmation', {
					message: '',
					'firstName': req.session['firstName'],
					'surName': req.session['surName'],
					'mail': '',
					'errors': '',
					'logedIn': true,
					
					/// Bestellbestätigung ///
					'rows': rows || [],
				});
			});*/
			db.all(`SELECT * FROM orders WHERE mail = '${req.session['mail']}'`, function(err, rows){
				console.log('User: ' + req.session['mail'] + ' / Arraylength: ' + rows.length);
				res.render('confirmation', {
					message: '',
					'firstName': req.session['firstName'],
					'surName': req.session['surName'],
					'mail': '',
					'errors': '',
					'logedIn': true,
					
					/// Bestellbestätigung ///
					'rows': rows || [],
				});
			});
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
			console.log('Mail empty');
			errors[0] = 'Bitte E-Mail-Adresse eingeben.';
		}
		if (password == null || password == ''){
			console.log('PW empty');
			errors[1] = 'Bitte Passwort eingeben.';
		}
		console.log('Reload: Shop ' + req.session['start'] + ' - ' + req.session['end']);
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
					console.log('LogedIn.');
					console.log('Reload: Shop ' + req.session['start'] + ' - ' + req.session['end']);
					db.all('SELECT * FROM products', function(err, rows){
						/*if (parseInt(req.session['start'])- <= 0){
							req.session['start'] = 0;
							req.session['end'] = 2;
						} else {
							req.session['start'] = parseInt(req.session['start']) - 2;
							req.session['end'] = parseInt(req.session['end']) - 2;
						}*/
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
					console.log('Wrong PW');
					console.log('Reload: Shop ' + req.session['start'] + ' - ' + req.session['end']);
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

app.get('/confirmation', function (req, res) {
	db.all(`SELECT * FROM orders WHERE mail = '${req.session['mail']}'`, function(err, rows){
		console.log('User: ' + req.session['mail'] + ' / Arraylength: ' + rows.length);
		res.render('confirmation', {
			message: '',
			'firstName': req.session['firstName'],
			'surName': req.session['surName'],
			'mail': '',
			'errors': '',
			'logedIn': true,
			
			/// Bestellbestätigung ///
			'rows': rows || [],
		});
	});
});

app.post('/onLogOut', function (req, res) {
	//Sessionvariable löschen
	delete req.session['authenticated'];
	console.log('LogedOut.');
	console.log('Reload: Shop ' + req.session['start'] + ' - ' + req.session['end']);
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