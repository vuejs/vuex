import { setupPuppeteer, E2E_TIMEOUT } from 'test/helpers'

describe('e2e/chat', () => {
  const { page, text, count, click, enterValue, sleep } = setupPuppeteer()

  test('chat app', async () => {
    await page().goto('http://localhost:8080/chat/')

    expect(await text('.thread-count')).toContain('Unread threads: 2')
    expect(await count('.thread-list-item')).toBe(3)
    expect(await text('.thread-list-item.active')).toContain('Functional Heads')
    expect(await text('.message-thread-heading')).toContain('Functional Heads')
    expect(await count('.message-list-item')).toBe(2)
    expect(await text('.message-list-item:nth-child(1) .message-author-name')).toContain('Bill')
    expect(await text('.message-list-item:nth-child(1) .message-text')).toContain('Hey Brian')

    await enterValue('.message-composer', 'hi')
    await sleep(50) // fake api
    expect(await count('.message-list-item')).toBe(3)
    expect(await text('.message-list-item:nth-child(3)')).toContain('hi')

    await click('.thread-list-item:nth-child(2)')
    expect(await text('.thread-list-item.active')).toContain('Dave and Bill')
    expect(await text('.message-thread-heading')).toContain('Dave and Bill')
    expect(await count('.message-list-item')).toBe(2)
    expect(await text('.message-list-item:nth-child(1) .message-author-name')).toContain('Bill')
    expect(await text('.message-list-item:nth-child(1) .message-text')).toContain('Hey Dave')

    await enterValue('.message-composer', 'hi')
    await sleep(50) // fake api
    expect(await count('.message-list-item')).toBe(3)
    expect(await text('.message-list-item:nth-child(3)')).toContain('hi')
  }, E2E_TIMEOUT)
})
