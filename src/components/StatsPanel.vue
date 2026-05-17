<script setup>
import { computed } from 'vue'
import { useStreak } from '../composables/useStreak'
import { useStudyStats } from '../composables/useStudyStats'
import { useFormulaStore } from '../stores/formula'

const formulaStore = useFormulaStore()
const { streak } = useStreak()
const { formattedTime, weekDays } = useStudyStats()

const learnedCount = computed(() => formulaStore.learnedCount)
const masteredCount = computed(() => formulaStore.statsByStatus.known)
</script>

<template>
  <div class="stats-panel">
    <!-- Streak -->
    <div class="panel-section">
      <div class="streak-row">
        <span class="streak-number">{{ streak.currentStreak }}</span>
        <div>
          <span class="streak-label">天连续学习</span>
        </div>
      </div>
    </div>

    <!-- Weekly calendar -->
    <div class="panel-section">
      <span class="section-label">本周</span>
      <div class="week-row">
        <div
          v-for="day in weekDays" :key="day.date"
          class="day-cell"
          :class="{ studied: day.studied, today: day.isToday }"
        >
          <span class="day-label">{{ day.label }}</span>
          <span class="day-dot"></span>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="panel-section stats-grid">
      <div class="stat-item">
        <span class="stat-value">{{ learnedCount }}</span>
        <span class="stat-label">累计学习</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ masteredCount }}</span>
        <span class="stat-label">累计掌握</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formattedTime }}</span>
        <span class="stat-label">累计时长</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  position: absolute;
  top: 56px;
  right: 0;
  width: 320px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  padding: var(--space-5);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.panel-section + .panel-section {
  border-top: 1px solid var(--color-divider);
  padding-top: var(--space-4);
}

/* Streak */
.streak-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.streak-number {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.streak-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Section label */
.section-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Week calendar */
.week-row {
  display: flex;
  justify-content: space-between;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.day-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.day-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-bg-inset);
  border: 1px solid var(--color-border);
  transition: all 0.15s;
}

.day-cell.studied .day-dot {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.day-cell.today .day-dot {
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .stats-panel {
    width: calc(100vw - var(--space-8) * 2);
    right: calc(-1 * var(--space-2));
  }
}
</style>
