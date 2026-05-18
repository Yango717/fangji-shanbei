<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFormulaStore } from '../stores/formula'
import { useDeepStudySessionStore } from '../stores/deepStudySession'
import { useDailyRecommend } from '../composables/useDailyRecommend'
import { categories } from '../data/categories.js'
import FormulaChecklist from '../components/FormulaChecklist.vue'

const router = useRouter()
const formulaStore = useFormulaStore()
const deepStore = useDeepStudySessionStore()
const { recommendIds, hasRecommendation, description } = useDailyRecommend()

const activeTab = ref('recommend')
const customSelectedIds = ref([])

const deepRecommendIds = computed(() => {
  return recommendIds.value.ids.slice(0, 5)
})

const deepRecommendNames = computed(() => {
  return deepRecommendIds.value.map(id => {
    const f = formulaStore.allFormulas.find(x => x.id === id)
    return f ? `${f.name}（${f.category}）` : ''
  }).filter(Boolean)
})

const selectedCount = computed(() => {
  if (activeTab.value === 'recommend') return deepRecommendIds.value.length
  return customSelectedIds.value.length
})

const canStart = computed(() => {
  if (activeTab.value === 'recommend') return deepRecommendIds.value.length > 0
  return customSelectedIds.value.length >= 3 && customSelectedIds.value.length <= 10
})

function startDeepStudy() {
  const ids = activeTab.value === 'recommend'
    ? deepRecommendIds.value
    : customSelectedIds.value
  deepStore.initSession(ids, 'deep-recommend')
  router.push('/deep-study')
}
</script>

<template>
  <div class="setup-page">
    <div class="setup-header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1 class="setup-title">深度学习模式</h1>
      <p class="setup-subtitle">理解证治机理与配伍逻辑</p>
    </div>

    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'recommend' }]"
        @click="activeTab = 'recommend'"
      >今日推荐</button>
      <button
        :class="['tab', { active: activeTab === 'custom' }]"
        @click="activeTab = 'custom'"
      >自定义选择</button>
    </div>

    <!-- Recommend tab -->
    <div v-if="activeTab === 'recommend'" class="tab-content">
      <div class="recommend-info">
        <p class="recommend-count">推荐 {{ deepRecommendIds.length }} 首方剂进行深度学习</p>
        <ul class="recommend-list">
          <li v-for="(name, i) in deepRecommendNames" :key="i">{{ name }}</li>
        </ul>
      </div>
    </div>

    <!-- Custom tab -->
    <div v-if="activeTab === 'custom'" class="tab-content">
      <p class="custom-hint">选择 3-10 首方剂进行深度学习</p>
      <p class="custom-count">已选 {{ customSelectedIds.length }} / 10</p>
      <FormulaChecklist
        :all-formulas="formulaStore.allFormulas"
        :categories="categories"
        v-model:selected="customSelectedIds"
        :max-select="10"
      />
    </div>

    <div class="bottom-bar">
      <div class="bar-info">
        <span class="bar-count">{{ selectedCount }} 首方剂</span>
      </div>
      <button
        class="btn-start"
        :disabled="!canStart"
        @click="startDeepStudy"
      >开始深度学习</button>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  max-width: 560px;
  margin: 0 auto;
  padding: var(--space-4);
  padding-bottom: 100px;
  min-height: calc(100vh - 56px);
}

.setup-header {
  margin-bottom: var(--space-6);
}

.back-btn {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  cursor: pointer;
}

.back-btn:hover {
  color: var(--color-text);
}

.setup-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
}

.setup-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-2);
}

.tab {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all 0.15s;
}

.tab.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

.tab:hover:not(.active) {
  color: var(--color-text);
}

.tab-content {
  margin-bottom: var(--space-6);
}

.recommend-info {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.recommend-count {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.recommend-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.recommend-list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-inset);
  border-radius: var(--radius-sm);
}

.custom-hint {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.custom-count {
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 560px;
  margin: 0 auto;
  z-index: 50;
}

.bar-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.bar-count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.btn-start {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  min-height: 44px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-start:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-start:not(:disabled):hover {
  background: var(--color-primary-hover);
}

.btn-start:not(:disabled):active {
  transform: scale(0.97);
}
</style>
