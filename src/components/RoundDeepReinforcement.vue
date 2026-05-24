<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  questions: { type: Array, required: true },
  currentIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['answer', 'next'])

const currentQ = computed(() => props.questions[props.currentIndex])
const isLast = computed(() => props.currentIndex >= props.questions.length - 1)

const filledSlots = ref({})
const judged = ref(false)
const userJudgment = ref(null)
const fillResult = ref(null)

// For fill: click a tile → fill the first empty blank
function selectTile(word) {
  if (judged.value) return
  const blankId = currentQ.value.blanks.find(b => !filledSlots.value[b.id])?.id
  if (blankId) {
    filledSlots.value = { ...filledSlots.value, [blankId]: word }
  }
}

// Click filled blank → remove
function removeFromSlot(id) {
  if (judged.value) return
  const next = { ...filledSlots.value }
  delete next[id]
  filledSlots.value = next
}

const allFilled = computed(() => {
  if (!currentQ.value || currentQ.value.type !== 'fill') return false
  return currentQ.value.blanks.every(b => filledSlots.value[b.id])
})

function submitFill() {
  if (!allFilled.value) return
  const allCorrect = currentQ.value.blanks.every(b => filledSlots.value[b.id] === b.answer)
  fillResult.value = allCorrect ? 'correct' : 'wrong'
  judged.value = true
  emit('answer', currentQ.value.formulaId, allCorrect)
}

function judge(answer) {
  if (judged.value) return
  userJudgment.value = answer
  const isCorrect = answer === currentQ.value.answer
  fillResult.value = isCorrect ? 'correct' : 'wrong'
  judged.value = true
  emit('answer', currentQ.value.formulaId, isCorrect)
}

function handleNext() { emit('next') }

watch(() => props.currentIndex, () => {
  filledSlots.value = {}
  judged.value = false
  userJudgment.value = null
  fillResult.value = null
})

function isSlotFilled(id) { return !!filledSlots.value[id] }
function isTileUsed(word) { return Object.values(filledSlots.value).includes(word) }

function renderParts(template) {
  const parts = []
  let remaining = template
  let i = 0
  while (remaining.includes('______')) {
    const idx = remaining.indexOf('______')
    if (idx > 0) parts.push({ type: 'text', text: remaining.substring(0, idx) })
    const bid = currentQ.value?.blanks[i]?.id || `b${i}`
    parts.push({ type: 'blank', id: bid })
    remaining = remaining.substring(idx + 6)
    i++
  }
  if (remaining) parts.push({ type: 'text', text: remaining })
  return parts
}
</script>

<template>
  <div class="reinforcement-round">
    <div v-if="currentQ" class="question-card">
      <!-- Fill-in-blank -->
      <template v-if="currentQ.type === 'fill'">
        <p class="q-label">点击下方词块填入对应空格</p>
        <div class="q-sentence">
          <template v-for="(part, pi) in renderParts(currentQ.template)" :key="pi">
            <span v-if="part.type === 'text'" class="q-text">{{ part.text }}</span>
            <span
              v-else
              class="q-blank"
              :class="{
                'is-filled': isSlotFilled(part.id),
                'is-correct': judged && filledSlots[part.id] === currentQ.blanks.find(b => b.id === part.id)?.answer,
                'is-wrong': judged && filledSlots[part.id] !== currentQ.blanks.find(b => b.id === part.id)?.answer
              }"
              @click="removeFromSlot(part.id)"
            >
              {{ isSlotFilled(part.id) ? filledSlots[part.id] : '______' }}
            </span>
          </template>
        </div>

        <div v-if="judged" class="q-feedback" :class="fillResult">
          <template v-if="fillResult === 'correct'">✓ 正确！</template>
          <template v-else>
            ✗ 正确答案：
            <span v-for="b in currentQ.blanks" :key="b.id" class="correct-answer">{{ b.answer }}</span>
          </template>
        </div>

        <div v-if="!judged" class="word-bank">
          <button
            v-for="word in currentQ.wordBank"
            :key="word"
            class="word-tile"
            :class="{ 'is-used': isTileUsed(word) }"
            :disabled="isTileUsed(word)"
            @click="selectTile(word)"
          >{{ word }}</button>
        </div>

        <button v-if="!judged" class="btn-submit" :disabled="!allFilled" @click="submitFill">提交</button>
      </template>

      <!-- Judgment -->
      <template v-if="currentQ.type === 'judge'">
        <p class="q-label">判断下列说法是否正确</p>
        <div class="judgment-statement"><p>{{ currentQ.statement }}</p></div>
        <div v-if="!judged" class="judgment-buttons">
          <button class="btn-judge btn-true" @click="judge(true)">✓ 正确</button>
          <button class="btn-judge btn-false" @click="judge(false)">✗ 错误</button>
        </div>
        <div v-if="judged" class="q-feedback" :class="fillResult">
          {{ fillResult === 'correct' ? '✓ 判断正确！' : '✗ 判断错误！' }}
          <template v-if="fillResult !== 'correct'"><br>正确答案：{{ currentQ.answer ? '正确' : '错误' }}</template>
        </div>
      </template>

      <button v-if="judged" class="btn-next" @click="handleNext">
        {{ isLast ? '完成强化' : '下一题' }}
      </button>
    </div>

    <div class="round-progress">{{ currentIndex + 1 }} / {{ questions.length }}</div>
  </div>
</template>

<style scoped>
.reinforcement-round {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-6);
}
.question-card {
  width: 100%; max-width: 480px; background: var(--color-bg-card);
  border-radius: var(--radius-xl); box-shadow: var(--shadow-sm);
  padding: var(--space-6); display: flex; flex-direction: column;
  gap: var(--space-5); align-items: center;
}
.q-label { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500; }
.q-sentence {
  font-size: var(--text-base); color: var(--color-text); line-height: 2.4; text-align: center; width: 100%;
}
.q-blank {
  display: inline-block; min-width: 70px; padding: 2px var(--space-2);
  border-bottom: 2px dashed var(--color-border); margin: 0 2px;
  cursor: pointer; transition: all 0.15s; text-align: center;
  font-weight: 600; color: var(--color-primary); border-radius: 4px;
  background: var(--color-primary-light);
}
.q-blank.is-filled {
  border-bottom-style: solid; border-bottom-color: var(--color-primary);
}
.q-blank.is-correct { background: #e8f5e9; border-bottom-color: #4caf50; color: #2e7d32; }
.q-blank.is-wrong { background: #fde8e5; border-bottom-color: #e53935; color: #c62828; text-decoration: line-through; }

.word-bank { display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; }
.word-tile {
  padding: var(--space-2) var(--space-4); border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500;
  color: var(--color-text); background: var(--color-bg); cursor: pointer;
  transition: all 0.15s; min-height: 40px; user-select: none;
}
.word-tile:hover:not(:disabled) { border-color: var(--color-primary); background: var(--color-primary-light); }
.word-tile:active:not(:disabled) { transform: scale(0.96); }
.word-tile:disabled { opacity: 0.3; cursor: default; pointer-events: none; }

.judgment-statement {
  background: var(--color-bg-inset); border-radius: var(--radius-md);
  padding: var(--space-5); text-align: center; font-size: var(--text-base);
  color: var(--color-text); line-height: 1.8; width: 100%;
}
.judgment-buttons { display: flex; gap: var(--space-3); width: 100%; }
.btn-judge {
  flex: 1; padding: var(--space-4); border-radius: var(--radius-md);
  font-size: var(--text-base); font-weight: 700; cursor: pointer;
  transition: all 0.15s; min-height: 48px; user-select: none;
}
.btn-true { background: #e8f5e9; color: #2e7d32; border: 2px solid #4caf50; }
.btn-true:active { background: #c8e6c9; }
.btn-false { background: #fde8e5; color: #c62828; border: 2px solid #e53935; }
.btn-false:active { background: #ffcdd2; }

.btn-submit {
  padding: var(--space-3) var(--space-8); background: var(--color-primary);
  color: #fff; border-radius: var(--radius-lg); font-size: var(--text-base);
  font-weight: 600; cursor: pointer; min-height: 44px; transition: all 0.15s;
}
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-submit:not(:disabled):active { transform: scale(0.97); }

.btn-next {
  padding: var(--space-3) var(--space-8); background: var(--color-primary);
  color: #fff; border-radius: var(--radius-lg); font-size: var(--text-base);
  font-weight: 600; cursor: pointer; min-height: 44px; transition: all 0.15s;
}
.btn-next:active { transform: scale(0.97); }

.q-feedback {
  font-size: var(--text-sm); font-weight: 600; padding: var(--space-3);
  border-radius: var(--radius-md); text-align: center; width: 100%;
}
.q-feedback.correct { background: #e8f5e9; color: #2e7d32; }
.q-feedback.wrong { background: #fde8e5; color: #c62828; }
.correct-answer { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 1px 6px; border-radius: 4px; margin: 0 2px; font-weight: 700; }

.round-progress { font-size: var(--text-sm); color: var(--color-text-muted); }
</style>
