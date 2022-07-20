const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Flight = require('../models/flight')
const User = require('../models/user') 

commentsRouter.get('/', async (req, res) => { 
let comments = []
const currentPage = req.query.currentPage || 1
const pageSize = req.query.pageSize || 10
const skip = pageSize * (currentPage - 1 )
const limit = pageSize
const sort  = {}
let flight = null

//filter prep data
const queryObj = { ...req.query }
const excludedFields = ['currentPage', 'pageSize', 'flightId', 'OrderBy', 'sortBy']
excludedFields.forEach(el => delete queryObj[el])
let queryString = JSON.stringify(queryObj)
//we can use [gte or the other] to apply a lesser or greater criteria
queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)   

//sorting
if(req.query.sortBy && req.query.OrderBy){
  sort[req.query.sortBy] = req.query.OrderBy === 'desc' ? -1 : 1
}

//filter by flight id otherwise return all comments
if(req.query && req.query.flightId) {
  flight = await Flight.findById(req.query.flightId)
  if(flight){
    comments = await Comment.find({flight: flight._id}, JSON.parse(queryString)).limit(limit).skip(skip).sort(sort).populate('flight').populate('user')    
  }  
}else{
  comments = await Comment.find(JSON.parse(queryString)).limit(limit).skip(skip).sort(sort).populate('flight').populate('user')
}

//due to pagination we need to get total count of comments and current cursor position
const totalCount = await Comment.countDocuments();
const currentCursor = skip + 1;
const totalPages = Math.ceil(totalCount / pageSize);

const responseObject = {
  comments: comments,
  currentPage: currentPage,
  totalPages: totalPages,
  currentCursor: currentCursor,
  totalCount: totalCount,
  flight: flight
}
res.json(responseObject)
})

commentsRouter.get('/:id', async (request, response) => {
  const comment = await Comment.findById(request.params.id)
  if (comment) {
    response.json(comment)
  } else {
    response.status(404).end()
  }
})

commentsRouter.post('/', async (req, res) => {
  const body = req.body
  //dealing with flight dependency
  if (!body.flight) {
    return res.status(400).json({ error: 'Flight not selected' })
  }
  const flight = await Flight.findById(body.flight)
  if(!flight){
    return res.status(400).json({ error: 'Flight not exist or invalid' })
  }
  //dealing with user dependency
  if (!body.user) {
    return res.status(400).json({ error: 'User not selected' })
  }
  const user = await User.findById(body.user)
    if(!user){
    return res.status(400).json({ error: 'User not exist or invalid' })
  }

  //lets find a deep equal comment on database before we proceed
  const suposedToBeEqualComment = await Comment.findOne({
    flight: body.flight,
    user: body.user,
    comment: body.comment
  })

  if(suposedToBeEqualComment){
    return res.status(400).json({ error: 'Comment already exist' })
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
  res.json(savedComment)
})

commentsRouter.delete('/:id', async (request, response) => {
  await Comment.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

commentsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const comment = {
    comment: body.comment,
    date: new Date(),
    tags: body.tags
  }

  const updatedComment = await Comment.findByIdAndUpdate(request.params.id, comment, { new: true }).populate('flight').populate('user')
  response.json(updatedComment)
})

module.exports = commentsRouter