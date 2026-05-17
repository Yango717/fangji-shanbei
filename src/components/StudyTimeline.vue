<script setup>
defineProps({
  currentRound: { type: Number, required: true }
})

const steps = [
  { num: 1, label: '记忆' },
  { num: 2, label: '测试' },
  { num: 3, label: '强化' },
  { num: 4, label: '错题' }
]
</script>

<template>
  <div class="timeline">
    <template v-for="(step, i) in steps" :key="step.num">
      <div class="step" :class="{
        active: step.num === currentRound,
        done: step.num < currentRound
      }">
        <div class="step-dot">
          <svg v-if="step.num < currentRound" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>{{ step.num }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </div>
      <div v-if="i < steps.length - 1" class="step-line" :class="{ filled: step.num < currentRound }"></div>
    </template>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: var(--space-4) 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-inset);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.step.active .step-dot {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(27, 77, 62, 0.3);
}

.step.done .step-dot {
  background: var(--color-primary);
  color: #fff;
}

.step-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

.step.active .step-label {
  color: var(--color-primary);
  font-weight: 600;
}

.step.done .step-label {
  color: var(--color-primary);
}

.step-line {
  width: 32px;
  height: 2px;
  background: var(--color-border);
  margin: 0 var(--space-2);
  margin-bottom: var(--space-5);
  transition: background 0.2s;
}

.step-line.filled {
  background: var(--color-primary);
}
</style>
