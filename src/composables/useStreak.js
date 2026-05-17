import { useLocalStorage } from './useLocalStorage'

export function useStreak() {
  const streak = useLocalStorage('fj-streak', { currentStreak: 0, lastStudyDate: null })

  function updateStreak() {
    const today = new Date().toISOString().slice(0, 10)
    const { currentStreak, lastStudyDate } = streak.value

    if (lastStudyDate === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)

    if (lastStudyDate === yesterdayStr) {
      streak.value = { currentStreak: currentStreak + 1, lastStudyDate: today }
    } else {
      streak.value = { currentStreak: 1, lastStudyDate: today }
    }
  }

  return { streak, updateStreak }
}
