const Comment = require('../models/comment')
const Flight = require('../models/flight')
const User = require('../models/user')


const nonExistingCommentId = async () => {
  const comment = new Comment({
    comment: 'Non existing comment',
    date: new Date(),
    flight: '5a422aa71b54a676234d2065',
    user: '5a422b3a1b54a676234d17f9',
  })
  await comment.save()
  await comment.remove()

  return comment._id.toString()
}

const commentsInDb = async () => {
  const comments = await Comment.find({})
  return comments.map(comment => comment.toJSON())
}

const nonExistingFlightId = async () => {
  const flight = new Flight({
    flightNo: '123',
    airline: 'Southwest'
  })
  await flight.save()
  await flight.remove()

  return flight._id.toString()
}

const flightsInDb = async () => {
  const flights = await Flight.find({})
  return flights.map(flight => flight.toJSON())
}

const nonExistingUserId = async () => {
  const user = new User({
    passport: '123fgh',
    name: 'James',
    surname: 'Tucker'
  })
  await user.save()
  await user.remove()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  nonExistingCommentId,
  nonExistingFlightId,
  nonExistingUserId, 
  commentsInDb, 
  flightsInDb,
  usersInDb
}