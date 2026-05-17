<script setup>
defineProps({
  formula: { type: Object, required: true },
  errorCount: { type: Number, default: 0 },
  lastDate: { type: String, default: '' },
  mastered: { type: Boolean, default: false }
})
defineEmits(['practice', 'remove'])
</script>

<template>
  <div class="item" :class="{ mastered }">
    <div class="item-info">
      <span class="item-name">{{ formula.name }}</span>
      <span class="item-cat">{{ formula.category }}</span>
    </div>
    <div class="item-meta">
      <span class="count-badge" :class="{ high: errorCount >= 3 }">{{ errorCount }}次</span>
      <span class="last-date">{{ lastDate ? formatDate(lastDate) : '' }}</span>
    </div>
    <div class="item-actions">
      <button v-if="!mastered" class="item-btn" @click="$emit('practice')">复习</button>
      <button class="item-remove" @click="$emit('remove')">×</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(iso) {
      const d = new Date(iso)
      const now = new Date()
      const diffMs = now - d
      const diffMin = Math.floor(diffMs / 60000)
      if (diffMin < 1) return '刚刚'
      if (diffMin < 60) return `${diffMin}分钟前`
      const diffHour = Math.floor(diffMin / 60)
      if (diffHour < 24) return `${diffHour}小时前`
      const diffDay = Math.floor(diffHour / 24)
      if (diffDay < 7) return `${diffDay}天前`
      return `${d.getMonth() + 1}/${d.getDate()}`
    }
  }
}
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-divider);
  transition: background 0.1s;
}
.item:last-child { border-bottom: none; }
.item:hover { background: var(--color-bg); }
.item.mastered { opacity: 0.55; }

.item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.item-name { font-size: var(--text-base); font-weight: 600; color: var(--color-text); }
.item-cat { font-size: var(--text-xs); color: var(--color-text-muted); }

.item-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  margin: 0 var(--space-4);
  flex-shrink: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--color-warning);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 700;
}

.count-badge.high {
  background: var(--color-danger);
}

.last-date {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.item-actions { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
.item-btn {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-primary);
  transition: all 0.15s;
  min-height: 36px;
}
.item-btn:hover { background: var(--color-primary); color: #fff; }
.item-remove {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}
.item-remove:hover { color: var(--color-danger); }
</style>
