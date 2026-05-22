<script setup>
defineProps({
  label: { type: String, required: true },
  content: { type: String, default: '待补充' },
  popped: { type: Boolean, default: false },
  index: { type: Number, default: 0 }
})
defineEmits(['flip'])
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
          <p class="tarot-back-content">{{ content || '待补充' }}</p>
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
  white-space: pre-wrap;
  text-align: left;
}

@media (max-width: 400px) {
  .tarot-card {
    width: 260px;
    height: 360px;
  }
}
</style>
