<script setup>
defineProps({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  masteryRate: { type: Number, default: 0 },
  selected: { type: Boolean, default: false }
})
defineEmits(['toggle'])
</script>

<template>
  <div class="category-card" :class="{ selected }" @click="$emit('toggle')">
    <div class="card-check">
      <svg v-if="selected" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <span class="card-name">{{ name }}</span>
    <span class="card-count">{{ count }} 首方剂</span>
    <div class="card-progress">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: masteryRate + '%' }"></div>
      </div>
      <span class="progress-label">掌握率 {{ masteryRate }}%</span>
    </div>
  </div>
</template>

<style scoped>
.category-card {
  background: var(--color-bg-card);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.category-card:hover {
  border-color: var(--color-text-muted);
  transform: translateY(-1px);
}

.category-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.card-check {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--text-xs);
  transition: all 0.15s;
}

.selected .card-check {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.card-name {
  display: block;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-1);
}

.card-count {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}

.card-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-track {
  flex: 1;
  height: 4px;
  background: var(--color-bg-inset);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}
</style>
