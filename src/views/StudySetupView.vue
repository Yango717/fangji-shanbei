<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormulaStore } from '../stores/formula'
import { useErrorBookStore } from '../stores/errorBook'
import { useStudySessionStore } from '../stores/studySession'
import { useDailyRecommend } from '../composables/useDailyRecommend'
import { categories } from '../data/categories.js'
import CategoryCard from '../components/CategoryCard.vue'
import FormulaChecklist from '../components/FormulaChecklist.vue'

const router = useRouter()
const route = useRoute()
const formulaStore = useFormulaStore()
const errorStore = useErrorBookStore()
const sessionStore = useStudySessionStore()
const { recommendIds, hasRecommendation, description } = useDailyRecommend()

const activeTab = ref('category')
const selectedCategories = ref(new Set())
const customSelectedIds = ref([])

const tabs = [
  { key: 'all', label: '全部学习' },
  { key: 'category', label: '按分类学习' },
  { key: 'custom', label: '自定义组合' }
]

const categoryCards = computed(() => {
  return categories.map(cat => {
    const knownInCategory = cat.formulaIds.filter(
      id => formulaStore.progress[id]?.status === 'known'
    ).length
    return {
      name: cat.name,
      count: cat.count,
      formulaIds: cat.formulaIds,
      masteryRate: cat.count > 0 ? Math.round((knownInCategory / cat.count) * 100) : 0
    }
  })
})

const selectedCount = computed(() => {
  switch (activeTab.value) {
    case 'all':
      return formulaStore.total
    case 'category': {
      const ids = new Set()
      selectedCategories.value.forEach(name => {
        const cat = categories.find(c => c.name === name)
        cat?.formulaIds.forEach(id => ids.add(id))
      })
      return ids.size
    }
    case 'custom':
      return customSelectedIds.value.length
    default:
      return 0
  }
})

const canStart = computed(() => selectedCount.value > 0)

function toggleCategory(name) {
  const set = new Set(selectedCategories.value)
  if (set.has(name)) {
    set.delete(name)
  } else {
    set.add(name)
  }
  selectedCategories.value = set
}

function startStudy() {
  let ids = []
  let mode = activeTab.value

  switch (activeTab.value) {
    case 'all':
      ids = formulaStore.allFormulas.map(f => f.id)
      break
    case 'category': {
      const idSet = new Set()
      selectedCategories.value.forEach(name => {
        const cat = categories.find(c => c.name === name)
        cat?.formulaIds.forEach(id => idSet.add(id))
      })
      ids = [...idSet]
      break
    }
    case 'custom':
      ids = [...customSelectedIds.value]
      break
  }

  if (ids.length === 0) return

  sessionStore.initSession(ids, mode)
  router.push('/study')
}

function startRecommended() {
  if (!hasRecommendation.value) return
  sessionStore.initSession(recommendIds.value.ids, 'recommend')
  router.push('/study')
}

const rounds = [
  { num: 1, label: '记忆学习', desc: '查看歌诀、组成、功效' },
  { num: 2, label: '选择题测试', desc: '根据方剂名选正确答案' },
  { num: 3, label: '随机强化', desc: '打乱顺序再次测试' },
  { num: 4, label: '错题强化', desc: '仅重做错误方剂' }
]

onMounted(() => {
  if (route.query.mode === 'error-book') {
    const errorIds = errorStore.sortedErrors.map(e => e.id)
    if (errorIds.length > 0) {
      sessionStore.initSession(errorIds, 'error-book')
      router.replace('/study')
    }
  }
})
</script>

<template>
  <div class="setup-page">
    <header class="page-header">
      <h1 class="page-title">选择学习内容</h1>
      <p class="page-subtitle">自定义本次学习范围</p>
    </header>

    <!-- Daily Recommend -->
    <div v-if="hasRecommendation" class="recommend-card">
      <div class="recommend-header">
        <h3 class="recommend-title">今日推荐学习</h3>
        <span class="recommend-count">{{ recommendIds.ids.length }} 首</span>
      </div>
      <p class="recommend-desc">{{ description }}</p>
      <button class="recommend-btn" @click="startRecommended">一键开始学习</button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs" :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- Tab: All -->
    <div v-if="activeTab === 'all'" class="tab-content">
      <div class="all-confirm">
        <div class="all-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <p class="all-text">将学习全部 <strong>{{ formulaStore.total }}</strong> 首方剂</p>
        <p class="all-hint">涵盖所有 18 个分类</p>
      </div>
    </div>

    <!-- Tab: Category -->
    <div v-if="activeTab === 'category'" class="tab-content">
      <div class="category-grid">
        <CategoryCard
          v-for="cat in categoryCards" :key="cat.name"
          :name="cat.name"
          :count="cat.count"
          :mastery-rate="cat.masteryRate"
          :selected="selectedCategories.has(cat.name)"
          @toggle="toggleCategory(cat.name)"
        />
      </div>
    </div>

    <!-- Tab: Custom -->
    <div v-if="activeTab === 'custom'" class="tab-content">
      <FormulaChecklist
        :formulas="formulaStore.allFormulas"
        :selected-ids="customSelectedIds"
        @update:selected-ids="customSelectedIds = $event"
      />
    </div>

    <!-- Timeline -->
    <div class="timeline-section">
      <h3 class="timeline-title">学习流程</h3>
      <div class="timeline">
        <div v-for="(r, i) in rounds" :key="r.num" class="timeline-step">
          <div class="step-dot">{{ r.num }}</div>
          <div class="step-info">
            <span class="step-label">{{ r.label }}</span>
            <span class="step-desc">{{ r.desc }}</span>
          </div>
          <div v-if="i < rounds.length - 1" class="step-line"></div>
        </div>
      </div>
    </div>

    <!-- Start button (fixed bottom) -->
    <div class="start-bar">
      <div class="start-inner">
        <span class="start-count">已选择：{{ selectedCount }} 首方剂</span>
        <button class="start-btn" :disabled="!canStart" @click="startStudy">
          开始本次学习（{{ selectedCount }}首）
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6) 120px;
  min-height: calc(100vh - 56px);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* Recommend card */
.recommend-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5) var(--space-6);
  border-left: 4px solid var(--color-accent);
  margin-bottom: var(--space-6);
}

.recommend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.recommend-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.recommend-count {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 2px var(--space-3);
  border-radius: 999px;
}

.recommend-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.recommend-btn {
  padding: var(--space-2) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all 0.15s;
}

.recommend-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Tabs */
.tabs {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
  background: var(--color-bg-inset);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.tab-btn {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.15s;
}

.tab-btn.active {
  background: var(--color-bg-card);
  color: var(--color-text);
  box-shadow: var(--shadow-xs);
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  color: var(--color-text);
}

/* Tab: All */
.all-confirm {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.all-icon {
  color: var(--color-primary);
  opacity: 0.5;
  margin-bottom: var(--space-4);
}

.all-text {
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.all-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Tab: Category */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

/* Timeline */
.timeline-section {
  margin-top: var(--space-10);
}

.timeline-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  text-align: center;
}

.timeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  justify-content: center;
}

.timeline-step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.step-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.step-desc {
  font-size: 10px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.step-line {
  width: 24px;
  height: 2px;
  background: var(--color-border);
  margin: 0 var(--space-1);
  flex-shrink: 0;
  align-self: center;
}

/* Start bar */
.start-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
  z-index: 50;
}

.start-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.start-count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.start-btn {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all 0.15s;
}

.start-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.start-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .setup-page {
    padding: var(--space-6) var(--space-4) 120px;
  }

  .timeline {
    flex-wrap: wrap;
    gap: var(--space-2);
    justify-content: center;
  }

  .step-line { display: none; }
}
</style>
