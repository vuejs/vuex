function test (browser, url) {
  browser
    .url(url)
    .waitForElementVisible('#app', 1000)
    .assert.containsText('div', 'Clicked: 0 times')
    .click('button:nth-child(1)')
    .assert.containsText('div', 'Clicked: 1 times')
    .click('button:nth-child(2)')
    .assert.containsText('div', 'Clicked: 0 times')
    .click('button:nth-child(3)')
    .assert.containsText('div', 'Clicked: 0 times')
    .click('button:nth-child(1)')
    .assert.containsText('div', 'Clicked: 1 times')
    .click('button:nth-child(3)')
    .assert.containsText('div', 'Clicked: 2 times')
    .click('button:nth-child(4)')
    .assert.containsText('div', 'Clicked: 2 times')
    .waitFor(1000)
    .assert.containsText('div', 'Clicked: 3 times')
    .end()
}

module.exports = {
  'counter/classic': function (browser) {
    test(browser, 'http://localhost:8080/classic/counter/')
  },
  'counter/composition': function (browser) {
    test(browser, 'http://localhost:8080/composition/counter/')
  }
}
