module.exports = {
  'shopping cart': function (browser) {
    browser
    .url('http://localhost:8080/shopping-cart/')
      .waitForElementVisible('#app', 1000)
      .waitFor(120) // api simulation
      .assert.count('li', 3)
      .assert.count('.cart button[disabled]', 1)
      .assert.containsText('li:nth-child(1)', 'iPad 4 Mini')
      .assert.containsText('.cart', 'Please add some products to cart')
      .assert.containsText('.cart', 'Total: $0.00')
      .click('li:nth-child(1) button')
      .assert.containsText('.cart', 'iPad 4 Mini - $500.01 x 1')
      .assert.containsText('.cart', 'Total: $500.01')
      .click('li:nth-child(1) button')
      .assert.containsText('.cart', 'iPad 4 Mini - $500.01 x 2')
      .assert.containsText('.cart', 'Total: $1,000.02')
      .assert.count('li:nth-child(1) button[disabled]', 1)
      .click('li:nth-child(2) button')
      .assert.containsText('.cart', 'H&M T-Shirt White - $10.99 x 1')
      .assert.containsText('.cart', 'Total: $1,011.01')
      .click('.cart button')
      .waitFor(120)
      .assert.containsText('.cart', 'Please add some products to cart')
      .assert.containsText('.cart', 'Total: $0.00')
      .assert.containsText('.cart', 'Checkout successful')
      .assert.count('.cart button[disabled]', 1)
      .end()
  }
}
