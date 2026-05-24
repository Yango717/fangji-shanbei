/**
 * 解析方剂学详解 Markdown，导入 deepLearning 字段到 formulas.json
 * 用法: node scripts/import-deep-learning.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const files = [
  'C:/Users/21109/Desktop/方剂学详解_上_第1至9章.md',
  'C:/Users/21109/Desktop/方剂学详解_下_第10至20章.md'
]

const cardKeyMap = {
  '条文': 'article',
  '证治机理': 'pathogenesis',
  '君臣佐使': 'formulaExplanation',
  '配伍意义': 'compatibility',
  '临床运用': 'clinicalApplication'
}

// ---- Step 1: Parse all formulas from both files ----
const fanggeMap = new Map()

for (const filePath of files) {
  const text = readFileSync(filePath, 'utf-8')
  // Split by formula sections: ### N. FormulaName
  const sections = text.split(/^### (\d+)\. (.+)$/gm)

  // Process matches
  const matches = [...text.matchAll(/^### (\d+)\. (.+)$/gm)]
  for (let i = 0; i < matches.length; i++) {
    let name = matches[i][2].trim()
    // Strip parenthetical annotations: 越鞠丸（又名芎术丸）→ 越鞠丸
    name = name.replace(/[（(][^)）]*[)）]/g, '').trim()
    const start = matches[i].index + matches[i][0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length
    const content = text.slice(start, end)

    // Parse card sections within this formula
    const data = {}
    for (const [cardLabel, fieldKey] of Object.entries(cardKeyMap)) {
      const cardRegex = new RegExp(`### 卡片[\\d一二三四五]+[：:：]\\s*${cardLabel}\\s*\\n\\n([\\s\\S]*?)(?=\\n### 卡片|\\n### \\d+\\.|---\\s*$)`, 'm')
      const cardMatch = content.match(cardRegex)
      if (cardMatch) {
        let cardContent = cardMatch[1].trim()
        // Remove trailing --- if present
        cardContent = cardContent.replace(/\n---\s*$/, '').trim()
        if (cardContent && cardContent !== '无') {
          data[fieldKey] = cardContent
        }
      }
    }
    fanggeMap.set(name, data)
  }
}

console.log(`从 Markdown 解析到 ${fanggeMap.size} 首方剂`)

// ---- Step 2: Read formulas.json ----
const formulasPath = resolve(root, 'src/data/formulas.json')
const formulas = JSON.parse(readFileSync(formulasPath, 'utf-8'))

// ---- Step 3: Match and update ----
// 名称映射
const nameAlias = {
  '麻杏石甘汤': '麻杏甘石汤',
  '瓜蒌薤白白酒汤': '栝楼薤白白酒汤',
}

let matched = 0
let unmatched = []
let fieldsFilled = { article: 0, pathogenesis: 0, formulaExplanation: 0, compatibility: 0, clinicalApplication: 0 }

for (const f of formulas) {
  const lookupName = nameAlias[f.name] || f.name
  const data = fanggeMap.get(lookupName)

  if (data) {
    for (const [key, content] of Object.entries(data)) {
      f.deepLearning[key] = content
      fieldsFilled[key] = (fieldsFilled[key] || 0) + 1
    }
    matched++
  } else {
    unmatched.push(f.name)
  }
}

console.log(`匹配成功: ${matched}/${formulas.length}`)
if (unmatched.length > 0) {
  console.log('未匹配:', unmatched)
}

console.log('各字段填充数:', fieldsFilled)

// ---- Step 4: Write ----
writeFileSync(formulasPath, JSON.stringify(formulas, null, 2) + '\n', 'utf-8')
console.log('formulas.json 已更新')
