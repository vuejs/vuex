export default {
  recentHistory (state) {
    const end = state.history.length
    const begin = end - 5 < 0 ? 0 : end - 5
    return state.history
      .slice(begin, end)
      .toString()
      .replace(/,/g, ', ')
  }
}
