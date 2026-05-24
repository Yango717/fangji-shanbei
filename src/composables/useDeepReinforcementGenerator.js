import { shuffle } from './shuffle.js'

// ---- Parsers ----

function parseRoleTable(md) {
  const result = []
  const lines = md.split(/\r?\n/)
  let inTable = false
  for (const line of lines) {
    const t = line.trim()
    if (/^\|.*角色.*药物.*功用/.test(t)) { inTable = true; continue }
    if (/^\|[\s\-:|]+\|$/.test(t) && inTable) continue
    if (!t.startsWith('|')) { if (inTable) break; else continue }
    if (!inTable) continue
    const cells = t.split('|').filter(c => c.trim()).map(c => c.trim())
    if (cells.length < 3) continue
    const role = cells[0].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    const drug = cells[1].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    const func = cells[2].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    if (role && drug) result.push({ role, drug, func })
  }
  return result
}

function isLabelTerm(t) {
  return /^(辨证要点|禁忌|禁忌证|注意事项|使用禁忌|服用注意|用法注意|注意|附方|鉴别|加减|原著加减|扩展运用|服法要点|【附方】|【鉴别】)$/.test(t)
      || /^与.+鉴别/.test(t)
      || /^【.+】$/.test(t)
}

function parseBoldTerms(md) {
  const terms = []
  const re = /\*\*(.+?)\*\*/g
  let m
  while ((m = re.exec(md)) !== null) {
    const t = m[1].trim()
    if (t.length >= 3 && t.length <= 22 && !t.includes('|') && !isLabelTerm(t)) terms.push(t)
  }
  return [...new Set(terms)]
}

// ---- Question generators ----

// Natural-sentence cloze templates
function makeClozeQuestions(data, allPools) {
  const qs = []
  const name = data.name

  // --- 方解：药物归属 ---
  for (const r of data.roles) {
    const wrongDrugs = shuffle(allPools.drugs.filter(d => d !== r.drug)).slice(0, 3)
    if (wrongDrugs.length < 3) continue
    qs.push({
      type: 'fill', formulaId: data.formulaId, formulaName: name,
      template: `${name}的组成中，${r.role}药是 ______`,
      blanks: [{ id: 'b0', answer: r.drug }],
      wordBank: shuffle([r.drug, ...wrongDrugs])
    })
  }

  // --- 方解：药物功效 ---
  const drugsWithFunc = data.roles.filter(r => r.func && r.func.length > 5)
  for (const r of shuffle(drugsWithFunc).slice(0, 2)) {
    const truncatedFunc = r.func.length > 30 ? r.func.substring(0, 30) + '…' : r.func
    const wrongFuncs = shuffle(allPools.funcs.filter(f => f !== r.func)).slice(0, 3)
    if (wrongFuncs.length < 3) continue
    qs.push({
      type: 'fill', formulaId: data.formulaId, formulaName: name,
      template: `${name}中，${r.role}药"${r.drug}"的功用是 ______`,
      blanks: [{ id: 'b0', answer: truncatedFunc }],
      wordBank: shuffle([truncatedFunc, ...wrongFuncs.map(f => f.length > 30 ? f.substring(0, 30) + '…' : f)])
    })
  }

  // --- 证治机理：病机关键词 ---
  const keyTerms = data.pathoTerms.filter(t => t.length >= 4 && t.length <= 22)
  for (const term of shuffle(keyTerms).slice(0, 2)) {
    const others = shuffle(allPools.pathoTerms.filter(t => t !== term && t.length >= 4 && t.length <= 22)).slice(0, 3)
    if (others.length < 3) continue
    qs.push({
      type: 'fill', formulaId: data.formulaId, formulaName: name,
      template: `${name}证的病机关键术语是 ______`,
      blanks: [{ id: 'b0', answer: term }],
      wordBank: shuffle([term, ...others])
    })
  }

  return qs
}

function makeJudgmentQuestions(data, allPools) {
  const qs = []
  const name = data.name

  if (data.roles.length > 0) {
    // Correct statement
    const r = data.roles[0]
    qs.push({
      type: 'judge', formulaId: data.formulaId, formulaName: name,
      statement: `${r.drug}在${name}中是${r.role}药`,
      answer: true
    })

    // Wrong: swap roles between two drugs
    if (data.roles.length >= 2) {
      const a = data.roles[0]
      const b = shuffle(data.roles.filter(r => r.drug !== a.drug))[0]
      if (b && a.role !== b.role) {
        qs.push({
          type: 'judge', formulaId: data.formulaId, formulaName: name,
          statement: `${a.drug}在${name}中是${b.role}药`,
          answer: false
        })
      }
    }

    // Wrong: foreign drug
    const foreignDrugs = shuffle(allPools.drugs.filter(d => !data.roles.some(r => r.drug === d)))
    if (foreignDrugs.length > 0) {
      qs.push({
        type: 'judge', formulaId: data.formulaId, formulaName: name,
        statement: `${foreignDrugs[0]}是${name}的组成药物`,
        answer: false
      })
    }
  }

  // Pathogenesis
  if (data.pathoTerms.length > 0) {
    const term = data.pathoTerms[0]
    qs.push({
      type: 'judge', formulaId: data.formulaId, formulaName: name,
      statement: `${name}证的病机是"${term}"`,
      answer: true
    })
    const wrong = shuffle(allPools.pathoTerms.filter(t => !data.pathoTerms.includes(t) && t.length >= 6 && t.length <= 18))[0]
    if (wrong) {
      qs.push({
        type: 'judge', formulaId: data.formulaId, formulaName: name,
        statement: `${name}证的病机是"${wrong}"`,
        answer: false
      })
    }
  }

  return qs
}

// ---- Main ----

export function generateReinforcementQuestions(formulas, allFormulas) {
  const allData = allFormulas.map(f => ({
    formulaId: f.id, name: f.name,
    roles: parseRoleTable(f.deepLearning?.formulaExplanation || ''),
    pathoTerms: parseBoldTerms(f.deepLearning?.pathogenesis || '')
  }))

  const allPools = {
    drugs: [...new Set(allData.flatMap(d => d.roles.map(r => r.drug)))],
    funcs: [...new Set(allData.flatMap(d => d.roles.map(r => r.func).filter(Boolean)))],
    pathoTerms: [...new Set(allData.flatMap(d => d.pathoTerms))]
  }

  const questions = []
  const selectedIds = new Set(formulas.map(f => f.id))

  for (const data of allData) {
    if (!selectedIds.has(data.formulaId)) continue

    if (data.roles.length > 0 || data.pathoTerms.length > 0) {
      questions.push(...makeClozeQuestions(data, allPools))
    }
    questions.push(...makeJudgmentQuestions(data, allPools))
  }

  return shuffle(questions)
}
