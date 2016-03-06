casper.test.begin('counter', 8, function (test) {
  casper
  .start('examples/counter/index.html')
  .then(function () {
    test.assertSelectorHasText('div', 'Clicked: 0 times')
  })
  .thenClick('button:nth-child(1)', function () {
    test.assertSelectorHasText('div', 'Clicked: 1 times')
  })
  .thenClick('button:nth-child(2)', function () {
    test.assertSelectorHasText('div', 'Clicked: 0 times')
  })
  .thenClick('button:nth-child(3)', function () {
    test.assertSelectorHasText('div', 'Clicked: 0 times')
  })
  .thenClick('button:nth-child(1)', function () {
    test.assertSelectorHasText('div', 'Clicked: 1 times')
  })
  .thenClick('button:nth-child(3)', function () {
    test.assertSelectorHasText('div', 'Clicked: 2 times')
  })
  .thenClick('button:nth-child(4)', function () {
    test.assertSelectorHasText('div', 'Clicked: 2 times')
  })
  .wait(1000)
  .then(function () {
    test.assertSelectorHasText('div', 'Clicked: 3 times')
  })
  .run(function () {
    test.done()
  })
})
