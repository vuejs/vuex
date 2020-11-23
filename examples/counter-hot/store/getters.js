export const count = state => state.count

export const recentHistory = state => {
  return state.history
    .slice(-5)
    .join(', ')
}
