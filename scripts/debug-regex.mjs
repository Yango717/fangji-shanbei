import { readFileSync } from 'fs'

const text = readFileSync('C:/Users/21109/Desktop/方剂学详解_上_第1至9章.md', 'utf-8')

// Extract 麻黄汤 section
const start = text.indexOf('### 1. 麻黄汤')
const end = text.indexOf('### 2. 桂枝汤')
const content = text.substring(start, end)

// Test card extraction
const cardLabels = ['条文', '证治机理', '君臣佐使', '配伍意义', '临床运用']
for (const label of cardLabels) {
  const cardRegex = new RegExp(`### 卡片[\\d一二三四五]+[：:：]\\s*${label}\\s*\\n\\n([\\s\\S]*?)(?=### 卡片|### \\d+\\.|---$|$)`, 'm')
  const match = content.match(cardRegex)
  if (match) {
    console.log('--- ' + label + ' (' + match[1].length + ' chars) ---')
    console.log(match[1].substring(0, 200))
    console.log('...')
  } else {
    console.log('--- ' + label + ' NO MATCH ---')
  }
}

// Also test: is the card header even found?
console.log('\n--- Card headers in content ---')
const headers = content.match(/卡片[一二三四五\d]+[：:]/g)
console.log(headers)
