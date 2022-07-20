const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Comment = require('../models/comment')
const Flight = require('../models/flight')
const User = require('../models/user')

//data to flush to testdb before each test
const initialComments = require('../data/initialComments')
const initialFlights = require('../data/initialFlights')
const initialUsers = require('../data/initialUsers')

beforeEach(async () => {
  await Comment.deleteMany({})
  const commentsObjects = initialComments.map(comment => new Comment(comment))
  const promiseArray = commentsObjects.map(comment => comment.save())
  await Promise.all(promiseArray)
})

beforeEach(async () => {
  await Flight.deleteMany({})
  const flightObjects = initialFlights.map(flight => new Flight(flight))
  const promiseArray = flightObjects.map(flight => flight.save())
  await Promise.all(promiseArray)
})

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('Checking the Comment lists', () => {
  test('ok comments are returned as json', async () => {
    await api
      .get('/api/comments')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('there are 3 elements', async () => {
    const response = await api.get('/api/comments')
    expect(response.body.comments).toHaveLength(initialComments.length)
  })
  test('property id is defined', async () => {
    const response = await api.get('/api/comments')
    //pick only first object response to check schema composition
    expect(response.body.comments[0].id).toBeDefined()
  })
})

describe('viewing a specific comment entry', () => {
  test('succeeds with a valid id', async () => {
    const commentsAtStart = await helper.commentsInDb()

    const commentToView = commentsAtStart[0]

    const resultComment = await api
      .get(`/api/comments/${commentToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedCommentToView = JSON.parse(JSON.stringify(commentToView))
    expect(resultComment.body).toEqual(processedCommentToView)
  })

  test('fails with statuscode 404 if comment does not exist', async () => {
    const validNonexistingId = await helper.nonExistingCommentId()
    await api
      .get(`/api/comments/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '1a3d5da0000000a82aaaa4'
    await api
      .get(`/api/comments/${invalidId}`)
      .expect(400)
  })
})

describe('addition tests', () => {

  test('new comment can be added', async () => {
    const newDevice = {
      comment: 'My new test comment',
      date: new Date(),
      flight: '5a422a851b54a676234d1898',
      user: '5a422aa71b54a676234d17f8',
    }
    await api
      .post('/api/comments')
      .send(newDevice)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const commentsAtEnd = await helper.commentsInDb()
    expect(commentsAtEnd).toHaveLength(initialComments.length + 1)
    const textComment = commentsAtEnd.map(b => b.comment)
    expect(textComment).toContain(
      'My new test comment'
    )
  })

  test('no comments without flight', async () => {
    const newDevice = {
      comment: 'My new going to fail comment',
      date: new Date(),
      user: '5a422aa71b54a676234d17f8',
    }
    const result = await api
      .post('/api/comments')
      .send(newDevice)
      .expect(400)
      expect(result.body.error).toContain('Flight not selected')
  })

  test('no comments without user', async () => {
    const newDevice = {
      comment: 'My new going to fail comment',
      date: new Date(),
      flight: '5a422a851b54a676234d1898',
    }
    const result = await api
      .post('/api/comments')
      .send(newDevice)
      .expect(400)
      expect(result.body.error).toContain('User not selected')
  })

  test('Manage equal comments', async () => {
    const repeatedComment = {
        comment: 'This is a comment 1',
        date: new Date(),
        status: true,
        flight: '5a422aa71b54a676234d2065',
        user: '5a422a851b54a676234d17f7',
    }
    const result = await api
      .post('/api/comments')
      .send(repeatedComment)
      .expect(400)
      expect(result.body.error).toContain('Comment already exist')
  })

})

describe('deletion tests', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const commentsAtStart = await helper.commentsInDb()
    const commentToDelete = commentsAtStart[0]
    await api
      .delete(`/api/comments/${commentToDelete.id}`)
      .expect(204)

    const commentsAtEnd = await helper.commentsInDb()

    expect(commentsAtEnd).toHaveLength(
      initialComments.length - 1
    )
    const contents = commentsAtEnd.map(r => r.id)
    expect(contents).not.toContain(commentToDelete.id)
  })

})

describe('updating tests', () => {
  test('valid status update', async () => {
    const commentsAtStart = await helper.commentsInDb()
    const commentToUpdate = commentsAtStart[0]
    const updatetext = {
      comment: 'Edited comment',
    }
    const resultComment = await api
      .put(`/api/comments/${commentToUpdate.id}`)
      .send(updatetext)
      .expect(200)

    expect(resultComment.body.comment).toEqual('Edited comment')
  })

})

afterAll(() => {
  mongoose.connection.close()
})