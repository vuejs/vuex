// Credits: borrowed code from fcomb/redux-logger

export default {
  snapshot: true,
  onMutation (mutation, nextState, prevState) {
    if (typeof console === 'undefined') {
      return
    }
    const time = new Date()
    const formattedTime = ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`
    const message = `mutation ${mutation.type}${formattedTime}`

    // render
    try {
      console.group(message)
    } catch (e) {
      console.log(message)
    }

    console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState)
    console.log(`%c mutation`, `color: #03A9F4; font-weight: bold`, mutation)
    console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState)

    try {
      console.groupEnd()
    } catch (e) {
      console.log(`—— log end ——`)
    }
  }
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat(`0`, maxLength - num.toString().length) + num
}
