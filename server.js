const express = require('express');
const hbs = require('hbs');
const path = require('path');
const http = require('http');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('./config/config');
const {mongoose} = require('./database/mongoose');


//basic configurations
var app = express();
var port = process.env.PORT || config.PORT;
var server = http.createServer(app);
var session;

//controllers

const pageController = require('./controllers/pageController');


app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({ resave: true, saveUninitialized: true, secret: config.SECRET }));
app.use(flash());
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use('/public/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/public/css', express.static('node_modules/animate.css/'));
app.use('/public/js', express.static('node_modules/bootstrap/dist/js'));
app.use('/public/js', express.static('node_modules/jquery/dist'));
app.use('/public/js', express.static('node_modules/tether/dist/js'));

//get routes
app.get('/', pageController.getIndex);
app.get('/register', pageController.getRegister);
app.get('/login', pageController.getLogin);
app.get('/dashboard', pageController.getDashboard);

//post routes
app.post('/register', pageController.postRegister);
app.post('/login', pageController.postLogin);


//404 route
app.use(function(req, res) {
    res.status(404).end('404');
});

//listen
server.listen(port, () => { console.log(`Server is running on port ${port}`); });

module.exports = { app };
