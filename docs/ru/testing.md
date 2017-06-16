# Тестирование

В основном предметом модульного тестирования во Vuex являются мутации и действия.

### Тестирование мутаций

Мутации тестировать довольно просто, так как они представляют из себя всего лишь чистые функции, поведение которых полностью зависит от переданных параметров. Может пригодится возможность ES2015-модулей для самостоятельного именованного экспорта мутаций, наряду с экспортом самого хранилища из файла `store.js`:

``` js
const state = { ... }

// именованный экспорт мутаций отдельно от самого хранилища
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Пример тестирования мутаций с использованием Mocha + Chai (хотя вы не ограничены этими библиотеками и можете использовать любые другие):

``` js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// деструктурирующее присваивание из mutations
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // фиксируем состояние
    const state = { count: 0 }
    // применяем мутацию
    increment(state)
    // оцениваем результат
    expect(state.count).to.equal(1)
  })
})
```

### Тестирование действий

Действия тестировать несколько сложнее, поскольку они могут обращаться ко внешним API. При тестировании действий обычно приходится заниматься подделкой внешних объектов - например, вызовы к API можно вынести в отдельный сервис, и в рамках тестов этот сервис подменить поддельным. Для упрощения имитации зависимостей можно использовать webpack и [inject-loader](https://github.com/plasticine/inject-loader) для сборки файлов тестов.

Пример тестирования асинхронного действия:

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// для inline-загрузчиков используйте синтаксис require
// и inject-loader, возвращающий фабрику модулей, помогающую
// подменять зависимости
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// создаём поддельную зависимость
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* поддельный ответ от сервера */ ])
      }, 100)
    }
  }
})

// вспомогательная фукнция для тестирования действия, которое должно вызывать известные мутации
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // поддельная функция вызова мутаций
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // вызываем действие с поддельным хранилищем и аргументами
  action({ commit, state }, payload)

  // проверяем, были ли инициированы мутации
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* поддельный ответ */ } }
    ], done)
  })
})
```

### Тестирование геттеров

Геттеры, занимающиеся сложными вычислениями, тоже неплохо бы тестировать. Как и с мутациями, тут всё просто:

Пример тестирования геттера:

``` js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

``` js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // поддельное состояние
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // поддельный параметр геттера
    const filterCategory = 'fruit'

    // получаем результат выполнения тестируемого геттера
    const result = getters.filteredProducts(state, { filterCategory })

    // оцениваем результат
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Запуск тестов

Если вы должным образом соблюдаете правила написания мутаций и действий, результирующие тесты не должны зависеть от API браузера. Поэтому их можно просто собрать webpack'ом и запустить в Node. С другой стороны, можно использовать `mocha-loader` или Karma + `karma-webpack`, и запускать тесты в реальных браузерах.

#### Запуск в Node

Используйте следующий конфиг webpack (в сочетании с соответствующим [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)):

``` js
// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

Затем, в терминале:

``` bash
webpack
mocha test-bundle.js
```

#### Запуск в браузерах

1. Установите `mocha-loader`
2. Измените `entry` в приведённой выше конфигурации webpack на `'mocha!babel!./test.js'`.
3. Запустите `webpack-dev-server`, используя эту конфигурацию
4. Откройте в браузере `localhost:8080/webpack-dev-server/test-bundle`.

#### Запуск в браузерах при помощи Karma и karma-webpack

Обратитесь к [документации vue-loader](http://vue-loader.vuejs.org/en/workflow/testing.html).
