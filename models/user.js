const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  password: {
    type:String,
    required:true
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'task'
  }]
});

UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      user.password = hash;
      next()
    })
  })
})

UserSchema.methods.comparePassword = function comparePassword(candidatepassword, cb) {
  bcrypt.compare(candidatepassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}

mongoose.model('user', UserSchema)