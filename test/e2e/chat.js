casper.test.begin('chat', 16, function (test) {
  casper
  .start('examples/chat/index.html')
  .then(function () {
    test.assertSelectorHasText('.thread-count', 'Unread threads: 2')
    test.assertElementCount('.thread-list-item', 3)
    test.assertSelectorHasText('.thread-list-item.active', 'Functional Heads')
    test.assertSelectorHasText('.message-thread-heading', 'Functional Heads')
    test.assertElementCount('.message-list-item', 2)
    test.assertSelectorHasText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
    test.assertSelectorHasText('.message-list-item:nth-child(1) .message-text', 'Hey Brian')
  })
  .then(function () {
    this.sendKeys('.message-composer', 'hi')
    enter()
  })
  .wait(50) // the demo simulates API latency
  .then(function () {
    test.assertElementCount('.message-list-item', 3)
    test.assertSelectorHasText('.message-list-item:nth-child(3)', 'hi')
  })
  .thenClick('.thread-list-item:nth-child(2)', function () {
    test.assertSelectorHasText('.thread-list-item.active', 'Dave and Bill')
    test.assertSelectorHasText('.message-thread-heading', 'Dave and Bill')
    test.assertElementCount('.message-list-item', 2)
    test.assertSelectorHasText('.message-list-item:nth-child(1) .message-author-name', 'Bill')
    test.assertSelectorHasText('.message-list-item:nth-child(1) .message-text', 'Hey Dave')
  })
  .then(function () {
    this.sendKeys('.message-composer', 'hi')
    enter()
  })
  .wait(50) // the demo simulates API latency
  .then(function () {
    test.assertElementCount('.message-list-item', 3)
    test.assertSelectorHasText('.message-list-item:nth-child(3)', 'hi')
  })
  .run(function () {
    test.done()
  })
})

function enter () {
  casper.evaluate(function () {
    // casper.mouseEvent can't set keyCode
    var field = document.querySelector('.message-composer')
    var e = document.createEvent('HTMLEvents')
    e.initEvent('keyup', true, true)
    e.keyCode = 13
    field.dispatchEvent(e)
  })
}
