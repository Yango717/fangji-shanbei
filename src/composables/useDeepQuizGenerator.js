import { shuffle } from './shuffle'

const questionTypes = ['pathogenesis', 'hierarchy', 'compatibility']

const questionLabels = {
  pathogenesis: '证治机理',
  hierarchy: '君臣佐使',
  compatibility: '配伍意义'
}

function getField(formula, type) {
  return formula.deepLearning?.[type] || ''
}

function pickDistractors(correct, type, allFormulas) {
  const candidates = allFormulas.filter(f => f.id !== correct.id)
  const correctText = getField(correct, type)

  const sameCategory = candidates.filter(f => f.category === correct.category)
  const otherCategory = candidates.filter(f => f.category !== correct.category)

  const shuffledSame = shuffle([...sameCategory])
  const shuffledOther = shuffle([...otherCategory])

  const pool = [...shuffledSame, ...shuffledOther]

  const distractors = []
  for (const f of pool) {
    if (distractors.length >= 3) break
    const text = getField(f, type)
    if (text && text !== correctText) {
      distractors.push(text)
    }
  }

  // Pad if not enough distractors (e.g. placeholder content is identical)
  while (distractors.length < 3) {
    distractors.push(`选项${distractors.length + 1}`)
  }

  return distractors
}

function makeQuestion(formula, type, allFormulas) {
  const correctAnswer = getField(formula, type)
  const distractors = pickDistractors(formula, type, allFormulas)

  const options = shuffle([correctAnswer, ...distractors])
  const correctIndex = options.indexOf(correctAnswer)

  return {
    formulaId: formula.id,
    formulaName: formula.name,
    questionType: type,
    questionText: `${formula.name}的${questionLabels[type]}是？`,
    options,
    correctIndex
  }
}

export function generateDeepQuestions(formulas, allFormulas) {
  const questions = []
  for (const f of formulas) {
    for (const type of questionTypes) {
      questions.push(makeQuestion(f, type, allFormulas))
    }
  }
  return shuffle(questions)
}
