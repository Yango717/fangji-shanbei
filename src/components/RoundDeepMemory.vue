<script setup>
import { computed } from 'vue'
import DeepFlashCard from './DeepFlashCard.vue'

const props = defineProps({
  formulas: { type: Array, required: true },
  readIds: { type: Set, default: () => new Set() },
  currentIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['read', 'next'])

const currentFormula = computed(() => props.formulas[props.currentIndex])
const isFlipped = computed(() => props.readIds.has(currentFormula.value?.id))
const isLast = computed(() => props.currentIndex >= props.formulas.length - 1)

function handleFlip() {
  if (!isFlipped.value && currentFormula.value) {
    emit('read', currentFormula.value.id)
  }
}

function handleNext() {
  emit('next')
}
</script>

<template>
  <div class="round-memory">
    <div class="card-area">
      <DeepFlashCard
        v-if="currentFormula"
        :formula="currentFormula"
        :flipped="isFlipped"
        @flip="handleFlip"
      />
    </div>

    <div class="memory-actions">
      <template v-if="isFlipped">
        <button class="btn-next" @click="handleNext">
          {{ isLast ? '完成记忆，进入测试' : '已阅读，下一张' }}
        </button>
      </template>
      <p v-else class="hint">点击卡片查看深度内容</p>
    </div>

    <div class="memory-progress">
      {{ readIds.size }} / {{ formulas.length }}
    </div>
  </div>
</template>

<style scoped>
.round-memory {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.card-area {
  display: flex;
  justify-content: center;
}

.memory-actions {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-next {
  padding: var(--space-3) var(--space-8);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  transition: all 0.15s;
  min-height: 44px;
}

.btn-next:active {
  transform: scale(0.97);
}

.btn-next:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.memory-progress {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>
