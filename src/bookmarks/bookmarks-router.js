/* eslint-disable strict */
const express = require('express');
const logger = require('../logger');
const BookmarksService = require('./bookmarks-service');
const xss = require('xss');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const destructurize = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: xss(bookmark.url),
  rating: bookmark.rating,
  description: xss(bookmark.description),
})

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res) => {
    const { url, title, content } = req.body;    
    const bookmark = {
      url,
      title,
      content
    };

    for (const [key, value] of Object.entries(bookmark))
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }

    BookmarksService.insertBookmark(
      req.app.get('db'),
      bookmark
    )
      .then(bookmark => {
        logger.info(`Card with id ${bookmark.id} created`)
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(destructurize(bookmark))
      })
      .catch(next)
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .all((req, res, next) => {
    ArticleService.getById(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id of  ${id} not found.`);
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
        })
        }
        res.bookmark = bookmark
        next()
      })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(destructurize(res.bookmark))
  })
  .delete((req, res) => {
    BookmarksService.deleteBookmark(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(() => {
        logger.info(`Bookmark with id ${id} deleted.`);
        res
          .status(204)
          .end();  
      })
    .catch(next)
  });

module.exports = bookmarksRouter;

