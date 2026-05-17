import { ref, computed } from 'vue'
import { useFormulaStore } from '../stores/formula'
import { useErrorBookStore } from '../stores/errorBook'

export function useCardSession() {
  const formulaStore = useFormulaStore()
  const errorStore = useErrorBookStore()

  const isFlipped = ref(false)
  const isComplete = ref(false)
  const sessionStats = ref({ known: 0, vague: 0, unknown: 0 })

  const currentFormula = computed(() => {
    return formulaStore.allFormulas[formulaStore.currentIndex]
  })

  function flipCard() {
    isFlipped.value = !isFlipped.value
  }

  function answerFormula(status) {
    if (!currentFormula.value) return

    formulaStore.markFormula(currentFormula.value.id, status)
    sessionStats.value[status]++

    // Record errors for vague and unknown
    if (status === 'vague' || status === 'unknown') {
      errorStore.recordError(currentFormula.value.id, status)
    }

    // Try to advance
    if (!formulaStore.nextCard()) {
      isComplete.value = true
    }

    isFlipped.value = false
  }

  function goToPrev() {
    formulaStore.prevCard()
    isFlipped.value = false
  }

  function goToNext() {
    formulaStore.nextCard()
    isFlipped.value = false
  }

  function restart() {
    formulaStore.resetSession()
    isFlipped.value = false
    isComplete.value = false
    sessionStats.value = { known: 0, vague: 0, unknown: 0 }
  }

  return {
    isFlipped,
    isComplete,
    sessionStats,
    currentFormula,
    flipCard,
    answerFormula,
    goToPrev,
    goToNext,
    restart
  }
}
