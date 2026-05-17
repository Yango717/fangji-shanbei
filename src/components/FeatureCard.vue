<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<template>
  <div class="feature-card">
    <div class="feature-icon">{{ icon }}</div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.feature-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
  flex: 1;
  min-width: 0;
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-xl);
  font-weight: 700;
}

.feature-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.feature-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}
</style>
