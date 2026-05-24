<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../composables/useMarkdown'

const props = defineProps({
  label: { type: String, required: true },
  content: { type: String, default: '待补充' },
  popped: { type: Boolean, default: false },
  index: { type: Number, default: 0 }
})
defineEmits(['flip'])

const renderedContent = computed(() => renderMarkdown(props.content))
</script>

<template>
  <div
    class="tarot-card"
    :class="{ popped }"
    @click="$emit('flip')"
  >
    <div class="tarot-card-inner">
      <div class="tarot-face tarot-front">
        <span class="tarot-num">{{ index + 1 }}</span>
        <h4 class="tarot-label">{{ label }}</h4>
        <span class="tarot-hint">点击查看</span>
      </div>
      <div class="tarot-face tarot-back">
        <h5 class="tarot-back-label">{{ label }}</h5>
        <div class="tarot-back-body">
          <div class="tarot-back-content" v-html="renderedContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-card {
  width: 280px;
  height: 380px;
  perspective: 1000px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.tarot-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.tarot-card.popped .tarot-card-inner {
  transform: rotateY(180deg);
}

.tarot-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  overflow: hidden;
  background: var(--color-bg-card);
}

.tarot-front {
  gap: var(--space-2);
}

.tarot-num {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  opacity: 0.6;
}

.tarot-label {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
}

.tarot-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-2);
}

.tarot-back {
  transform: rotateY(180deg);
  justify-content: flex-start;
  padding: 0;
}

.tarot-back-label {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-primary);
  padding: var(--space-4) var(--space-5) 0;
  text-align: center;
  width: 100%;
  flex-shrink: 0;
}

.tarot-back-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-5) var(--space-5);
  width: 100%;
}

.tarot-back-content {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.9;
  text-align: left;
}

.tarot-back-content :deep(p) {
  margin: 0 0 var(--space-2);
}

.tarot-back-content :deep(strong) {
  color: var(--color-primary);
  font-weight: 600;
}

.tarot-back-content :deep(.role-cards) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 4px 0;
}
.tarot-back-content :deep(.role-card) {
  border-radius: 8px;
  padding: 8px 10px;
  border-left: 4px solid #d0d0d0;
}
.tarot-back-content :deep(.role-card.role-jun) { border-left-color: #c9a84c; background: #fef9ed; }
.tarot-back-content :deep(.role-card.role-chen) { border-left-color: #4a8bc2; background: #eef5fb; }
.tarot-back-content :deep(.role-card.role-zuo) { border-left-color: #4c9a6e; background: #edf7f1; }
.tarot-back-content :deep(.role-card.role-shi) { border-left-color: #7c6aaa; background: #f3f1f9; }
.tarot-back-content :deep(.role-badge) {
  display: inline-block; font-size: 11px; font-weight: 800;
  padding: 1px 7px; border-radius: 4px; margin-right: 6px; vertical-align: middle;
}
.tarot-back-content :deep(.role-jun-badge) { background: #c9a84c; color: #fff; }
.tarot-back-content :deep(.role-chen-badge) { background: #4a8bc2; color: #fff; }
.tarot-back-content :deep(.role-zuo-badge) { background: #4c9a6e; color: #fff; }
.tarot-back-content :deep(.role-shi-badge) { background: #7c6aaa; color: #fff; }
.tarot-back-content :deep(.role-drug) { font-weight: 700; color: var(--color-text); vertical-align: middle; }
.tarot-back-content :deep(.role-desc) { font-size: 12px; color: var(--color-text-secondary); line-height: 1.6; margin-top: 2px; }

.tarot-back-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-xs);
  margin: var(--space-2) 0;
}

.tarot-back-content :deep(th),
.tarot-back-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-2);
  text-align: left;
  vertical-align: top;
}

.tarot-back-content :deep(th) {
  background: var(--color-bg-inset);
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.tarot-back-content :deep(ol),
.tarot-back-content :deep(ul) {
  margin: var(--space-2) 0;
  padding-left: var(--space-5);
}

.tarot-back-content :deep(li) {
  margin-bottom: var(--space-1);
}

.tarot-back-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-divider);
  margin: var(--space-3) 0;
}

/* Role cards */
.tarot-back-content :deep(.role-cards) {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: var(--space-2) 0;
}

.tarot-back-content :deep(.role-card) {
  border-radius: var(--radius-md);
  padding: var(--space-3);
  border-left: 4px solid var(--color-border);
  background: var(--color-bg-inset);
}

.tarot-back-content :deep(.role-card.role-jun) {
  border-left-color: #c9a84c;
  background: #fdf8ee;
}
.tarot-back-content :deep(.role-card.role-chen) {
  border-left-color: #5b8db8;
  background: #eef4f9;
}
.tarot-back-content :deep(.role-card.role-zuo) {
  border-left-color: #5b9a7c;
  background: #eef7f2;
}
.tarot-back-content :deep(.role-card.role-shi) {
  border-left-color: #8e7cb0;
  background: #f3f0f8;
}

.tarot-back-content :deep(.role-badge) {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 1px 8px;
  border-radius: var(--radius-sm);
  margin-right: var(--space-2);
  vertical-align: middle;
}
.tarot-back-content :deep(.role-jun-badge) {
  background: #c9a84c;
  color: #fff;
}
.tarot-back-content :deep(.role-chen-badge) {
  background: #5b8db8;
  color: #fff;
}
.tarot-back-content :deep(.role-zuo-badge) {
  background: #5b9a7c;
  color: #fff;
}
.tarot-back-content :deep(.role-shi-badge) {
  background: #8e7cb0;
  color: #fff;
}

.tarot-back-content :deep(.role-drug) {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  vertical-align: middle;
}

.tarot-back-content :deep(.role-desc) {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: var(--space-1);
}

@media (max-width: 400px) {
  .tarot-card {
    width: 230px;
    height: 300px;
  }
  .tarot-num { font-size: 2rem; }
  .tarot-label { font-size: var(--text-lg); }
  .tarot-back-label { font-size: var(--text-sm); padding: var(--space-3) var(--space-4) 0; }
  .tarot-back-body { padding: var(--space-2) var(--space-4) var(--space-4); }
  .tarot-back-content { font-size: 0.75rem; line-height: 1.7; }
}
</style>
