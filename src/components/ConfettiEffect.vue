<script setup>
import { computed, onMounted, ref } from 'vue'

defineProps({ active: { type: Boolean, default: false } })

const colors = [
  'var(--color-primary)',
  'var(--color-accent)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
  '#E8EDE9',
  '#F5EDE4'
]

const particles = computed(() => {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 1.5,
    rotation: Math.random() * 720
  }))
})
</script>

<template>
  <div v-if="active" class="confetti-container">
    <span
      v-for="p in particles"
      :key="p.id"
      class="confetti-piece"
      :style="{
        left: p.left + '%',
        width: p.size + 'px',
        height: p.size + 'px',
        backgroundColor: p.color,
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's'
      }"
    ></span>
  </div>
</template>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 300;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation: confettiFall 3s ease-out forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
