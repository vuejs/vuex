casper.test.begin('shopping-cart', 16, function (test) {
  casper
  .start('examples/shopping-cart/index.html')
  .wait(120) // api simulation
  .then(function () {
    test.assertElementCount('li', 3)
    test.assertElementCount('.cart button[disabled]', 1)
    test.assertSelectorHasText('li:nth-child(1)', 'iPad 4 Mini')
    test.assertSelectorHasText('.cart', 'Please add some products to cart')
    test.assertSelectorHasText('.cart', 'Total: $0.00')
  })
  .thenClick('li:nth-child(1) button', function () {
    test.assertSelectorHasText('.cart', 'iPad 4 Mini - $500.01 x 1')
    test.assertSelectorHasText('.cart', 'Total: $500.01')
  })
  .thenClick('li:nth-child(1) button', function () {
    test.assertSelectorHasText('.cart', 'iPad 4 Mini - $500.01 x 2')
    test.assertSelectorHasText('.cart', 'Total: $1,000.02')
    test.assertElementCount('li:nth-child(1) button[disabled]', 1)
  })
  .thenClick('li:nth-child(2) button', function () {
    test.assertSelectorHasText('.cart', 'H&M T-Shirt White - $10.99 x 1')
    test.assertSelectorHasText('.cart', 'Total: $1,011.01')
  })
  .thenClick('.cart button')
  .wait(120)
  .then(function () {
    test.assertSelectorHasText('.cart', 'Please add some products to cart')
    test.assertSelectorHasText('.cart', 'Total: $0.00')
    test.assertSelectorHasText('.cart', 'Checkout successful')
    test.assertElementCount('.cart button[disabled]', 1)
  })
  .run(function () {
    test.done()
  })
})
