const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    minlength: [3, 'Comments must have more than 3 chars length'],
    required: [true, 'Comment required'],
  },
  date: {
    type: Date
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags:{
    type: [String],
    required: false
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

commentSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Comment', commentSchema)
