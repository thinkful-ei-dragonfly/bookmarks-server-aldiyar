/* eslint-disable strict */
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'developement',
  DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin@localhost/bookmarks'
}
