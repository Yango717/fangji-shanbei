/**
 * 解析方剂学方歌.md，替换 formulas.json 中的 mnemonic 字段
 * 用法: node scripts/replace-mnemonic.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const fanggePath = 'C:/Users/21109/Desktop/方剂学方歌.md'
const formulasPath = resolve(root, 'src/data/formulas.json')

// ---- Step 1: 解析方歌文件，构建 方名 → 方歌 映射 ----
const fanggeText = readFileSync(fanggePath, 'utf-8')
const lines = fanggeText.split('\n')

const fanggeMap = new Map()
let currentName = null
let currentLines = []

for (const line of lines) {
  // 匹配 ### 开头的方名
  const nameMatch = line.match(/^### (.+?) [★\*▲]/)
  if (nameMatch) {
    // 保存上一个方剂
    if (currentName && currentLines.length > 0) {
      fanggeMap.set(currentName, currentLines.join(''))
    }
    currentName = nameMatch[1].trim()
    currentLines = []
    continue
  }

  // 如果已经在一个方剂条目中，收集 > 开头的方歌行
  if (currentName && line.startsWith('> ')) {
    currentLines.push(line.slice(2))
  }

  // [教材原文] 或其他标记表示方歌结束
  if (currentName && currentLines.length > 0 && line.match(/^\[.+\]/) && !line.startsWith('>')) {
    fanggeMap.set(currentName, currentLines.join(''))
    currentName = null
    currentLines = []
  }
}
// 处理最后一个
if (currentName && currentLines.length > 0) {
  fanggeMap.set(currentName, currentLines.join(''))
}

console.log(`从方歌文件解析到 ${fanggeMap.size} 首方歌`)

// ---- Step 2: 读取 formulas.json ----
const formulas = JSON.parse(readFileSync(formulasPath, 'utf-8'))

// ---- Step 3: 按名称匹配替换 ----
// 名称映射：formulas.json 中的名称 → 方歌文件中的名称
const nameAlias = {
  '实脾散': '实脾饮',
  '麻杏石甘汤': '麻杏甘石汤',
}

let matched = 0
let unmatched = []

for (const f of formulas) {
  const lookupName = nameAlias[f.name] || f.name
  const fangge = fanggeMap.get(lookupName)
  if (fangge) {
    f.mnemonic = fangge
    matched++
  } else {
    unmatched.push(f.name)
  }
}

console.log(`匹配成功: ${matched}/${formulas.length}`)
if (unmatched.length > 0) {
  console.log('未匹配:', unmatched)
}

// ---- Step 4: 写入 ----
writeFileSync(formulasPath, JSON.stringify(formulas, null, 2) + '\n', 'utf-8')
console.log('formulas.json 已更新')
