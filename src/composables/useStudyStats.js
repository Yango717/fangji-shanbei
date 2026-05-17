import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export function useStudyStats() {
  const stats = useLocalStorage('fj-stats', {
    totalStudyTimeMs: 0,
    studyDays: []
  })

  function recordSession(durationMs) {
    const today = new Date().toISOString().slice(0, 10)
    const days = stats.value.studyDays || []
    if (!days.includes(today)) {
      stats.value = {
        ...stats.value,
        studyDays: [...days, today]
      }
    }
    stats.value = {
      ...stats.value,
      totalStudyTimeMs: (stats.value.totalStudyTimeMs || 0) + durationMs
    }
  }

  function isDayStudied(dateStr) {
    return (stats.value.studyDays || []).includes(dateStr)
  }

  const formattedTime = computed(() => {
    const ms = stats.value.totalStudyTimeMs || 0
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (hours === 0) return `${minutes}分钟`
    return `${hours}小时${minutes}分`
  })

  const weekDays = computed(() => {
    const result = []
    const dayLabels = ['日', '一', '二', '三', '四', '五', '六']
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      result.push({
        date: dateStr,
        label: dayLabels[d.getDay()],
        day: d.getDate(),
        studied: isDayStudied(dateStr),
        isToday: i === 0
      })
    }
    return result
  })

  return { stats, recordSession, formattedTime, weekDays }
}
