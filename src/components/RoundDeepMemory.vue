<script setup>
import { ref, computed, watch } from 'vue'
import DeepTarotStack from './DeepTarotStack.vue'

const props = defineProps({
  formulas: { type: Array, required: true },
  readIds: { type: Set, default: () => new Set() },
  currentIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['read', 'next'])

const currentFormula = computed(() => props.formulas[props.currentIndex])
const isLast = computed(() => props.currentIndex >= props.formulas.length - 1)

const stackCompleted = ref(false)

function onStackComplete() {
  stackCompleted.value = true
  if (currentFormula.value) {
    emit('read', currentFormula.value.id)
  }
}

function handleNext() {
  emit('next')
}

watch(() => props.currentIndex, () => {
  stackCompleted.value = false
})
</script>

<template>
  <div class="round-memory">
    <div class="card-area">
      <DeepTarotStack
        v-if="currentFormula"
        :key="currentFormula.id"
        :formula="currentFormula"
        @complete="onStackComplete"
      />
    </div>

    <div class="memory-actions">
      <button v-if="stackCompleted" class="btn-next" @click="handleNext">
        {{ isLast ? '完成记忆，进入测试' : '已阅读，下一首' }}
      </button>
      <p v-else class="hint">翻转全部卡片以继续</p>
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
  width: 100%;
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
