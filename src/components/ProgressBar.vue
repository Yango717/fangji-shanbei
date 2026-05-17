<script setup>
import { computed } from 'vue'
const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true }
})
const pct = computed(() => props.total ? Math.round((props.current / props.total) * 100) : 0)
</script>

<template>
  <div class="progress-wrap">
    <div class="progress-header">
      <span class="progress-label">学习进度</span>
      <span class="progress-count">{{ current }} / {{ total }}</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: pct + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-wrap {
  width: 100%;
  margin-bottom: var(--space-6);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.progress-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.progress-count {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.progress-track {
  width: 100%;
  height: 6px;
  background: var(--color-bg-inset);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.4s ease;
}
</style>
