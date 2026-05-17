import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import formulas from '../data/formulas'

export const useFormulaStore = defineStore('formula', () => {
  const allFormulas = formulas
  const progress = useLocalStorage('fj-progress', {})
  const currentIndex = ref(0)
  const sessionMode = ref('all')

  const total = allFormulas.length

  const learnedCount = computed(() => {
    return Object.keys(progress.value).length
  })

  const completionPercent = computed(() => {
    return Math.round((learnedCount.value / total) * 100)
  })

  const statsByStatus = computed(() => {
    let known = 0, vague = 0, unknown = 0
    for (const entry of Object.values(progress.value)) {
      if (entry.status === 'known') known++
      else if (entry.status === 'vague') vague++
      else unknown++
    }
    return { known, vague, unknown }
  })

  function markFormula(id, status) {
    const existing = progress.value[id]
    progress.value[id] = {
      status,
      reviewCount: existing ? existing.reviewCount + 1 : 1,
      lastReviewed: new Date().toISOString()
    }
  }

  function nextCard() {
    if (currentIndex.value < allFormulas.length - 1) {
      currentIndex.value++
      return true
    }
    return false
  }

  function prevCard() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      return true
    }
    return false
  }

  function resetSession() {
    currentIndex.value = 0
    sessionMode.value = 'all'
  }

  return {
    allFormulas,
    progress,
    currentIndex,
    sessionMode,
    total,
    learnedCount,
    completionPercent,
    statsByStatus,
    markFormula,
    nextCard,
    prevCard,
    resetSession
  }
})
