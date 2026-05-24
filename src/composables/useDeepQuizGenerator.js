import { shuffle } from './shuffle.js'

// ---- Parsers: extract structured facts from markdown fields ----

function parseRoleTable(md) {
  const result = []
  const lines = md.split(/\r?\n/)
  let inTable = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (/^\|.*角色.*药物.*功用/.test(trimmed)) { inTable = true; continue }
    if (/^\|[\s\-:|]+\|$/.test(trimmed) && inTable) continue
    if (!trimmed.startsWith('|')) { if (inTable) break; else continue }
    if (!inTable) continue
    const cells = trimmed.split('|').filter(c => c.trim()).map(c => c.trim())
    if (cells.length < 3) continue
    const role = cells[0].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    const drug = cells[1].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    const func = cells[2].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim()
    if (role && drug) result.push({ role, drug, func })
  }
  return result
}

function parseCompatibilityItems(md) {
  const result = []
  const re = /^\d+\.\s+\*\*(.+?)\*\*[：:]\s*(.+)/gm
  let m
  while ((m = re.exec(md)) !== null) {
    const pair = m[1].trim()
    const desc = m[2].trim()
    // Extract relation keyword: 相须/相使/宣降/...
    let relation = ''
    if (pair.includes('＋') || pair.includes('+')) relation = 'drugPair'
    const relationMatch = desc.match(/相[须使畏杀恶反]|宣降|散收|升降|补泻|寒温/)
    if (relationMatch) relation = relationMatch[0]
    result.push({ pair, relation, desc })
  }
  return result
}

function isLabelTerm(t) {
  return /^(辨证要点|禁忌|禁忌证|注意事项|使用禁忌|服用注意|用法注意|注意|附方|鉴别|加减|原著加减|扩展运用|服法要点|【附方】|【鉴别】)$/.test(t)
      || /^与.+鉴别/.test(t)
      || /^【.+】$/.test(t)
}

function parseBoldTerms(md) {
  const result = []
  const re = /\*\*(.+?)\*\*/g
  let m
  while ((m = re.exec(md)) !== null) {
    const term = m[1].trim()
    if (term.length > 2 && term.length <= 20 && !term.includes('|') && !isLabelTerm(term)) {
      result.push(term)
    }
  }
  return [...new Set(result)]
}

// ---- Question generators ----

function makeRoleQuestions(formula, roles, allRoles) {
  const qs = []
  for (const r of roles) {
    // Q: X药在Y方中是？ → 君/臣/佐/使
    const distinctRoles = [...new Set(allRoles.map(x => x.role))].filter(Boolean)
    if (distinctRoles.length >= 2) {
      const opts = shuffle([r.role, ...distinctRoles.filter(x => x !== r.role).slice(0, 3)])
      qs.push({
        formulaId: formula.id, formulaName: formula.name,
        questionType: 'deep',
        questionText: `"${r.drug}"在${formula.name}中是？`,
        options: opts, correctIndex: opts.indexOf(r.role)
      })
    }
  }
  return qs
}

function makeDrugQuestions(formula, roles, allDrugs) {
  const qs = []
  const roleNames = ['君', '臣', '佐', '使']
  for (const rn of roleNames) {
    const match = roles.filter(r => r.role === rn)
    if (match.length === 0) continue
    const correct = match.map(r => r.drug).join('、')
    const wrong = shuffle(allDrugs.filter(d => !match.some(r => r.drug === d))).slice(0, 3)
    if (wrong.length < 3) continue
    const opts = shuffle([correct, ...wrong])
    qs.push({
      formulaId: formula.id, formulaName: formula.name,
      questionType: 'deep',
      questionText: `${formula.name}的${rn}药是？`,
      options: opts, correctIndex: opts.indexOf(correct)
    })
  }
  return qs
}

function makeFuncQuestions(formula, roles, allRoles) {
  const qs = []
  for (const r of roles) {
    if (!r.func || r.func.length < 5) continue
    const sameDrug = allRoles.filter(x => x.drug === r.drug && x.formulaId !== formula.id)
    const wrong = shuffle(sameDrug.map(x => x.func).filter(Boolean)).slice(0, 3)
    if (wrong.length < 3) {
      // Pad with random functions
      const others = shuffle(allRoles.filter(x => x.formulaId !== formula.id && x.func && x.func !== r.func))
      for (const o of others) {
        if (wrong.length >= 3) break
        if (!wrong.includes(o.func)) wrong.push(o.func)
      }
    }
    if (wrong.length < 3) continue
    const opts = shuffle([r.func, ...wrong.slice(0, 3)])
    qs.push({
      formulaId: formula.id, formulaName: formula.name,
      questionType: 'deep',
      questionText: `${formula.name}中"${r.drug}"（${r.role}药）的功用是？`,
      options: opts, correctIndex: opts.indexOf(r.func)
    })
  }
  return qs
}

function makePathogenesisQuestions(formula, terms, allTerms, allFormulaNames) {
  const qs = []
  const keyTerms = terms.filter(t => t.length >= 4 && t.length <= 20)
  const picked = shuffle(keyTerms).slice(0, 5)

  for (const term of picked) {
    // Type A: "X方证的病机关键是？" → options are key terms
    const otherTerms = shuffle(allTerms.filter(t => t !== term && t.length >= 4 && t.length <= 20)).slice(0, 3)
    if (otherTerms.length >= 3) {
      const opts = shuffle([term, ...otherTerms])
      qs.push({
        formulaId: formula.id, formulaName: formula.name,
        questionType: 'deep',
        questionText: `${formula.name}证的病机关键术语是？`,
        options: opts,
        correctIndex: opts.indexOf(term)
      })
    }

    // Type B: Reverse — "下列哪个方证的病机是[term]？" → options are formula names
    const otherNames = shuffle(allFormulaNames.filter(n => n !== formula.name)).slice(0, 3)
    if (otherNames.length >= 3) {
      const reverseOpts = shuffle([formula.name, ...otherNames])
      qs.push({
        formulaId: formula.id, formulaName: formula.name,
        questionType: 'deep',
        questionText: `"${term}"是下列哪个方证的病机关键？`,
        options: reverseOpts,
        correctIndex: reverseOpts.indexOf(formula.name)
      })
    }
  }
  return qs
}

function makeCompatibilityQuestions(formula, items, allItems) {
  const qs = []
  for (const item of items.slice(0, 3)) {
    // Q: "A+B"在X方中的配伍意义是？
    const wrong = shuffle(allItems.filter(x => x.pair !== item.pair)).slice(0, 3)
    if (wrong.length < 3) continue
    const opts = shuffle([item.desc, ...wrong.map(x => x.desc)])
    qs.push({
      formulaId: formula.id, formulaName: formula.name,
      questionType: 'deep',
      questionText: `"${item.pair}"在${formula.name}中的配伍意义是？`,
      options: opts, correctIndex: opts.indexOf(item.desc)
    })
  }
  return qs
}

function makeClinicalQuestions(formula, terms, allTerms) {
  const qs = []
  const critTerms = terms.filter(t => t.includes('要点') || t.includes('辨证') || t.includes('禁忌') || t.includes('注意'))
  for (const term of critTerms.slice(0, 2)) {
    const others = shuffle(allTerms.filter(t => t !== term && t.length >= 3 && t.length <= 20)).slice(0, 3)
    if (others.length < 3) continue
    const opts = shuffle([term, ...others])
    qs.push({
      formulaId: formula.id, formulaName: formula.name,
      questionType: 'deep',
      questionText: `${formula.name}临床运用的关键点是？`,
      options: opts,
      correctIndex: opts.indexOf(term)
    })
  }
  return qs
}

// ---- Main export ----

export function generateDeepQuestions(formulas, allFormulas) {
  // Pre-parse all formulas to build distractor pools
  const allData = allFormulas.map(f => ({
    formulaId: f.id,
    name: f.name,
    roles: parseRoleTable(f.deepLearning?.formulaExplanation || ''),
    compatItems: parseCompatibilityItems(f.deepLearning?.compatibility || ''),
    pathoTerms: parseBoldTerms(f.deepLearning?.pathogenesis || ''),
    clinicalTerms: parseBoldTerms(f.deepLearning?.clinicalApplication || '')
  }))

  // Build global distractor pools
  const allRoles = allData.flatMap(d => d.roles.map(r => ({ ...r, formulaId: d.formulaId })))
  const allDrugs = [...new Set(allRoles.map(r => r.drug))]
  const allPathoTerms = [...new Set(allData.flatMap(d => d.pathoTerms))]
  const allClinicalTerms = [...new Set(allData.flatMap(d => d.clinicalTerms))]
  const allCompatItems = allData.flatMap(d => d.compatItems.map(c => ({ ...c, formulaId: d.formulaId })))

  // Generate questions for selected formulas only
  const questions = []
  const selectedIds = new Set(formulas.map(f => f.id))
  for (const data of allData) {
    if (!selectedIds.has(data.formulaId)) continue
    const formula = formulas.find(f => f.id === data.formulaId)
    if (!formula) continue

    if (data.roles.length > 0) {
      questions.push(...makeRoleQuestions(formula, data.roles, allRoles))
      questions.push(...makeDrugQuestions(formula, data.roles, allDrugs))
      questions.push(...makeFuncQuestions(formula, data.roles, allRoles))
    }
    if (data.pathoTerms.length > 0) {
      const allFormulaNames = allFormulas.map(f => f.name)
      questions.push(...makePathogenesisQuestions(formula, data.pathoTerms, allPathoTerms, allFormulaNames))
    }
    if (data.compatItems.length > 0) {
      questions.push(...makeCompatibilityQuestions(formula, data.compatItems, allCompatItems))
    }
    if (data.clinicalTerms.length > 0) {
      questions.push(...makeClinicalQuestions(formula, data.clinicalTerms, allClinicalTerms))
    }
  }

  return shuffle(questions)
}
