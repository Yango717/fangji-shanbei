import formulas from './formulas.js'

const categoryOrder = [
  '解表剂', '泻下剂', '和解剂', '清热剂', '祛暑剂',
  '温里剂', '表里双解剂', '补益剂', '安神剂', '开窍剂',
  '固涩剂', '理气剂', '理血剂', '治风剂', '治燥剂',
  '祛湿剂', '消食剂', '祛痰剂'
]

export const categories = categoryOrder.map(name => {
  const categoryFormulas = formulas.filter(f => f.category === name)
  return {
    name,
    count: categoryFormulas.length,
    formulaIds: categoryFormulas.map(f => f.id)
  }
})
