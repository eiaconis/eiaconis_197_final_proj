var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cis197finalproject', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var db = mongoose.connection;
const Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  name: String,
  password: {type: String, required: true},
  groups: [Schema.ObjectId], // id of a group schema, which stores all users in a group
  canvases: [Schema.ObjectId] // store all of a user's individual painting canvases
});

var groupSchema = new mongoose.Schema({
  name: String,
  users: [Schema.ObjectId], // id of all members in group
  canvases: [Schema.ObjectId], // id of all canvases created by group
});

var canvasSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: Schema.ObjectId, // user Id or group Id
  type: Boolean, // True = user, False = group
    content: {type: [String], // canvas pixels will be flattened and stored as integer values
    required: true}
});

var User = mongoose.model('User', userSchema);
var Group = mongoose.model('Group', groupSchema);
var Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = {
  User: User,
  Group: Group,
  Canvas: Canvas,
  mongoose: mongoose,
  //db: db.collection('Reviews') // WHAT is this for??
};
