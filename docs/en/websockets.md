# Handling Websockets

You may want to call an action and update a store based on an event that didn't originate from a component - websockets, timers, etc. You can call the action if you have an instance of the store, and all the components will update to reflect changed data.

```js
// Import an action you want to call
import { someAction } from './vuex/actions'

// path to the primary store used by your app
import store from './vuex/store'

// This may vary on how you recieve data
websocket.on ('data', function (data) {
  // call the action with the store as the first argument
  someAction(store, data)
})
```
