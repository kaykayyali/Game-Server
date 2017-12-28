const Express = require('express');
const path = require('path');
const Mongoose = require('mongoose');
const User = require('./lib/models/user');
const Passport = require('passport');
const Body_Parser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;

class Server {
	constructor() {
		console.log("Starting");
		this.mongo_url = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@ds131697.mlab.com:31697/game_leaderboards";
		this.mongo_db_name = "Primary";
	}
	async	init() {
		this.app = Express();
		this.register_middleware();
		this.register_routes();
		this.register_passport();
		await this.connect_to_db();
		this.listen();
		this.report();
	}
	async connect_to_db() {
		console.log("Connecting to Mongo DB");
		this.db = await	Mongoose.connect(this.mongo_url);
	}
	listen() {
		let port = process.env.PORT || 3000;
		this.app.listen(port, () => console.log("Listening on:", port));
	}
	register_middleware() {
		console.log("Registering Middleware");
		this.app.use(Express.static('public'));
		this.app.set('view engine', 'ejs');
		this.app.use(require('cookie-parser')());
		this.app.use(Body_Parser.urlencoded({ extended: true }));
		this.app.use(Body_Parser.json())
		this.app.use(require('express-session')({
			secret: process.env.SESSION_PASS || 'this is impossible to crack',
			resave: true,
			saveUninitialized: true
		}));
		this.app.use(Passport.initialize());
		this.app.use(Passport.session());
	}
	register_passport() {
		Passport.use(new LocalStrategy(User.authenticate()));
		Passport.serializeUser(User.serializeUser());
		Passport.deserializeUser(User.deserializeUser());
	}
	register_routes() {
		console.log("Registering Routes");
		this.app.get('/', (req, res) => {
			console.log(req.user)
			res.render("index");
		});
		this.app.get('/profile', (req, res) => {
			res.render("profile");
		});
		this.app.get('/login', (req, res) => {
			res.render('login');
		});
		this.app.post('/login', 
			Passport.authenticate('local'),
			(req, res) => {
				res.redirect('/');
		});
		this.app.post('/register', 
			(req, res) => {
				console.log(req.body);
				let user_name = req.body.user_name;
				let password = req.body.password;
				User.register(new User({username: user_name}), password, (err) => {
					if (err) {
						console.log("Error:", err);
					}
					else {
						console.log("User ", user_name, " was created.");
					}
					res.redirect('/');
				});
		});
		this.app.get('/logout',
			(req, res) =>{
				req.logout();
				res.redirect('/');
		});

	}
	report() {

	}

}

module.exports = Server;