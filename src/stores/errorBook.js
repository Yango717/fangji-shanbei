import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'

export const useErrorBookStore = defineStore('errorBook', () => {
  const errors = useLocalStorage('fj-errors', {})

  function recordError(id, status) {
    const existing = errors.value[id]
    if (!existing) {
      errors.value[id] = {
        count: 1,
        lastWrongDate: new Date().toISOString(),
        history: [status]
      }
    } else {
      errors.value[id] = {
        count: existing.count + 1,
        lastWrongDate: new Date().toISOString(),
        history: [...existing.history, status]
      }
    }
  }

  function removeError(id) {
    delete errors.value[id]
  }

  function clearErrors() {
    errors.value = {}
  }

  const sortedErrors = computed(() => {
    return Object.entries(errors.value)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
  })

  const errorCount = computed(() => {
    return Object.keys(errors.value).length
  })

  function topWeakFormulas(n = 10) {
    return sortedErrors.value.slice(0, n)
  }

  return {
    errors,
    sortedErrors,
    errorCount,
    topWeakFormulas,
    recordError,
    removeError,
    clearErrors
  }
})
