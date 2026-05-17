import { ref, computed } from 'vue'

export function useTimer() {
  const startTime = ref(null)
  const endTime = ref(null)

  function start() {
    startTime.value = Date.now()
    endTime.value = null
  }

  function stop() {
    endTime.value = Date.now()
  }

  const elapsedMs = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return end - startTime.value
  })

  const formatted = computed(() => {
    const totalSeconds = Math.floor(elapsedMs.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes === 0) return `${seconds}秒`
    return `${minutes}分${seconds}秒`
  })

  return { start, stop, elapsedMs, formatted }
}
