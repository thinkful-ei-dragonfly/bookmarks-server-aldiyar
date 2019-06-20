const {
  expect
} = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {
  makeBookmarksArray
} = require('./bookmarks.fixtures')

describe('bookmarks Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('cleanup', () => db('bookmarks').truncate())


  describe(`GET /bookmarks`, () => {
    context('Given there are no bookmarks in the database', () => {
      it('responds with 200 and an empty array', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, [])
      })
    })

    context(`Given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .insert(testBookmarks)
          .into('bookmarks')
      })

      it('GET /bookmarks responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, testBookmarks)

      })
    })
  })
  describe(`GET /bookmarks/:bookmark_id`, () => {
    context(`Given there are no articles in the database`, () => {
      it(`responds with 404`, () => {
        const id = 12342
        return supertest(app)
          .get(`/bookmarks/${id}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` } })
      })
    })

    context(`Given there are articles in the database`, () => {
      const testBookmarks = makeBookmarksArray()
  
      beforeEach('insert bookmarks', () => {
        return db
          .insert(testBookmarks)
          .into('bookmarks')
      })
  
      it(`responds with 200 and the article with matching id`, () => {
        const id = 2
        const expectedBookmark = testBookmarks[id - 1]
        return supertest(app)
          .get(`/articles/${id}`) /
          expect(200, expectedBookmark)
      })
    })
  })
})

