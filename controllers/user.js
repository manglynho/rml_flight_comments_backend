const userRouter = require('express').Router()
const User = require('../models/user')  

userRouter.get('/', async (_req, resp) => {

  const users = await User.find({}).populate('comments')
  resp.json(users)
})

module.exports = userRouter