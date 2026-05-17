import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFormulaStore } from './formula'
import { shuffle } from '../composables/shuffle'
import { generateQuestions } from '../composables/useQuizGenerator'

export const useStudySessionStore = defineStore('studySession', () => {
  const formulaStore = useFormulaStore()

  // Selection
  const selectedFormulaIds = ref([])
  const sessionMode = ref('category')

  // Round tracking
  const currentRound = ref(1)
  const currentIndex = ref(0)

  // Round 1: Memory
  const memoryFormulas = ref([])
  const memoryReadIds = ref(new Set())

  // Round 2: Quiz
  const quizQuestions = ref([])
  const quizAnswered = ref([])

  // Round 3: Reinforcement
  const reinforcementQuestions = ref([])
  const reinforcementAnswered = ref([])

  // Round 4: Error review
  const errorReviewQuestions = ref([])
  const errorReviewAnswered = ref([])

  // Cumulative
  const wrongAnswerIds = ref(new Set())
  const totalCorrect = ref(0)
  const totalAnswered = ref(0)

  // Timing
  const startTime = ref(null)
  const endTime = ref(null)

  // Computed
  const currentRoundLabel = computed(() => {
    const labels = ['', '记忆学习', '选择题测试', '随机强化', '错题强化']
    return labels[currentRound.value] || ''
  })

  const currentRoundQuestions = computed(() => {
    switch (currentRound.value) {
      case 1: return memoryFormulas.value
      case 2: return quizQuestions.value
      case 3: return reinforcementQuestions.value
      case 4: return errorReviewQuestions.value
      default: return []
    }
  })

  const currentRoundAnswered = computed(() => {
    switch (currentRound.value) {
      case 1: return memoryReadIds.value.size
      case 2: return quizAnswered.value.length
      case 3: return reinforcementAnswered.value.length
      case 4: return errorReviewAnswered.value.length
      default: return 0
    }
  })

  const roundTotal = computed(() => currentRoundQuestions.value.length)

  const accuracyPercent = computed(() => {
    if (totalAnswered.value === 0) return 100
    return Math.round((totalCorrect.value / totalAnswered.value) * 100)
  })

  const elapsedMs = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return end - startTime.value
  })

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(elapsedMs.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes === 0) return `${seconds}秒`
    return `${minutes}分${seconds}秒`
  })

  // Actions
  function initSession(formulaIds, mode) {
    selectedFormulaIds.value = formulaIds
    sessionMode.value = mode
    currentRound.value = 1
    currentIndex.value = 0
    memoryReadIds.value = new Set()
    quizAnswered.value = []
    reinforcementAnswered.value = []
    errorReviewAnswered.value = []
    wrongAnswerIds.value = new Set()
    totalCorrect.value = 0
    totalAnswered.value = 0
    startTime.value = Date.now()
    endTime.value = null

    const selected = formulaIds
      .map(id => formulaStore.allFormulas.find(f => f.id === id))
      .filter(Boolean)
    memoryFormulas.value = shuffle(selected)
  }

  function markMemoryRead(formulaId) {
    memoryReadIds.value = new Set([...memoryReadIds.value, formulaId])
  }

  function startRound2() {
    currentRound.value = 2
    currentIndex.value = 0
    const formulas = memoryFormulas.value
    quizQuestions.value = generateQuestions(formulas, formulaStore.allFormulas)
  }

  function startRound3() {
    currentRound.value = 3
    currentIndex.value = 0
    const shuffledFormulas = shuffle([...memoryFormulas.value])
    reinforcementQuestions.value = generateQuestions(shuffledFormulas, formulaStore.allFormulas)
  }

  function startRound4() {
    if (wrongAnswerIds.value.size === 0) {
      completeSession()
      return
    }
    currentRound.value = 4
    currentIndex.value = 0
    const errorFormulas = [...wrongAnswerIds.value]
      .map(id => formulaStore.allFormulas.find(f => f.id === id))
      .filter(Boolean)
    errorReviewQuestions.value = generateQuestions(errorFormulas, formulaStore.allFormulas)
  }

  function recordQuizAnswer(formulaId, isCorrect) {
    totalAnswered.value++
    if (isCorrect) {
      totalCorrect.value++
    } else {
      wrongAnswerIds.value = new Set([...wrongAnswerIds.value, formulaId])
    }

    switch (currentRound.value) {
      case 2:
        quizAnswered.value = [...quizAnswered.value, { formulaId, isCorrect }]
        break
      case 3:
        reinforcementAnswered.value = [...reinforcementAnswered.value, { formulaId, isCorrect }]
        break
      case 4:
        errorReviewAnswered.value = [...errorReviewAnswered.value, { formulaId, isCorrect }]
        // If answered correctly in R4, remove from wrong set
        if (isCorrect) {
          const newSet = new Set(wrongAnswerIds.value)
          newSet.delete(formulaId)
          wrongAnswerIds.value = newSet
        }
        break
    }
  }

  function nextQuestion() {
    currentIndex.value++
    return currentIndex.value < currentRoundQuestions.value.length
  }

  function completeSession() {
    endTime.value = Date.now()
  }

  function resetSession() {
    selectedFormulaIds.value = []
    sessionMode.value = 'category'
    currentRound.value = 1
    currentIndex.value = 0
    memoryFormulas.value = []
    memoryReadIds.value = new Set()
    quizQuestions.value = []
    quizAnswered.value = []
    reinforcementQuestions.value = []
    reinforcementAnswered.value = []
    errorReviewQuestions.value = []
    errorReviewAnswered.value = []
    wrongAnswerIds.value = new Set()
    totalCorrect.value = 0
    totalAnswered.value = 0
    startTime.value = null
    endTime.value = null
  }

  return {
    // State
    selectedFormulaIds,
    sessionMode,
    currentRound,
    currentIndex,
    memoryFormulas,
    memoryReadIds,
    quizQuestions,
    quizAnswered,
    reinforcementQuestions,
    reinforcementAnswered,
    errorReviewQuestions,
    errorReviewAnswered,
    wrongAnswerIds,
    totalCorrect,
    totalAnswered,
    startTime,
    endTime,
    // Computed
    currentRoundLabel,
    currentRoundQuestions,
    currentRoundAnswered,
    roundTotal,
    accuracyPercent,
    elapsedMs,
    formattedTime,
    // Actions
    initSession,
    markMemoryRead,
    startRound2,
    startRound3,
    startRound4,
    recordQuizAnswer,
    nextQuestion,
    completeSession,
    resetSession
  }
})
