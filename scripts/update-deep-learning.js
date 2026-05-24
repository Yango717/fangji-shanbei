/**
 * 替换 formulas.json 中 deepLearning 字段结构：3字段 → 5字段
 * 用法: node scripts/update-deep-learning.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const formulasPath = resolve(root, 'src/data/formulas.json')

const formulas = JSON.parse(readFileSync(formulasPath, 'utf-8'))

const newDeepLearning = {
  article: '待补充',
  pathogenesis: '待补充',
  formulaExplanation: '待补充',
  compatibility: '待补充',
  clinicalApplication: '待补充'
}

let count = 0
for (const f of formulas) {
  // 保留旧的 pathogenesis 和 compatibility 值（如果非"待补充"）
  const old = f.deepLearning || {}
  f.deepLearning = {
    article: old.article || '待补充',
    pathogenesis: old.pathogenesis || '待补充',
    formulaExplanation: old.formulaExplanation || old.hierarchy || '待补充',
    compatibility: old.compatibility || '待补充',
    clinicalApplication: old.clinicalApplication || '待补充'
  }
  count++
}

writeFileSync(formulasPath, JSON.stringify(formulas, null, 2) + '\n', 'utf-8')
console.log(`已更新 ${count} 首方剂的 deepLearning 结构`)
