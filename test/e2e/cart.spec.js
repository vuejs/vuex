import { setupPuppeteer, E2E_TIMEOUT } from 'test/helpers'

describe('e2e/cart', () => {
  const { page, text, count, click, sleep } = setupPuppeteer()

  test('cart app', async () => {
    await page().goto('http://localhost:8080/shopping-cart/')

    await sleep(120) // api simulation

    expect(await count('li')).toBe(3)
    expect(await count('.cart button[disabled]')).toBe(1)
    expect(await text('li:nth-child(1)')).toContain('iPad 4 Mini')
    expect(await text('.cart')).toContain('Please add some products to cart')
    expect(await text('.cart')).toContain('Total: $0.00')

    await click('li:nth-child(1) button')
    expect(await text('.cart')).toContain('iPad 4 Mini - $500.01 x 1')
    expect(await text('.cart')).toContain('Total: $500.01')

    await click('li:nth-child(1) button')
    expect(await text('.cart')).toContain('iPad 4 Mini - $500.01 x 2')
    expect(await text('.cart')).toContain('Total: $1,000.02')
    expect(await count('li:nth-child(1) button[disabled]')).toBe(1)

    await click('li:nth-child(2) button')
    expect(await text('.cart')).toContain('H&M T-Shirt White - $10.99 x 1')
    expect(await text('.cart')).toContain('Total: $1,011.01')

    await click('.cart button')
    await sleep(200)
    expect(await text('.cart')).toContain('Please add some products to cart')
    expect(await text('.cart')).toContain('Total: $0.00')
    expect(await text('.cart')).toContain('Checkout successful')
    expect(await count('.cart button[disabled]')).toBe(1)
  }, E2E_TIMEOUT)
})
