function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'first bkmrk',
      url: 'goog.com',
      rating: '1',
      description: 'desc1'
    },
    {
      id: 2,
      title: 'bkmrk2',
      url: '2.com',
      rating: '3',
      description: 'desc2',
    },
    {
      id: 3,
      title: '3rd bkmrk',
      url: '3.com',
      rating: '3',
      description: 'desct3'
    },
    {
      id: 4,
      title: '4th bkmrk',
      url: '4.com',
      rating: '4',
      description: 'desct4'
    },
  ]
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    rating: '3',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }

  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }

  return {
    maliciousBookmark,
    expectedBookmark,
  }
}

module.exports = { makeBookmarksArray, makeMaliciousBookmark }