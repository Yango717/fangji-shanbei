<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useFormulaStore } from '../stores/formula'
import { useCardSession } from '../composables/useCardSession'
import ProgressBar from '../components/ProgressBar.vue'
import FlashCard from '../components/FlashCard.vue'

const formulaStore = useFormulaStore()
const {
  isFlipped, isComplete, sessionStats, currentFormula,
  flipCard, answerFormula, goToPrev, goToNext, restart
} = useCardSession()

function onKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  switch (e.code) {
    case 'Space': e.preventDefault(); flipCard(); break
    case 'Digit1': case 'Numpad1': if (isFlipped.value) answerFormula('unknown'); break
    case 'Digit2': case 'Numpad2': if (isFlipped.value) answerFormula('vague'); break
    case 'Digit3': case 'Numpad3': if (isFlipped.value) answerFormula('known'); break
    case 'ArrowLeft': e.preventDefault(); goToPrev(); break
    case 'ArrowRight': e.preventDefault(); goToNext(); break
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="learn-page">
    <!-- Dashboard top bar -->
    <div class="dashboard">
      <div class="stat-card">
        <span class="stat-label">今日已学</span>
        <span class="stat-value">{{ formulaStore.learnedCount }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">连续学习</span>
        <span class="stat-value">1天</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">掌握率</span>
        <span class="stat-value">{{ formulaStore.completionPercent }}%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">当前进度</span>
        <span class="stat-value">{{ formulaStore.currentIndex + 1 }}/{{ formulaStore.total }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-wrap">
      <ProgressBar :current="formulaStore.learnedCount" :total="formulaStore.total" />
    </div>

    <!-- Card area -->
    <div class="card-area">
      <button class="nav-btn" :disabled="formulaStore.currentIndex === 0" @click="goToPrev">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <FlashCard v-if="currentFormula" :formula="currentFormula" :flipped="isFlipped" @flip="flipCard" />

      <button class="nav-btn" :disabled="formulaStore.currentIndex >= formulaStore.total - 1" @click="goToNext">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Answer buttons -->
    <div class="answer-row" :class="{ hidden: !isFlipped || isComplete }">
      <button class="ans-btn ans-unknown" @click="answerFormula('unknown')">不会</button>
      <button class="ans-btn ans-vague" @click="answerFormula('vague')">模糊</button>
      <button class="ans-btn ans-known" @click="answerFormula('known')">会了</button>
    </div>

    <!-- Keyboard shortcuts -->
    <div v-if="!isComplete" class="shortcuts">
      空格翻转 · 1 不会 · 2 模糊 · 3 会了
    </div>

    <!-- Complete overlay -->
    <div v-if="isComplete" class="overlay">
      <div class="overlay-card">
        <h2 class="overlay-title">学习完成</h2>
        <div class="overlay-stats">
          <div class="stat">
            <span class="stat-num known">{{ sessionStats.known }}</span>
            <span class="stat-label">会了</span>
          </div>
          <div class="stat">
            <span class="stat-num vague">{{ sessionStats.vague }}</span>
            <span class="stat-label">模糊</span>
          </div>
          <div class="stat">
            <span class="stat-num unknown">{{ sessionStats.unknown }}</span>
            <span class="stat-label">不会</span>
          </div>
        </div>
        <div class="overlay-actions">
          <button class="btn-primary" @click="restart">再来一轮</button>
          <router-link to="/errors" class="btn-outline">查看错题</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.learn-page {
  max-width: 560px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 56px);
}

/* --- Dashboard top bar --- */
.dashboard {
  display: flex;
  gap: var(--space-3);
  max-width: 640px;
  width: 100%;
  margin-bottom: var(--space-4);
}

.stat-card {
  flex: 1;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-primary);
}

/* --- Progress bar --- */
.progress-wrap {
  width: 100%;
  max-width: 480px;
  margin-bottom: var(--space-6);
}

/* --- Card area --- */
.card-area {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-btn:hover:not(:disabled) {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* --- Answer buttons --- */
.answer-row {
  display: flex;
  gap: var(--space-3);
  width: 380px;
  margin-bottom: var(--space-5);
  transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
}

.answer-row.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  pointer-events: none;
}

.ans-btn {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ans-btn:active {
  transform: scale(0.97);
}

/* "不会" — outline style */
.ans-unknown {
  background: transparent;
  border: 1.5px solid var(--color-danger);
  color: var(--color-danger);
}

.ans-unknown:hover {
  background: var(--color-danger-light);
}

/* "模糊" — solid style */
.ans-vague {
  background: var(--color-warning);
  border: 1.5px solid var(--color-warning);
  color: #fff;
}

.ans-vague:hover {
  filter: brightness(1.08);
}

/* "会了" — solid style */
.ans-known {
  background: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  color: #fff;
}

.ans-known:hover {
  background: var(--color-primary-hover);
}

/* --- Keyboard shortcuts --- */
.shortcuts {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* --- Complete overlay --- */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.overlay-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-10);
  max-width: 380px;
  width: 90%;
  text-align: center;
}

.overlay-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
}

.overlay-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-10);
  margin-bottom: var(--space-8);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.stat-num {
  font-size: var(--text-3xl);
  font-weight: 700;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.known { color: var(--color-success); }
.vague { color: var(--color-warning); }
.unknown { color: var(--color-danger); }

.overlay-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-primary {
  width: 100%;
  padding: var(--space-3);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-outline {
  display: block;
  width: 100%;
  padding: var(--space-3);
  background: transparent;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-outline:hover {
  background: var(--color-primary);
  color: #fff;
}

/* --- Responsive --- */
@media (max-width: 480px) {
  .dashboard {
    flex-wrap: wrap;
  }

  .stat-card {
    flex: 1 1 calc(50% - var(--space-3) / 2);
    min-width: calc(50% - var(--space-3) / 2);
  }

  .answer-row {
    width: 320px;
  }

  .card-area {
    gap: var(--space-2);
  }
}
</style>
