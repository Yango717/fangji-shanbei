<script setup>
const props = defineProps({
  formula: { type: Object, default: null },
  flipped: { type: Boolean, default: false }
})
const emit = defineEmits(['flip'])

function handleFlip() {
  emit('flip')
}
</script>

<template>
  <div class="card-perspective">
    <div class="card" :class="{ flipped }" @click="handleFlip">
      <!-- Front -->
      <div class="card-face front">
        <span class="front-tag" v-if="formula?.category">{{ formula.category }}</span>
        <h2 class="front-name">{{ formula?.name }}</h2>
        <p class="front-hint">点击翻转查看深度内容</p>
      </div>

      <!-- Back -->
      <div class="card-face back">
        <div class="back-scroll">
          <h3 class="back-name">{{ formula?.name }}</h3>

          <div class="deep-section">
            <span class="section-label">证治机理</span>
            <p class="section-text">{{ formula?.deepLearning?.pathogenesis }}</p>
          </div>

          <div class="deep-section">
            <span class="section-label">君臣佐使</span>
            <p class="section-text">{{ formula?.deepLearning?.hierarchy }}</p>
          </div>

          <div class="deep-section">
            <span class="section-label">配伍意义</span>
            <p class="section-text">{{ formula?.deepLearning?.compatibility }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-perspective {
  perspective: 1200px;
  width: 380px;
  height: 500px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* Front */
.front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  background: var(--color-bg-card);
  padding: var(--space-6);
}

.front-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-bg-inset);
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
}

.front-name {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
}

.front-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Back */
.back {
  transform: rotateY(180deg);
  background: var(--color-bg-card);
}

.back-scroll {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.back-name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-divider);
}

.deep-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.section-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
}

/* Mobile */
@media (max-width: 440px) {
  .card-perspective {
    width: 360px;
    height: 460px;
  }
}
</style>
