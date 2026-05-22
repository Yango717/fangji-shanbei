import { shuffle } from './shuffle'

const questionTypes = ['mnemonic', 'composition', 'efficacy', 'indications']

const questionLabels = {
  mnemonic: '方歌',
  composition: '组成',
  efficacy: '功效',
  indications: '主治'
}

function getField(formula, type) {
  switch (type) {
    case 'mnemonic': return formula.mnemonic
    case 'composition': return formula.composition
    case 'efficacy': return formula.efficacy
    case 'indications': return formula.indications
  }
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
    if (text !== correctText) {
      distractors.push(text)
    }
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

export function generateQuestion(formula, allFormulas) {
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
  return makeQuestion(formula, type, allFormulas)
}

export function generateQuestions(formulas, allFormulas) {
  // Each formula gets all 4 question types (方歌、组成、功效、主治)
  const questions = []
  for (const f of formulas) {
    for (const type of questionTypes) {
      questions.push(makeQuestion(f, type, allFormulas))
    }
  }
  return shuffle(questions)
}
