<script setup>
import { ref, computed } from 'vue'
import QuizOption from './QuizOption.vue'

const props = defineProps({
  questions: { type: Array, required: true },
  currentIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['answer', 'next'])

const selectedIndex = ref(null)
const answered = ref(false)

const currentQuestion = computed(() => props.questions[props.currentIndex])
const isCorrect = computed(() => selectedIndex.value === currentQuestion.value?.correctIndex)

function getOptionState(optIndex) {
  if (!answered.value) return 'default'
  if (optIndex === selectedIndex.value) {
    return isCorrect.value ? 'correct' : 'wrong'
  }
  if (optIndex === currentQuestion.value.correctIndex && !isCorrect.value) {
    return 'revealed'
  }
  return 'disabled'
}

function selectOption(optIndex) {
  if (answered.value) return
  selectedIndex.value = optIndex
  answered.value = true

  const correct = optIndex === currentQuestion.value.correctIndex
  emit('answer', currentQuestion.value.formulaId, correct)

  if (correct) {
    setTimeout(() => {
      emit('next')
      selectedIndex.value = null
      answered.value = false
    }, 800)
  }
}

function handleNext() {
  emit('next')
  selectedIndex.value = null
  answered.value = false
}
</script>

<template>
  <div class="round-error">
    <div class="error-badge">错题强化</div>

    <div class="quiz-card">
      <h3 class="quiz-name">{{ currentQuestion?.formulaName }}</h3>
      <p class="quiz-question">{{ currentQuestion?.questionText }}</p>
    </div>

    <div class="quiz-options">
      <QuizOption
        v-for="(opt, i) in currentQuestion?.options"
        :key="i"
        :text="opt"
        :state="getOptionState(i)"
        @select="selectOption(i)"
      />
    </div>

    <div v-if="answered && !isCorrect" class="feedback-area">
      <p class="feedback-wrong">答错了，正确答案已标出</p>
      <button class="btn-next" @click="handleNext">下一题</button>
    </div>
  </div>
</template>

<style scoped>
.round-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.error-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-danger);
  background: var(--color-danger-light);
  padding: var(--space-1) var(--space-4);
  border-radius: 999px;
}

.quiz-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  text-align: center;
  width: 100%;
}

.quiz-name {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.quiz-question {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.feedback-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.feedback-wrong {
  font-size: var(--text-sm);
  color: var(--color-danger);
  font-weight: 500;
}

.btn-next {
  padding: var(--space-3) var(--space-8);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  transition: all 0.15s;
  min-height: 44px;
  min-width: 120px;
}

.btn-next:active {
  transform: scale(0.97);
}

.btn-next:hover {
  background: var(--color-primary-hover);
}
</style>
