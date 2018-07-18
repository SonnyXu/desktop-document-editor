"use strict";

var express = require('express');
var path = require('path');
// var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/Models.js').User;
var Document = require('./models/Models.js').Document;

// Express setup
var app = express();
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Socket IO Setup
var server = require('http').Server(app);
var io = require('socket.io')(server);

var docsOpened = {};

io.on('connection', function(socket) {
  console.log('New client joined:', socket.id);
  // Close a document
  socket.on('closeDoc', function() {
    var docId = docsOpened[socket.id];
    socket.leave(docId);
    delete docsOpened[socket.id];
    console.log('Left room:', docId)
  });
  // Open a document
  socket.on('openDoc', function(docId) {
    socket.join(docId);
    docsOpened[socket.id] = docId;
    console.log('Joined room', docId);
  })
  // Receive editor state
  socket.on('contentState', function(cs) {
    console.log('Received state:', cs);
    socket.to(docsOpened[socket.id]).emit('contentState', cs);
  })

  // socket.on('selectionState', function(ss) {
  //   socket.to(docsOpened[socket.id]).emit('selectionState', ss);
  // })

  // socket.on('newState', function(ns) {
  //   console.log('new state: ', ns);
  //   socket.to(docsOpened[socket.id]).emit('newState', ns);
  // });
})


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
    createdTime: req.body.createdTime,
    owner: req.body.userId,
    password: req.body.password,
    title: req.body.title
  })
    .save()
    .then((doc) => {console.log(doc); return res.json({id: doc._id, title: doc.title})})
    .catch((err) => res.status(500).end(err.message))
})

app.post('/docList', function(req, res) {
  User.findById(req.body.userId, function (err, user) {
    if (err) return console.log('Error', err);
    var docList = user.docList
    docList.push({
      docId: req.body.docId,
      title: req.body.title
    })
    user.docList = docList
    user.save(function (err, updateduser) {
      if (err) return console.log('Error');
      res.json(updateduser);
    });
  });
})

app.post('/save', function(req, res) {
  Document.findById(req.body.docId, function(err, doc) {
    if (err) return console.log('Error', err)
    doc.lastEditTime = req.body.lastEditTime;
    var newContent = req.body.content;
    doc.content.push(newContent);
    doc.save(function(err, updateddoc) {
      if (err) return console.log('Error')
      res.json(updateddoc)
    })
  })
})

app.post('/addDoc', function(req, res) {
  Document.findById(req.body.docId, function (err, doc) {
    if (err) return console.log('Error', err);
    var newColab = req.body.userId;
    var check = true;
    for (var i = 0; i < doc.collaboratorList.length; i++) {
      if (doc.collaboratorList[i] === newColab) {
        check = false;
      }
    }
    if (!check) return;
    doc.collaboratorList.push(newColab);
    doc.save(function (err, updateddoc) {
      if (err) return console.log('Error');

      User.findById(req.body.userId, function (err, user) {
        if (err) return console.log('Error', err);
        if (!user.docList.some(function(obj){
          return obj.docId === req.body.docId
        })){
          var docList = user.docList
          docList.push({
            docId: req.body.docId,
            title: updateddoc.title
          })
          user.docList = docList
          user.save(function (err, updateduser) {
            if (err) return console.log('Error');
            console.log('Collaborator added!')
          })
        }
      });
      res.json({idOfnewDoc: updateddoc._id, colabList: updateddoc.collaboratorList});
    });
  });
})

app.get('/docList/:userId', function(req, res) {
  console.log(req.params.userId)
    User.findById(req.params.userId, function(error, user) {
        if (error) {
            res.status(500).end(error.message)
        } else {
          console.log(user);
            res.json({docList: user.docList})
            console.log({docList: user.docList})
        }
    })
})

app.get('/docList/:userId', function(req, res) {
  console.log(req.params.userId)
    User.findById(req.params.userId, function(error, user) {
        if (error) {
            res.status(500).end(error.message)
        } else {
          console.log(user);
            res.json({docList: user.docList})
            console.log({docList: user.docList})
        }
    })
})

app.get('/openDoc/:docId', function(req, res) {
    Document.findById(req.params.docId, function(error, doc) {
        if (error) {
          res.status(500).end(error.message)
        } else {
          console.log(doc.content[0].content);
          res.json({docContent: doc.content[0].content})
        }
    })
})

server.listen(1337, function() {
  console.log('Server Started!')
});
