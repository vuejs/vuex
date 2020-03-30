import { createApp } from 'vue'

export function mount (store, component) {
  const el = createElement()

  component.render = () => {}

  const app = createApp(component)

  app.use(store)

  return app.mount(el)
}

function createElement () {
  const el = document.createElement('div')

  document.body.appendChild(el)

  return el
}
