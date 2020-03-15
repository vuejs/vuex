function test (browser, url) {
  browser
    .url(url)
    .waitForElementVisible('.chatapp', 1000)
    .assert.containsText('.thread-count', 'Unread threads: 2')
    .assert.count('.thread-list-item', 3)
    .assert.containsText('.thread-list-item.active', 'Functional Heads')
    .assert.containsText('.message-thread-heading', 'Functional Heads')
    .assert.count('.message-list-item', 2)
    .assert.containsText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
    .assert.containsText('.message-list-item:nth-child(1) .message-text', 'Hey Brian')
    .setValue('.message-composer', ['hi', browser.Keys.ENTER])
    .waitFor(50) // fake api
    .assert.count('.message-list-item', 3)
    .assert.containsText('.message-list-item:nth-child(3)', 'hi')
    .click('.thread-list-item:nth-child(2)')
    .assert.containsText('.thread-list-item.active', 'Dave and Bill')
    .assert.containsText('.message-thread-heading', 'Dave and Bill')
    .assert.count('.message-list-item', 2)
    .assert.containsText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
    .assert.containsText('.message-list-item:nth-child(1) .message-text', 'Hey Dave')
    .setValue('.message-composer', ['hi', browser.Keys.ENTER])
    .waitFor(50) // fake api
    .assert.count('.message-list-item', 3)
    .assert.containsText('.message-list-item:nth-child(3)', 'hi')
}

module.exports = {
  'chat/classic': function (browser) {
    test(browser, 'http://localhost:8080/classic/chat/')
  },
  'chat/composition': function (browser) {
    test(browser, 'http://localhost:8080/composition/chat/')
  }
}
