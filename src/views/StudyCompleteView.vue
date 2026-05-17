<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudySessionStore } from '../stores/studySession'
import { useStreak } from '../composables/useStreak'
import ConfettiEffect from '../components/ConfettiEffect.vue'

const router = useRouter()
const sessionStore = useStudySessionStore()
const { streak } = useStreak()

onMounted(() => {
  if (sessionStore.selectedFormulaIds.length === 0) {
    router.replace('/')
  }
})

const encouragements = [
  '今天又进步了一点',
  '你离熟背方剂更近一步',
  '坚持学习会产生复利',
  '每一张卡片都是成长',
  '日积月累，方剂无忧',
  '厚积薄发，水到渠成'
]

const accuracyLines = [
  { min: 90, text: '掌握不错，继续保持' },
  { min: 60, text: '已有进步，再巩固几轮会更稳' },
  { min: 0, text: '别急，错题强化最有效' }
]

const streakLines = [
  { days: 30, text: '已坚持30天，方剂功力渐深' },
  { days: 14, text: '已坚持14天，量变到质变' },
  { days: 7, text: '已坚持7天，形成学习惯性' },
  { days: 3, text: '连续3天，好习惯正在养成' }
]

function getEncouragement() {
  const lines = []
  const accuracy = sessionStore.accuracyPercent
  const allMastered = sessionStore.wrongAnswerIds.size === 0
  const days = streak.value.currentStreak

  // Accuracy line
  for (const l of accuracyLines) {
    if (accuracy >= l.min) { lines.push(l.text); break }
  }

  // All mastered bonus
  if (allMastered && accuracy === 100) {
    lines.push('全部掌握，完美一轮')
  }

  // Streak line
  if (days >= 3) {
    for (const l of streakLines) {
      if (days >= l.days) { lines.push(l.text); break }
    }
  }

  // Fallback random
  if (lines.length === 0) {
    lines.push(encouragements[Math.floor(Math.random() * encouragements.length)])
  }

  return lines
}

const encouragementLines = getEncouragement()

const stats = computed(() => ({
  count: sessionStore.selectedFormulaIds.length,
  time: sessionStore.formattedTime,
  accuracy: sessionStore.accuracyPercent,
  errors: sessionStore.wrongAnswerIds.size
}))

function goHome() {
  sessionStore.resetSession()
  router.push('/')
}

function goAgain() {
  sessionStore.resetSession()
  router.push('/study-setup')
}
</script>

<template>
  <div class="complete-page">
    <ConfettiEffect :active="true" />

    <div class="complete-card">
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>

      <h1 class="complete-title">本次学习完成</h1>
      <div class="encouragement">
        <p v-for="(line, i) in encouragementLines" :key="i">{{ line }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ stats.count }}</span>
          <span class="stat-label">学习方剂</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.time }}</span>
          <span class="stat-label">用时</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.accuracy }}%</span>
          <span class="stat-label">正确率</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" :class="{ 'text-danger': stats.errors > 0 }">{{ stats.errors }}</span>
          <span class="stat-label">错题数</span>
        </div>
      </div>

      <div v-if="streak.currentStreak > 1 && streak.currentStreak < 3" class="streak-badge">
        已连续学习 {{ streak.currentStreak }} 天
      </div>

      <div class="actions">
        <button class="btn-primary" @click="goAgain">再来一组</button>
        <button class="btn-outline" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.complete-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: var(--space-6);
}

.complete-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-10) var(--space-8);
  max-width: 420px;
  width: 100%;
  text-align: center;
}

@media (max-width: 480px) {
  .complete-card { padding: var(--space-6) var(--space-4); }
  .complete-page { padding: var(--space-3); }
}

.success-icon {
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.complete-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.encouragement {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-8);
}

.encouragement p {
  font-size: var(--text-base);
  color: var(--color-accent);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-item {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.text-danger { color: var(--color-danger); }

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.streak-badge {
  display: inline-block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-light);
  padding: var(--space-2) var(--space-4);
  border-radius: 999px;
  margin-bottom: var(--space-6);
}

.actions {
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

.btn-outline {
  width: 100%;
  padding: var(--space-4);
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 44px;
}

.btn-outline:hover {
  background: var(--color-primary);
  color: #fff;
}
</style>
