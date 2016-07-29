module.exports = {
  'chat': function (browser) {
    browser
      .url('http://localhost:8080/chat/')
      .waitForElementVisible('.chatapp', 1000)
      .assert.containsText('.thread-count', 'Unread threads: 2')
      .assert.count('.thread-list-item', 3)
      .assert.containsText('.thread-list-item.active', 'Functional Heads')
      .assert.containsText('.message-thread-heading', 'Functional Heads')
      .assert.count('.message-list-item', 2)
      .assert.containsText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
      .assert.containsText('.message-list-item:nth-child(1) .message-text', 'Hey Brian')
      .enterValue('.message-composer', 'hi')
      .waitFor(50) // fake api
      .assert.count('.message-list-item', 3)
      .assert.containsText('.message-list-item:nth-child(3)', 'hi')
      .click('.thread-list-item:nth-child(2)')
      .assert.containsText('.thread-list-item.active', 'Dave and Bill')
      .assert.containsText('.message-thread-heading', 'Dave and Bill')
      .assert.count('.message-list-item', 2)
      .assert.containsText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
      .assert.containsText('.message-list-item:nth-child(1) .message-text', 'Hey Dave')
      .enterValue('.message-composer', 'hi')
      .waitFor(50) // fake api
      .assert.count('.message-list-item', 3)
      .assert.containsText('.message-list-item:nth-child(3)', 'hi')
  }
}
