<script setup>
import { ref, watch, computed } from 'vue'
import DeepTarotCard from './DeepTarotCard.vue'

const props = defineProps({
  formula: { type: Object, required: true }
})
const emit = defineEmits(['complete'])

const activeKey = ref(null)
const readKeys = ref(new Set())
const hasEmittedComplete = ref(false)

const cardDefs = [
  { key: 'article',             label: '条文' },
  { key: 'pathogenesis',       label: '证治机理' },
  { key: 'formulaExplanation', label: '方解' },
  { key: 'compatibility',      label: '配伍意义' },
  { key: 'clinicalApplication',label: '临床运用' }
]

const allRead = computed(() => readKeys.value.size === cardDefs.length)

function onFlip(key) {
  if (activeKey.value === key) {
    // Click active card → return to fan
    activeKey.value = null
  } else {
    // Click another card → switch
    activeKey.value = key
    // Mark as read
    const next = new Set(readKeys.value)
    next.add(key)
    readKeys.value = next

    if (next.size === cardDefs.length && !hasEmittedComplete.value) {
      hasEmittedComplete.value = true
      emit('complete')
    }
  }
}

function getContent(key) {
  return props.formula?.deepLearning?.[key] || '待补充'
}

watch(() => props.formula?.id, () => {
  activeKey.value = null
  readKeys.value = new Set()
  hasEmittedComplete.value = false
})
</script>

<template>
  <div class="tarot-stack">
    <div class="stack-header">
      <span class="stack-category">{{ formula?.category }}</span>
      <h2 class="stack-name">{{ formula?.name }}</h2>
    </div>

    <div class="stack-cards-area">
      <div
        v-for="(card, i) in cardDefs"
        :key="card.key"
        class="stack-card-slot"
        :class="{
          'is-popped': activeKey === card.key,
          'is-read': readKeys.has(card.key),
          'is-dimmed': activeKey && activeKey !== card.key
        }"
        :style="{ '--slot': i }"
      >
        <DeepTarotCard
          :label="card.label"
          :content="getContent(card.key)"
          :popped="activeKey === card.key"
          :index="i"
          @flip="onFlip(card.key)"
        />
      </div>
    </div>

    <div class="stack-footer">
      <div class="stack-progress">
        <span class="progress-text">
          已阅读 <strong>{{ readKeys.size }}</strong> / {{ cardDefs.length }}
        </span>
        <span v-if="allRead" class="all-read-badge">全部已读</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.stack-header {
  text-align: center;
}

.stack-category {
  display: inline-block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-inset);
  padding: 2px var(--space-3);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
}

.stack-name {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
}

/* ---- Fan area ---- */
.stack-cards-area {
  position: relative;
  width: 320px;
  height: 420px;
}

.stack-card-slot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform-origin: bottom center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.25s ease;
  will-change: transform;
}

/* Fan spread: pivot from bottom center, rotate outward */
.stack-card-slot:nth-child(1) { --fan-rotate: -14deg; z-index: 1; }
.stack-card-slot:nth-child(2) { --fan-rotate: -7deg;  z-index: 2; }
.stack-card-slot:nth-child(3) { --fan-rotate: 0deg;   z-index: 3; }
.stack-card-slot:nth-child(4) { --fan-rotate: 7deg;   z-index: 4; }
.stack-card-slot:nth-child(5) { --fan-rotate: 14deg;  z-index: 5; }

/* Default: fanned position */
.stack-card-slot {
  transform: translateX(-50%) rotate(var(--fan-rotate));
}

/* Popped card: center, straight, slightly larger, in front */
.stack-card-slot.is-popped {
  transform: translateX(-50%) rotate(0deg) scale(1.05) translateY(-16px);
  z-index: 20 !important;
}

/* Dim unread cards when another is active */
.stack-card-slot.is-dimmed:not(.is-read) {
  opacity: 0.55;
}

.stack-footer {
  text-align: center;
}

.stack-progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.progress-text strong {
  color: var(--color-primary);
  font-size: var(--text-lg);
}

.all-read-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-success);
  background: var(--color-success-light, #e8f5e9);
  padding: 2px var(--space-3);
  border-radius: var(--radius-full);
}

@media (max-width: 400px) {
  .stack-cards-area {
    width: 260px;
    height: 340px;
  }
  .stack-card-slot:nth-child(1) { --fan-rotate: -9deg; }
  .stack-card-slot:nth-child(2) { --fan-rotate: -4.5deg; }
  .stack-card-slot:nth-child(3) { --fan-rotate: 0deg; }
  .stack-card-slot:nth-child(4) { --fan-rotate: 4.5deg; }
  .stack-card-slot:nth-child(5) { --fan-rotate: 9deg; }
  .stack-name { font-size: var(--text-xl); }
  .stack-header { margin-bottom: 0; }
  .tarot-stack { gap: var(--space-3); }
}
</style>
