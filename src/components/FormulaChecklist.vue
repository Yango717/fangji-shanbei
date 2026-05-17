<script setup>
import { computed } from 'vue'
import { categories } from '../data/categories.js'

const props = defineProps({
  formulas: { type: Array, required: true },
  selectedIds: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:selectedIds'])

const groupedFormulas = computed(() => {
  return categories.map(cat => ({
    name: cat.name,
    formulas: cat.formulaIds
      .map(id => props.formulas.find(f => f.id === id))
      .filter(Boolean)
  })).filter(g => g.formulas.length > 0)
})

function toggleFormula(id) {
  const set = new Set(props.selectedIds)
  if (set.has(id)) {
    set.delete(id)
  } else {
    set.add(id)
  }
  emit('update:selectedIds', [...set])
}

function toggleCategory(catFormulas) {
  const ids = catFormulas.map(f => f.id)
  const allSelected = ids.every(id => props.selectedIds.includes(id))
  let newSet = new Set(props.selectedIds)
  if (allSelected) {
    ids.forEach(id => newSet.delete(id))
  } else {
    ids.forEach(id => newSet.add(id))
  }
  emit('update:selectedIds', [...newSet])
}
</script>

<template>
  <div class="checklist">
    <div v-for="group in groupedFormulas" :key="group.name" class="checklist-group">
      <div class="group-header" @click="toggleCategory(group.formulas)">
        <span class="group-name">{{ group.name }}</span>
        <span class="group-count">{{ group.formulas.length }} 首</span>
      </div>
      <div class="group-items">
        <label v-for="f in group.formulas" :key="f.id" class="formula-item">
          <input
            type="checkbox"
            :checked="selectedIds.includes(f.id)"
            @change="toggleFormula(f.id)"
          />
          <span class="formula-name">{{ f.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checklist {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
}

.checklist-group {
  border-bottom: 1px solid var(--color-divider);
}
.checklist-group:last-child { border-bottom: none; }

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  cursor: pointer;
  position: sticky;
  top: 0;
  z-index: 1;
}

.group-header:hover { background: var(--color-bg-inset); }

.group-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.group-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.group-items {
  padding: var(--space-2) var(--space-4);
}

.formula-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) 0;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.formula-item:hover { color: var(--color-text); }

.formula-item input[type="checkbox"] {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.formula-name { flex: 1; }
</style>
