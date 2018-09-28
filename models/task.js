const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema =new Schema({
  date:{
    type:String,
    default:Date.now()
  },
  priority:{
    type:String,
    default:"medium"
  }
});


mongoose.model('task',TaskSchema)