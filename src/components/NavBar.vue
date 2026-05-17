<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/learn', label: '学习', icon: '📖' },
  { path: '/errors', label: '错题本', icon: '📋' }
]
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">⚗</span>
        <span class="brand-text">方剂闪背</span>
      </router-link>
      <div class="navbar-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(250, 246, 240, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.navbar-inner {
  max-width: 960px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-lg);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--color-primary);
}

.brand-icon {
  font-size: 1.4rem;
}

.brand-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.navbar-links {
  display: flex;
  gap: var(--space-xs);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-ink-light);
  font-size: var(--text-sm);
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--color-bg-inset);
  color: var(--color-ink);
}

.nav-link.active {
  background: var(--color-primary);
  color: #fff;
}

.nav-icon {
  font-size: 1rem;
}
</style>
