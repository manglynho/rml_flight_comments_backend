const flightRouter = require('express').Router()
const Flight = require('../models/flight')  

flightRouter.get('/', async (_req, resp) => {
  
  const flights = await Flight.find({}).populate('comments')
  resp.json(flights)

})

module.exports = flightRouter