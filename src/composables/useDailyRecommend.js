import { computed } from 'vue'
import { useFormulaStore } from '../stores/formula'
import { useErrorBookStore } from '../stores/errorBook'
import { shuffle } from './shuffle'

export function useDailyRecommend() {
  const formulaStore = useFormulaStore()
  const errorStore = useErrorBookStore()

  const recommendIds = computed(() => {
    const result = new Set()
    const reasons = { errors: 0, unmastered: 0, fresh: 0 }
    const target = 10

    // Priority 1: High-frequency errors (count >= 2)
    const highErrors = errorStore.sortedErrors
      .filter(e => e.count >= 2)
      .map(e => e.id)
    for (const id of highErrors) {
      if (result.size >= target) break
      result.add(id)
      reasons.errors++
    }

    // Priority 2: Unmastered (status = unknown/vague from yesterday)
    const unmastered = formulaStore.allFormulas
      .filter(f => {
        const p = formulaStore.progress[f.id]
        return p && (p.status === 'unknown' || p.status === 'vague')
      })
      .map(f => f.id)
    for (const id of unmastered) {
      if (result.size >= target) break
      result.add(id)
      reasons.unmastered++
    }

    // Priority 3: Fresh formulas (no progress yet)
    const fresh = shuffle(
      formulaStore.allFormulas
        .filter(f => !formulaStore.progress[f.id])
        .map(f => f.id)
    )
    for (const id of fresh) {
      if (result.size >= target) break
      result.add(id)
      reasons.fresh++
    }

    return { ids: [...result], reasons }
  })

  const hasRecommendation = computed(() => recommendIds.value.ids.length > 0)

  const description = computed(() => {
    const r = recommendIds.value.reasons
    const parts = []
    if (r.errors > 0) parts.push(`${r.errors} 首高频错题`)
    if (r.unmastered > 0) parts.push(`${r.unmastered} 首未掌握`)
    if (r.fresh > 0) parts.push(`${r.fresh} 首新方剂`)
    return parts.join('、')
  })

  return { recommendIds, hasRecommendation, description }
}
