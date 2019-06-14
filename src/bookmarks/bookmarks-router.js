/* eslint-disable strict */
const express = require('express');
const bookmarks = require('../store');
const uuid = require('uuid/v4');
const logger = require('../logger');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post((req, res) => {
    const { title, content } = req.body;
    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!content) {
      logger.error(`Content is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    
    const id = uuid();

    const bookmark = {
      id,
      title,
      content
    };

    bookmarks.push(bookmark);

    logger.info(`Card with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const {id}= req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);
  
    if(!bookmark) {
      logger.error(`Bookmark with id of ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })
  .delete((req, res) => {
    const {id} = req.params;

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
    
    if(bookmarkIndex === -1) {
      logger.error(`Bookmark with id of  ${id} not found.`);
      return res
        .status(404)
        .send('Not found')
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();  
  });

module.exports = bookmarksRouter;

