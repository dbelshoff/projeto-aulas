const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  sexo:  { type: String, required: true },
  nacionalidade:  { type: String, required: true },
  imagePath: { type: String, required: false}  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
