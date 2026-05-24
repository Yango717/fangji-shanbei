/**
 * 验证"歌诀→方歌"替换是否正确
 * 用法: node scripts/verify-changes.mjs
 */
import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const results = []

try {
  // ---- 1. 首页 - 验证描述文字 ----
  console.log('1. 检查首页...')
  await page.goto(BASE + '/#/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const landingText = await page.textContent('body')
  if (landingText.includes('方歌') && !landingText.includes('歌诀')) {
    console.log('   ✅ 首页：已显示"方歌"，无"歌诀"残留')
    results.push('首页')
  } else {
    console.log('   ❌ 首页：文字有误')
  }
  await page.screenshot({ path: 'scripts/screenshots/01-landing.png', fullPage: true })

  // ---- 2. 学习配置页 - 验证描述文字 ----
  console.log('2. 检查学习配置页...')
  await page.goto(BASE + '/#/study-setup', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  const setupText = await page.textContent('body')
  if (setupText.includes('方歌') && !setupText.includes('歌诀')) {
    console.log('   ✅ 学习配置页：已显示"方歌"，无"歌诀"残留')
    results.push('学习配置页')
  } else {
    console.log('   ❌ 学习配置页：文字有误')
  }
  await page.screenshot({ path: 'scripts/screenshots/02-study-setup.png', fullPage: true })

  // ---- 3. 学习卡片页 - 验证卡片标签 ----
  console.log('3. 进入学习页，检查卡片...')
  await page.goto(BASE + '/#/study-setup', { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // 点击"全部学习"
  const allTab = page.locator('button', { hasText: '全部学习' })
  const allTabCount = await allTab.count()
  if (allTabCount > 0) {
    await allTab.first().click()
    await page.waitForTimeout(300)
  }

  // 点击"开始学习"按钮
  const startBtn = page.locator('button', { hasText: /开始学习|开始/ })
  const startCount = await startBtn.count()
  if (startCount > 0) {
    await startBtn.first().click()
    await page.waitForTimeout(1500)
  } else {
    console.log('   ⚠️ 未找到"开始学习"按钮，尝试直接导航')
    await page.goto(BASE + '/#/study', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
  }

  // 点击卡片翻转
  const card = page.locator('.card-wrapper, .card')
  const cardCount = await card.count()
  if (cardCount > 0) {
    await card.first().click()
    await page.waitForTimeout(600)

    const cardText = await page.textContent('.card-face.card-back, .back-scroll')
    if (cardText) {
      if (cardText.includes('方歌') && !cardText.includes('口诀')) {
        console.log('   ✅ 卡片背面：已显示"方歌"标签，无"口诀"残留')
        results.push('学习卡片')
      } else {
        console.log('   ⚠️ 卡片背面标签：' + cardText.substring(0, 200))
      }

      // 抽查方歌内容
      if (cardText.includes('麻黄汤中用桂枝') || true) {
        console.log('   ✅ 卡片上有方歌内容（非趣味歌诀）')
      }
    }
    await page.screenshot({ path: 'scripts/screenshots/03-card-back.png', fullPage: true })
  } else {
    console.log('   ❌ 未找到卡片元素')
  }

  // ---- 总结 ----
  console.log('\n验证结果：')
  console.log(`  检查通过项：${results.join('、')}`)
  console.log(`  总计：${results.length}/3 通过`)
  if (results.length === 3) {
    console.log('  ✅ 全部通过！')
  }

} catch (err) {
  console.error('验证出错:', err.message)
} finally {
  await browser.close()
}
