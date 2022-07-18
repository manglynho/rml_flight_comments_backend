const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const flightSchema = new mongoose.Schema({
  flightNo: { type: Number, minlength: 3, required: true, unique: true },
  airline: {
    type: String,
    enum: [ 'American', 'Southwest', 'United', 'European' ]
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
})

flightSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

flightSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Flight', flightSchema)