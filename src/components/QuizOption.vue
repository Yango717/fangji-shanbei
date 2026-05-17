<script setup>
defineProps({
  text: { type: String, required: true },
  state: { type: String, default: 'default' }
})
defineEmits(['select'])
</script>

<template>
  <button
    class="option"
    :class="{
      correct: state === 'correct',
      wrong: state === 'wrong',
      revealed: state === 'revealed',
      disabled: state !== 'default'
    }"
    @click="$emit('select')"
  >
    <span class="option-text">{{ text }}</span>
    <span v-if="state === 'correct'" class="option-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    <span v-if="state === 'wrong'" class="option-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span>
  </button>
</template>

<style scoped>
.option {
  width: 100%;
  text-align: left;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-card);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.6;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.option:hover:not(.disabled) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option:active:not(.disabled) {
  transform: scale(0.98);
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option.correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.option.wrong {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
}

.option.revealed {
  border-color: var(--color-success);
  background: var(--color-success-light);
  opacity: 0.8;
}

.option.disabled {
  cursor: default;
}

.option-text { flex: 1; }

.option-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct .option-icon { color: var(--color-success); }
.wrong .option-icon { color: var(--color-danger); }
</style>
