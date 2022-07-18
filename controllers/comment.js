const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Flight = require('../models/flight')
const User = require('../models/user') 

commentsRouter.get('/', async (request, response) => { 
let comments = [];
if(request.query && request.query.flightId) {
  const flight = await Flight.findById(request.query.flightId)
  if(flight){
    comments = await Comment.find({flight: flight._id}).populate('flight').populate('user')    
  }  
}else{
  comments = await Comment.find({}).populate('flight').populate('user')
}
response.json(comments)
})


commentsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.flight) {
    return response.status(400).json({ error: 'Flight not selected' })
  }
  const flight = await Flight.findById(body.flight)
  if(!flight){
    return response.status(400).json({ error: 'Flight not exist or invalid' })
  }
  

  if (!body.user) {
    return response.status(400).json({ error: 'User not selected' })
  }
  const user = await User.findById(body.user)
  
  if(!user){
    return response.status(400).json({ error: 'User not exist or invalid' })
  }
  
  const comment = new Comment({
    comment: body.comment,
    date: new Date(),
    flight: flight._id,
    user: user._id,
    tags: body.tags
  })

  const savedComment = await comment.save()
  //saving the comment to the flight
  flight.comments = flight.comments.concat(savedComment._id)
  await flight.save()
  //saving the comment to the user
  user.comments = user.comments.concat(savedComment._id)
  await user.save()
  
  response.json(savedComment)
})


module.exports = commentsRouter