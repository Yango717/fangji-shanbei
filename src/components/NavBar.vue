<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStreak } from '../composables/useStreak'
import StatsPanel from './StatsPanel.vue'

const route = useRoute()
const { streak } = useStreak()
const showStats = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/study-setup', label: '学习' },
  { path: '/errors', label: '错题' },
  { path: '/pricing', label: '定价' }
]

function isActive(itemPath) {
  if (itemPath === '/study-setup') {
    return route.path.startsWith('/study')
  }
  return route.path === itemPath
}

function toggleStats() {
  showStats.value = !showStats.value
}

function closeStats() {
  showStats.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand" @click="closeStats">
        <div class="brand-logo">方</div>
        <span class="brand-name">方剂闪背</span>
      </router-link>
      <div class="nav-right">
        <span
          v-if="streak.currentStreak > 0"
          class="streak-badge"
          :class="{ active: showStats }"
          @click="toggleStats"
        >
          {{ streak.currentStreak }}天
        </span>
        <div class="nav-links">
          <router-link
            v-for="item in navItems" :key="item.path"
            :to="item.path" class="nav-link"
            :class="{ active: isActive(item.path) }"
            @click="closeStats"
          >{{ item.label }}</router-link>
        </div>
      </div>
    </div>

    <!-- Stats dropdown -->
    <div v-if="showStats" class="panel-backdrop" @click="closeStats"></div>
    <div class="panel-anchor">
      <StatsPanel v-if="showStats" />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: rgba(248, 247, 244, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.navbar-inner {
  max-width: 1080px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-text);
}

.brand-logo {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-base);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(27, 77, 62, 0.25);
  position: relative;
  letter-spacing: 0;
}

.brand-logo::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 3px;
}

.brand-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: var(--tracking-wide);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  position: relative;
}

.streak-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-light);
  padding: 2px var(--space-3);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
}

.streak-badge:hover,
.streak-badge.active {
  background: var(--color-accent);
  color: #fff;
}

.panel-backdrop {
  position: fixed;
  inset: 0;
  top: 56px;
  z-index: 199;
}

.panel-anchor {
  position: absolute;
  top: 0;
  right: 0;
  width: 1080px;
  max-width: 100vw;
  margin: 0 auto;
  left: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0 var(--space-6);
  pointer-events: none;
  z-index: 200;
}

.panel-anchor > * {
  pointer-events: auto;
  margin-top: 56px;
}

.nav-links {
  display: flex;
  gap: var(--space-1);
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-bg-inset);
}

.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

@media (max-width: 640px) {
  .brand-name { display: none; }
  .nav-link { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); }
  .panel-anchor { padding: 0 var(--space-4); }
}
</style>
