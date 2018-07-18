"use strict";

var express = require('express');
var path = require('path');

import http from 'http'
import express from 'express'
import socketIO from 'socket.io'
import {auth, document} from './socket-api'






// var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/Models.js').User;
var Document = require('./models/Models.js').Document;


// Express setup
var app = express();
const server = http.Server(app);
const io = socketIO(server);
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// MONGODB SETUP HERE
var mongoose = require('mongoose')
mongoose.connection.on('connected', function() {
    console.log('Connected to MongoDB!')
})

mongoose.connection.on('error', function(err) {
    console.log(err)
})
mongoose.connect(process.env.MONGODB_URI)


var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

app.use(session({
    secret: 'my secret here',
    store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(error, result) {
            if (error) {
                console.log('Error in finding the user', error)
                return done(error)
            } else {
                if (!result) {
                    console.log(result);
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (password === result.password) {
                    return done(null, result)
                } else {
                    console.log('Incorrect password')
                    return done(null, false)
                }
            }
        })
    }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
    done(null, user._id)
})

passport.deserializeUser(function(id, done) {
    var user;
    User.findById(id, function(error, result) {
        if (error) {
            console.log('Error in finding the user', error)
        } else {
            user = result
        }
        done(error, user)
    })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize())
app.use(passport.session())

// YOUR ROUTES HERE
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (!user) { return res.status(400).json({error: 'No user found!'})}
    if (err) {return res.status(500).json({error: err.message})}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({userId: user._id})
    });
  })(req, res, next);
});


app.post('/register', function(req, res) {
  new User(req.body)
    .save()
    .then((doc) => res.json({id: doc.id}))
    .catch((err) => res.status(500).end(err.message))
})

app.post('/create', function(req, res) {
  new Document({
    createdTime: req.body.createdTime
    owner: req.body.userId
  })
    .save()
    .then((doc) => {console.log(doc); return res.json({id: doc._id})})
    .catch((err) => res.status(500).end(err.message))
})

app.post('/docList', function(req, res) {
  User.findById(req.body.userId, function (err, user) {
    if (err) return console.log('Error');
    var docList = user.docList.slice()
    docList.push(req.body.docId)
    user.docList = docList
    user.save(function (err, updateduser) {
      if (err) return console.log('Error');
      res.json(updateduser);
    });
  });
})









app.listen(1337)
console.log('Server Started!')
