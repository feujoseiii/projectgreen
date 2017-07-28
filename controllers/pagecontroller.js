const _ = require('lodash');
const {User} = require('./../models/user');

exports.getIndex = (req, res) => {
  session = req.session;
  res.render('index.hbs', {
    session: session,
  });
};

exports.getRegister = (req, res) => {
  session = req.session;
  res.render('register.hbs', {
    session
  });
};

exports.getLogin = (req, res) => {
  session = req.session;
  res.render('login.hbs', {
    session
  });
};


exports.postLogin = (req, res) => {
  session = req.session;
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) =>{
    session.user = user;
    res.redirect('/dashboard');
  }).catch((e) => {
    req.flash('errors', e);
    res.redirect('/login');
  });
};


exports.postRegister = (req, res) => {
  session = req.session;
  var body = _.pick(req.body, ['email', 'name', 'password','repassword']);
  if (body.password !== body.repassword) {
    req.flash('errors','Password does not match');
    return res.redirect('/signup');
  }
  var user = new User({
    "email": body.email,
    "password": body.password,
    "name": body.name,
    "role": "employee"
  });
  User.findOne({email: body.email}, (err, existing) => {
    if (err) return res.status(400).send(err);
    if (existing) {
      req.flash('errors', 'Account with that email already exists');
      return res.redirect('/signup');
    } else {
      user.save().then((user) => {
        req.flash('success','Thank you for signing up!');
        return res.redirect('/login');
      }).catch((e) => {
        res.status(400).send(e);
      });
    }
  });
};


exports.getDashboard = (req, res) => {
  session = req.session;
  res.render('dashboard.hbs', {
    session
  })
};
