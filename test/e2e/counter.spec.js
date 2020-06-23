import { setupPuppeteer, E2E_TIMEOUT } from 'test/helpers'

describe('e2e/counter', () => {
  const { page, text, click, sleep } = setupPuppeteer()

  test('counter app', async () => {
    await page().goto('http://localhost:8080/counter/')
    expect(await text('#app')).toContain('Clicked: 0 times')

    await click('button:nth-child(1)')
    expect(await text('#app')).toContain('Clicked: 1 times')

    await click('button:nth-child(2)')
    expect(await text('#app')).toContain('Clicked: 0 times')

    await click('button:nth-child(3)')
    expect(await text('#app')).toContain('Clicked: 0 times')

    await click('button:nth-child(1)')
    expect(await text('#app')).toContain('Clicked: 1 times')

    await click('button:nth-child(3)')
    expect(await text('#app')).toContain('Clicked: 2 times')

    await click('button:nth-child(4)')
    expect(await text('#app')).toContain('Clicked: 2 times')
    await sleep(1000)
    expect(await text('#app')).toContain('Clicked: 3 times')
  }, E2E_TIMEOUT)
})
