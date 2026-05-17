<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudySessionStore } from '../stores/studySession'
import { useErrorBookStore } from '../stores/errorBook'
import { useFormulaStore } from '../stores/formula'
import { useStreak } from '../composables/useStreak'
import { useStudyStats } from '../composables/useStudyStats'
import StudyTimeline from '../components/StudyTimeline.vue'
import ProgressBar from '../components/ProgressBar.vue'
import RoundMemory from '../components/RoundMemory.vue'
import RoundQuiz from '../components/RoundQuiz.vue'
import RoundErrorReview from '../components/RoundErrorReview.vue'

const router = useRouter()
const sessionStore = useStudySessionStore()
const errorStore = useErrorBookStore()
const formulaStore = useFormulaStore()
const { updateStreak } = useStreak()
const { recordSession } = useStudyStats()

const loading = ref(true)
const showErrorModal = ref(false)

onMounted(() => {
  if (sessionStore.selectedFormulaIds.length === 0) {
    router.replace('/study-setup')
    return
  }
  setTimeout(() => { loading.value = false }, 800)
})

function onMemoryRead(formulaId) {
  sessionStore.markMemoryRead(formulaId)
}

function onMemoryNext() {
  if (!sessionStore.nextQuestion()) {
    sessionStore.startRound2()
  }
}

function onQuizAnswer(formulaId, isCorrect) {
  sessionStore.recordQuizAnswer(formulaId, isCorrect)
}

function onQuizNext() {
  if (!sessionStore.nextQuestion()) {
    if (sessionStore.currentRound === 2) {
      sessionStore.startRound3()
    } else if (sessionStore.currentRound === 3) {
      if (sessionStore.wrongAnswerIds.size === 0) {
        finishSession()
      } else {
        sessionStore.startRound4()
      }
    }
  }
}

function onErrorReviewAnswer(formulaId, isCorrect) {
  sessionStore.recordQuizAnswer(formulaId, isCorrect)
}

function onErrorReviewNext() {
  if (!sessionStore.nextQuestion()) {
    if (sessionStore.wrongAnswerIds.size > 0) {
      showErrorModal.value = true
    } else {
      finishSession()
    }
  }
}

function finishSession() {
  sessionStore.completeSession()
  updateStreak()
  recordSession(sessionStore.elapsedMs)

  // Write progress to formula store for mastery tracking
  sessionStore.selectedFormulaIds.forEach(id => {
    const stillWrong = sessionStore.wrongAnswerIds.has(id)
    formulaStore.markFormula(id, stillWrong ? 'unknown' : 'known')
  })

  // Record errors to error book
  sessionStore.wrongAnswerIds.forEach(id => {
    errorStore.recordError(id, 'unknown')
  })
  router.push('/study-complete')
}

function continueErrorReview() {
  showErrorModal.value = false
  sessionStore.startRound4()
}

function endAndSaveErrors() {
  showErrorModal.value = false
  finishSession()
}
</script>

<template>
  <div class="study-page">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在准备学习内容...</p>
    </div>

    <!-- Main content -->
    <template v-else>
      <StudyTimeline :current-round="sessionStore.currentRound" />

      <div class="round-header">
        <h2 class="round-title">{{ sessionStore.currentRoundLabel }}</h2>
        <span class="round-progress">{{ sessionStore.currentRoundAnswered }} / {{ sessionStore.roundTotal }}</span>
      </div>

      <ProgressBar
        :current="sessionStore.currentRoundAnswered"
        :total="sessionStore.roundTotal"
      />

      <div class="round-content">
        <!-- Round 1: Memory -->
        <RoundMemory
          v-if="sessionStore.currentRound === 1"
          :formulas="sessionStore.memoryFormulas"
          :read-ids="sessionStore.memoryReadIds"
          :current-index="sessionStore.currentIndex"
          @read="onMemoryRead"
          @next="onMemoryNext"
        />

        <!-- Round 2/3: Quiz -->
        <RoundQuiz
          v-if="sessionStore.currentRound === 2 || sessionStore.currentRound === 3"
          :questions="sessionStore.currentRoundQuestions"
          :current-index="sessionStore.currentIndex"
          :round-label="sessionStore.currentRoundLabel"
          @answer="onQuizAnswer"
          @next="onQuizNext"
        />

        <!-- Round 4: Error review -->
        <RoundErrorReview
          v-if="sessionStore.currentRound === 4"
          :questions="sessionStore.currentRoundQuestions"
          :current-index="sessionStore.currentIndex"
          @answer="onErrorReviewAnswer"
          @next="onErrorReviewNext"
        />
      </div>

      <!-- Error modal -->
      <div v-if="showErrorModal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">仍有 {{ sessionStore.wrongAnswerIds.size }} 首方剂未掌握</h3>
          <p class="modal-desc">可以继续强化学习，或结束并记入错题本</p>
          <div class="modal-actions">
            <button class="btn-primary" @click="continueErrorReview">继续学习</button>
            <button class="btn-ghost" @click="endAndSaveErrors">结束并记录</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.study-page {
  max-width: 560px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-4);
  min-height: calc(100vh - 56px);
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-4);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Round header */
.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--space-4) 0 var(--space-2);
}

.round-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.round-progress {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.round-content {
  margin-top: var(--space-6);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  max-width: 380px;
  width: 90%;
  text-align: center;
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.modal-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-primary {
  width: 100%;
  padding: var(--space-4);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  min-height: 44px;
}

.btn-primary:hover { background: var(--color-primary-hover); }

.btn-ghost {
  width: 100%;
  padding: var(--space-4);
  color: var(--color-text-muted);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;
  min-height: 44px;
}

.btn-ghost:hover { color: var(--color-text); }

@media (max-width: 480px) {
  .study-page { padding: var(--space-3) var(--space-3); }
}
</style>
