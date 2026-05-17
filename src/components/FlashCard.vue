<script setup>
defineProps({
  formula: { type: Object, default: null },
  flipped: { type: Boolean, default: false }
})
defineEmits(['flip'])
</script>

<template>
  <div class="card-wrapper" @click="$emit('flip')">
    <div class="card-perspective">
      <div class="card" :class="{ flipped }">
        <!-- Front -->
        <div class="card-face card-front">
          <div class="front-tag">{{ formula?.category }}</div>
          <h2 class="front-name">{{ formula?.name }}</h2>
          <p class="front-hint">点击翻转查看详情</p>
        </div>
        <!-- Back -->
        <div class="card-face card-back">
          <div class="back-scroll">
            <div class="back-block">
              <span class="back-label">组成</span>
              <p class="back-text">{{ formula?.composition }}</p>
            </div>
            <div class="back-divider"></div>
            <div class="back-block">
              <span class="back-label">功效</span>
              <p class="back-text">{{ formula?.efficacy }}</p>
            </div>
            <div class="back-divider"></div>
            <div class="back-block">
              <span class="back-label">主治</span>
              <p class="back-text">{{ formula?.indications }}</p>
            </div>
            <div class="back-divider"></div>
            <div class="back-block mnemonic-block">
              <span class="back-label">口诀</span>
              <p class="back-text mnemonic-text">{{ formula?.mnemonic }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  width: 380px;
  height: 500px;
  cursor: pointer;
  flex-shrink: 0;
  max-width: calc(100vw - var(--space-8));
}

.card-perspective {
  width: 100%;
  height: 100%;
  perspective: 1200px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card.flipped { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius-xl);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

/* Front */
.card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.front-tag {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--space-1) var(--space-4);
  border-radius: 999px;
  letter-spacing: var(--tracking-wide);
}

.front-name {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0.08em;
}

.front-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-6);
}

/* Back */
.card-back {
  transform: rotateY(180deg);
}

.back-scroll {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.back-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.back-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.back-text {
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.8;
}

.back-divider {
  height: 1px;
  background: var(--color-divider);
  margin: var(--space-4) 0;
  flex-shrink: 0;
}

.mnemonic-block {
  background: var(--color-accent-light);
  border-left: 3px solid var(--color-accent);
  padding: var(--space-4);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-top: auto;
}

.mnemonic-text {
  color: var(--color-accent-dark, #8F6830);
  font-weight: 500;
}

@media (max-width: 440px) {
  .card-wrapper {
    width: calc(100vw - 48px);
    height: 460px;
    max-width: 360px;
  }
  .front-name { font-size: var(--text-3xl); }
}
</style>
