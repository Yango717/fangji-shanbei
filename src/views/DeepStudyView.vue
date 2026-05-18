<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeepStudySessionStore } from '../stores/deepStudySession'
import { useErrorBookStore } from '../stores/errorBook'
import { useFormulaStore } from '../stores/formula'
import { useStreak } from '../composables/useStreak'
import { useStudyStats } from '../composables/useStudyStats'
import StudyTimeline from '../components/StudyTimeline.vue'
import ProgressBar from '../components/ProgressBar.vue'
import RoundDeepMemory from '../components/RoundDeepMemory.vue'
import RoundQuiz from '../components/RoundQuiz.vue'
import RoundErrorReview from '../components/RoundErrorReview.vue'

const router = useRouter()
const deepStore = useDeepStudySessionStore()
const errorStore = useErrorBookStore()
const formulaStore = useFormulaStore()
const { updateStreak } = useStreak()
const { recordSession } = useStudyStats()

const loading = ref(true)
const showErrorModal = ref(false)
const toast = ref({ show: false, text: '', type: 'info' })
let toastTimer = null

function showToast(text, type = 'info') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, text, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

onMounted(() => {
  if (deepStore.selectedFormulaIds.length === 0) {
    router.replace('/deep-study-setup')
    return
  }
  setTimeout(() => {
    loading.value = false
    showToast('已进入深度学习模式', 'info')
  }, 800)
})

function onMemoryRead(formulaId) {
  deepStore.markMemoryRead(formulaId)
}

function onMemoryNext() {
  if (!deepStore.nextQuestion()) {
    deepStore.startRound2()
  }
}

function onQuizAnswer(formulaId, isCorrect) {
  deepStore.recordQuizAnswer(formulaId, isCorrect)
}

function onQuizNext() {
  if (!deepStore.nextQuestion()) {
    if (deepStore.currentRound === 2) {
      deepStore.startRound3()
    } else if (deepStore.currentRound === 3) {
      if (deepStore.wrongAnswerIds.size === 0) {
        finishSession()
      } else {
        deepStore.startRound4()
      }
    }
  }
}

function onErrorReviewAnswer(formulaId, isCorrect) {
  deepStore.recordQuizAnswer(formulaId, isCorrect)
}

function onErrorReviewNext() {
  if (!deepStore.nextQuestion()) {
    if (deepStore.wrongAnswerIds.size > 0) {
      showErrorModal.value = true
    } else {
      finishSession()
    }
  }
}

function finishSession() {
  deepStore.completeSession()
  updateStreak()
  recordSession(deepStore.elapsedMs)

  deepStore.selectedFormulaIds.forEach(id => {
    const stillWrong = deepStore.wrongAnswerIds.has(id)
    formulaStore.markFormula(id, stillWrong ? 'unknown' : 'known')
  })

  deepStore.wrongAnswerIds.forEach(id => {
    errorStore.recordError(id, 'unknown')
  })

  deepStore.resetSession()
  router.push('/study-complete')
}

function continueErrorReview() {
  showErrorModal.value = false
  deepStore.startRound4()
}

function endAndSaveErrors() {
  showErrorModal.value = false
  finishSession()
}

function exitDeepMode() {
  deepStore.resetSession()
  showToast('已返回普通学习模式', 'success')
  setTimeout(() => {
    router.replace('/study-setup')
  }, 600)
}
</script>

<template>
  <div class="study-page">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在准备深度学习内容...</p>
    </div>

    <template v-else>
      <div class="mode-bar">
        <span class="mode-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          深度学习模式
        </span>
        <button class="exit-btn" @click="exitDeepMode">退出深度学习</button>
      </div>

      <StudyTimeline :current-round="deepStore.currentRound" />

      <div class="round-header">
        <h2 class="round-title">{{ deepStore.currentRoundLabel }}</h2>
        <span class="round-progress">{{ deepStore.currentRoundAnswered }} / {{ deepStore.roundTotal }}</span>
      </div>

      <ProgressBar
        :current="deepStore.currentRoundAnswered"
        :total="deepStore.roundTotal"
      />

      <div class="round-content">
        <RoundDeepMemory
          v-if="deepStore.currentRound === 1"
          :formulas="deepStore.memoryFormulas"
          :read-ids="deepStore.memoryReadIds"
          :current-index="deepStore.currentIndex"
          @read="onMemoryRead"
          @next="onMemoryNext"
        />

        <RoundQuiz
          v-if="deepStore.currentRound === 2 || deepStore.currentRound === 3"
          :questions="deepStore.currentRoundQuestions"
          :current-index="deepStore.currentIndex"
          :round-label="deepStore.currentRoundLabel"
          @answer="onQuizAnswer"
          @next="onQuizNext"
        />

        <RoundErrorReview
          v-if="deepStore.currentRound === 4"
          :questions="deepStore.currentRoundQuestions"
          :current-index="deepStore.currentIndex"
          @answer="onErrorReviewAnswer"
          @next="onErrorReviewNext"
        />
      </div>

      <div v-if="showErrorModal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">仍有 {{ deepStore.wrongAnswerIds.size }} 首方剂未掌握</h3>
          <p class="modal-desc">可以继续强化学习，或结束并记入错题本</p>
          <div class="modal-actions">
            <button class="btn-primary" @click="continueErrorReview">继续学习</button>
            <button class="btn-ghost" @click="endAndSaveErrors">结束并记录</button>
          </div>
        </div>
      </div>

      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="toast.type">
          {{ toast.text }}
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.study-page {
  max-width: 560px;
  margin: 0 auto;
  padding: var(--space-4);
  min-height: calc(100vh - 56px);
}

.mode-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-accent-light);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}

.mode-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-accent-dark);
}

.exit-btn {
  padding: var(--space-2) var(--space-4);
  border: 1.5px solid var(--color-accent);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-accent-dark);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 36px;
  white-space: nowrap;
}

.exit-btn:hover {
  background: var(--color-accent);
  color: #fff;
}

.exit-btn:active {
  transform: scale(0.97);
}

.toast {
  position: fixed;
  top: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  z-index: 300;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
}

.toast.info {
  background: var(--color-accent);
  color: #fff;
}

.toast.success {
  background: var(--color-success);
  color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}

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
  .study-page { padding: var(--space-3); }

  .mode-bar {
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
  }

  .exit-btn {
    width: 100%;
    min-height: 44px;
    font-size: var(--text-sm);
  }

  .toast {
    font-size: var(--text-xs);
    padding: var(--space-2) var(--space-4);
  }
}
</style>
