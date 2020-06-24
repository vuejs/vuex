import { setupPuppeteer, E2E_TIMEOUT } from 'test/helpers'

describe('e2e/todomvc', () => {
  const {
    page,
    isVisible,
    isChecked,
    isFocused,
    text,
    value,
    count,
    hasClass,
    hover,
    click,
    keyUp,
    setValue,
    enterValue,
    clearValue
  } = setupPuppeteer()

  async function testTodoMVC (url) {
    await page().goto(url)

    expect(await isVisible('.main')).toBe(false)
    expect(await isVisible('.footer')).toBe(false)
    expect(await count('.filters .selected')).toBe(1)

    await enterValue('.new-todo', 'test')
    expect(await count('.todo')).toBe(1)
    expect(await isVisible('.todo .edit')).toBe(false)
    expect(await text('.todo label')).toContain('test')
    expect(await text('.todo-count strong')).toContain('1')
    expect(await isChecked('.todo .toggle')).toBe(false)
    expect(await isVisible('.main')).toBe(true)
    expect(await isVisible('.footer')).toBe(true)
    expect(await isVisible('.clear-completed')).toBe(false)
    expect(await value('.new-todo')).toBe('')

    await enterValue('.new-todo', 'test2')
    expect(await count('.todo')).toBe(2)
    expect(await text('.todo:nth-child(2) label')).toContain('test2')
    expect(await text('.todo-count strong')).toContain('2')

    // toggle
    await click('.todo .toggle')
    expect(await count('.todo.completed')).toBe(1)
    expect(await hasClass('.todo:nth-child(1)', 'completed')).toBe(true)
    expect(await text('.todo-count strong')).toContain('1')
    expect(await isVisible('.clear-completed')).toBe(true)

    await enterValue('.new-todo', 'test3')
    expect(await count('.todo')).toBe(3)
    expect(await text('.todo:nth-child(3) label')).toContain('test3')
    expect(await text('.todo-count strong')).toContain('2')

    await enterValue('.new-todo', 'test4')
    await enterValue('.new-todo', 'test5')
    expect(await count('.todo')).toBe(5)
    expect(await text('.todo-count strong')).toContain('4')

    // toggle more
    await click('.todo:nth-child(4) .toggle')
    await click('.todo:nth-child(5) .toggle')
    expect(await count('.todo.completed')).toBe(3)
    expect(await text('.todo-count strong')).toContain('2')

    // remove
    await hover('.todo:nth-child(1)')
    await click('.todo:nth-child(1) .destroy')
    expect(await count('.todo')).toBe(4)
    expect(await count('.todo.completed')).toBe(2)
    expect(await text('.todo-count strong')).toContain('2')

    await hover('.todo:nth-child(2)')
    await click('.todo:nth-child(2) .destroy')
    expect(await count('.todo')).toBe(3)
    expect(await count('.todo.completed')).toBe(2)
    expect(await text('.todo-count strong')).toContain('1')

    // remove all
    await click('.clear-completed')
    expect(await count('.todo')).toBe(1)
    expect(await text('.todo label')).toContain('test2')
    expect(await count('.todo.completed')).toBe(0)
    expect(await text('.todo-count strong')).toBe('1')
    expect(await isVisible('.clear-completed')).toBe(false)

    // prepare to test filters
    await enterValue('.new-todo', 'test')
    await enterValue('.new-todo', 'test')
    await click('.todo:nth-child(2) .toggle')
    await click('.todo:nth-child(3) .toggle')

    // active filter
    await click('.filters li:nth-child(2) a')
    expect(await count('.todo')).toBe(1)
    expect(await count('.todo.completed')).toBe(0)

    // add item with filter active
    await enterValue('.new-todo', 'test')
    expect(await count('.todo', 2)).toBe(2)

    // complted filter
    await click('.filters li:nth-child(3) a')
    expect(await count('.todo')).toBe(2)
    expect(await count('.todo.completed')).toBe(2)

    // toggling with filter active
    await click('.todo .toggle')
    expect(await count('.todo')).toBe(1)
    await click('.filters li:nth-child(2) a')
    expect(await count('.todo')).toBe(3)
    await click('.todo .toggle')
    expect(await count('.todo')).toBe(2)

    // editing triggered by blur
    await click('.filters li:nth-child(1) a')
    await click('.todo:nth-child(1) label', { clickCount: 2 })
    expect(await count('.todo.editing')).toBe(1)
    expect(await isFocused('.todo:nth-child(1) .edit')).toBe(true)
    await clearValue('.todo:nth-child(1) .edit')
    await setValue('.todo:nth-child(1) .edit', 'edited!')
    await click('footer') // blur
    expect(await count('.todo.editing')).toBe(0)
    expect(await text('.todo:nth-child(1) label')).toBe('edited!')

    // editing triggered by enter
    await click('.todo label', { clickCount: 2 })
    await clearValue('.todo:nth-child(1) .edit')
    await enterValue('.todo:nth-child(1) .edit', 'edited again!')
    expect(await count('.todo.editing')).toBe(0)
    expect(await text('.todo:nth-child(1) label')).toBe('edited again!')

    // cancel
    await click('.todo label', { clickCount: 2 })
    await clearValue('.todo:nth-child(1) .edit')
    await setValue('.todo:nth-child(1) .edit', 'edited!')
    await keyUp('Escape')
    expect(await count('.todo.editing')).toBe(0)
    expect(await text('.todo:nth-child(1) label')).toBe('edited again!')

    // empty value should remove
    await click('.todo label', { clickCount: 2 })
    await clearValue('.todo:nth-child(1) .edit')
    await enterValue('.todo:nth-child(1) .edit', ' ')
    expect(await count('.todo')).toBe(3)

    // toggle all
    await click('label[for="toggle-all"]')
    expect(await count('.todo.completed')).toBe(3)
    await click('label[for="toggle-all"]')
    expect(await count('.todo:not(.completed)')).toBe(3)
  }

  test('classic', async () => {
    await testTodoMVC('http://localhost:8080/classic/todomvc/')
  }, E2E_TIMEOUT)

  test('composition', async () => {
    await testTodoMVC('http://localhost:8080/composition/todomvc/')
  }, E2E_TIMEOUT)
})
