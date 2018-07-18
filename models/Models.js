var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectID;
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);


var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  docList: {
    type: Array,
    default: []
  }
});

var documentSchema = new mongoose.Schema({
  content: {
    type: Array,
    default: []
  },
  owner: {
    type: String
  },
  collaboratorList: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    default: "Untitled"
  },
  password: {
    type: String
  },
  createdTime: {
    type: Date
  },
  lastEditTime: {
    type: Date
  }
})
var User = mongoose.model('User', userSchema);
var Document = mongoose.model('Document', documentSchema);

module.exports = {
  User: User,
  Document: Document
}
