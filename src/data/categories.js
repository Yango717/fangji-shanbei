import categoryList from './categories.json'

export const categories = categoryList.map(c => ({
  ...c,
  count: c.formulaIds.length
}))

export const categoryOrder = categoryList.map(c => c.name)
