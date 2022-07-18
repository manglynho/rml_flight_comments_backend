const testingRouter = require('express').Router()
const Comment = require('../models/comment')
const Flight = require('../models/flight')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Comment.deleteMany({})
  await Flight.deleteMany({})
  await User.deleteMany({})
  response.status(204).end()
})

module.exports = testingRouter