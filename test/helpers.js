import { createApp } from 'vue'
import puppeteer from 'puppeteer'

export function mount (store, component) {
  const el = createElement()

  component.render = component.render ? component.render : () => {}

  const app = createApp(component)

  app.use(store)

  return app.mount(el)
}

function createElement () {
  const el = document.createElement('div')

  document.body.appendChild(el)

  return el
}

export const E2E_TIMEOUT = 30 * 1000

const puppeteerOptions = process.env.CI
  ? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  : {}

export function setupPuppeteer () {
  let browser
  let page

  beforeEach(async () => {
    browser = await puppeteer.launch(puppeteerOptions)
    page = await browser.newPage()

    page.on('console', (e) => {
      if (e.type() === 'error') {
        const err = e.args()[0]
        console.error(
          `Error from Puppeteer-loaded page:\n`,
          err._remoteObject.description
        )
      }
    })
  })

  afterEach(async () => {
    await browser.close()
  })

  async function click (selector, options) {
    await page.click(selector, options)
  }

  async function hover (selector) {
    await page.hover(selector)
  }

  async function keyUp (key) {
    await page.keyboard.up(key)
  }

  async function count (selector) {
    return (await page.$$(selector)).length
  }

  async function text (selector) {
    return await page.$eval(selector, (node) => node.textContent)
  }

  async function value (selector) {
    return await page.$eval(selector, (node) => node.value)
  }

  async function html (selector) {
    return await page.$eval(selector, (node) => node.innerHTML)
  }

  async function classList (selector) {
    return await page.$eval(selector, (node) => {
      const list = []
      for (const index in node.classList) {
        list.push(node.classList[index])
      }
      return list
    })
  }

  async function hasClass (selector, name) {
    return (await classList(selector)).find(c => c === name) !== undefined
  }

  async function isVisible (selector) {
    const display = await page.$eval(selector, (node) => {
      return window.getComputedStyle(node).display
    })
    return display !== 'none'
  }

  async function isChecked (selector) {
    return await page.$eval(selector, (node) => node.checked)
  }

  async function isFocused (selector) {
    return await page.$eval(selector, (node) => node === document.activeElement)
  }

  async function setValue (selector, value) {
    const el = (await page.$(selector))
    await el.evaluate((node) => { node.value = '' })
    await el.type(value)
  }

  async function enterValue (selector, value) {
    const el = (await page.$(selector))
    await el.evaluate((node) => { node.value = '' })
    await el.type(value)
    await el.press('Enter')
  }

  async function clearValue (selector) {
    return await page.$eval(selector, (node) => { node.value = '' })
  }

  async function sleep (ms = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  return {
    page: () => page,
    click,
    hover,
    keyUp,
    count,
    text,
    value,
    html,
    classList,
    hasClass,
    isVisible,
    isChecked,
    isFocused,
    setValue,
    enterValue,
    clearValue,
    sleep
  }
}
