<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorBookStore } from '../stores/errorBook'
import { useFormulaStore } from '../stores/formula'
import { useStudySessionStore } from '../stores/studySession'
import ErrorListItem from '../components/ErrorListItem.vue'

const router = useRouter()
const errorStore = useErrorBookStore()
const formulaStore = useFormulaStore()
const sessionStore = useStudySessionStore()

const allItems = computed(() => {
  return errorStore.sortedErrors.map(err => {
    const formula = formulaStore.allFormulas.find(f => f.id === err.id)
    const mastered = formulaStore.progress[err.id]?.status === 'known'
    return { ...err, formula, mastered }
  }).filter(item => item.formula)
})

const highFreqItems = computed(() =>
  allItems.value.filter(i => !i.mastered && i.count >= 3)
)

const normalItems = computed(() =>
  allItems.value.filter(i => !i.mastered && i.count < 3)
)

const masteredItems = computed(() =>
  allItems.value.filter(i => i.mastered)
)

const totalErrors = computed(() =>
  errorStore.sortedErrors.reduce((sum, e) => sum + e.count, 0)
)

const masteryRate = computed(() => {
  const total = formulaStore.total
  return total > 0 ? Math.round((formulaStore.learnedCount / total) * 100) : 0
})

function handlePractice() {
  router.push({ path: '/study-setup', query: { mode: 'error-book' } })
}

function practiceHighFreq() {
  const ids = highFreqItems.value.map(i => i.id)
  if (ids.length === 0) return
  sessionStore.initSession(ids, 'error-book')
  router.push('/study')
}

function handleRemove(id) { errorStore.removeError(id) }
function handleClear() {
  if (window.confirm('确定要清空错题本吗？')) errorStore.clearErrors()
}
</script>

<template>
  <div class="error-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">错题统计</h1>
        <p class="page-subtitle">{{ allItems.length > 0 ? `共 ${allItems.length} 首方剂` : '暂无错题记录' }}</p>
      </div>
      <div v-if="allItems.length > 0" class="header-actions">
        <button class="btn-outline" @click="handlePractice">全部复习</button>
        <button class="btn-ghost" @click="handleClear">清空</button>
      </div>
    </header>

    <!-- Dashboard -->
    <div v-if="allItems.length > 0" class="dashboard">
      <div class="stat-card">
        <span class="stat-label">待复习</span>
        <span class="stat-value stat-danger">{{ highFreqItems.length + normalItems.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">高频错题</span>
        <span class="stat-value stat-warning">{{ highFreqItems.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">已掌握</span>
        <span class="stat-value stat-primary">{{ masteredItems.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">掌握率</span>
        <span class="stat-value stat-primary">{{ masteryRate }}%</span>
      </div>
    </div>

    <!-- High frequency review button -->
    <button v-if="highFreqItems.length > 0" class="high-freq-btn" @click="practiceHighFreq">
      复习高频错题（{{ highFreqItems.length }} 首）
    </button>

    <!-- Empty -->
    <div v-if="allItems.length === 0" class="empty">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <p class="empty-text">暂无错题，继续保持</p>
      <router-link to="/study-setup" class="btn-outline">去学习</router-link>
    </div>

    <template v-else>
      <!-- Group: High frequency -->
      <section v-if="highFreqItems.length > 0" class="error-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-dot dot-danger"></span>
            高频错题
          </h3>
          <span class="group-count">{{ highFreqItems.length }} 首</span>
        </div>
        <div class="error-list">
          <ErrorListItem
            v-for="item in highFreqItems" :key="item.id"
            :formula="item.formula"
            :error-count="item.count"
            :last-date="item.lastWrongDate"
            @practice="handlePractice"
            @remove="handleRemove(item.id)"
          />
        </div>
      </section>

      <!-- Group: Normal -->
      <section v-if="normalItems.length > 0" class="error-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-dot dot-warning"></span>
            普通错题
          </h3>
          <span class="group-count">{{ normalItems.length }} 首</span>
        </div>
        <div class="error-list">
          <ErrorListItem
            v-for="item in normalItems" :key="item.id"
            :formula="item.formula"
            :error-count="item.count"
            :last-date="item.lastWrongDate"
            @practice="handlePractice"
            @remove="handleRemove(item.id)"
          />
        </div>
      </section>

      <!-- Group: Mastered -->
      <section v-if="masteredItems.length > 0" class="error-group">
        <div class="group-header">
          <h3 class="group-title">
            <span class="group-dot dot-success"></span>
            已掌握
          </h3>
          <span class="group-count">{{ masteredItems.length }} 首</span>
        </div>
        <div class="error-list">
          <ErrorListItem
            v-for="item in masteredItems" :key="item.id"
            :formula="item.formula"
            :error-count="item.count"
            :last-date="item.lastWrongDate"
            :mastered="true"
            @remove="handleRemove(item.id)"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.error-page {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  min-height: calc(100vh - 56px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-1);
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  gap: var(--space-2);
}

/* --- Dashboard --- */
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.stat-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.2;
}

.stat-primary { color: var(--color-primary); }
.stat-warning { color: var(--color-warning); }
.stat-danger { color: var(--color-danger); }

/* --- High freq button --- */
.high-freq-btn {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-light);
  color: var(--color-danger);
  border: 1.5px solid var(--color-danger);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-6);
  transition: all 0.15s;
}

.high-freq-btn:hover {
  background: var(--color-danger);
  color: #fff;
}

/* --- Groups --- */
.error-group {
  margin-bottom: var(--space-6);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.group-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.group-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-danger { background: var(--color-danger); }
.dot-warning { background: var(--color-warning); }
.dot-success { background: var(--color-primary); }

.group-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.error-list {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* --- Buttons --- */
.btn-outline {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.15s;
}
.btn-outline:hover { border-color: var(--color-text-muted); }

.btn-ghost {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color 0.15s;
}
.btn-ghost:hover { color: var(--color-danger); }

/* --- Empty --- */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-6);
  text-align: center;
  gap: var(--space-4);
}

.empty-icon { color: var(--color-primary); opacity: 0.4; }
.empty-text { font-size: var(--text-base); color: var(--color-text-secondary); }

@media (max-width: 640px) {
  .error-page { padding: var(--space-6) var(--space-4); }
  .page-header { flex-direction: column; gap: var(--space-4); }
  .dashboard { grid-template-columns: repeat(2, 1fr); }
}
</style>
