<script setup>
import { useRouter } from 'vue-router'
import { useStudySessionStore } from '../stores/studySession'
import { useDailyRecommend } from '../composables/useDailyRecommend'

const router = useRouter()
const sessionStore = useStudySessionStore()
const { recommendIds, hasRecommendation, description } = useDailyRecommend()

function startRecommended() {
  if (!hasRecommendation.value) return
  sessionStore.initSession(recommendIds.value.ids, 'recommend')
  router.push('/study')
}

function scrollToSteps() {
  document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' })
}

const heroPills = [
  { icon: '📖', text: '100首核心方剂' },
  { icon: '📂', text: '18大分类' },
  { icon: '🔄', text: '4步学习流程' },
  { icon: '🎯', text: '错题自动强化' }
]

const steps = [
  { num: 1, title: '记忆学习', desc: '翻转卡片，查看方歌、组成、功效、主治，建立第一印象' },
  { num: 2, title: '选择测试', desc: '通过选择题检验记忆，每首方剂出4道题全面覆盖' },
  { num: 3, title: '随机强化', desc: '打乱顺序重新测试，巩固薄弱环节，加深记忆深度' },
  { num: 4, title: '错题强化', desc: '重点攻克答错内容，循环训练直到掌握' }
]

const mockStats = [
  { label: '正确率', value: '82%', icon: '📊' },
  { label: '累计学习', value: '38 首', icon: '📚' },
  { label: '待复习错题', value: '6 首', icon: '🔍' },
  { label: '掌握率', value: '76%', icon: '✅' }
]

const audiences = [
  { icon: '🎓', title: '中医本科生', desc: '系统学习方剂学课程，打牢基础' },
  { icon: '📝', title: '中医考研党', desc: '高效复习，冲刺中医综合考试' },
  { icon: '🏥', title: '执业医师备考', desc: '针对性练习，顺利通过执业医师考试' }
]
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <!-- Floating decoration cards -->
      <div class="float float-left">
        <div class="float-card">
          <div class="float-title">麻黄汤</div>
          <div class="float-row">
            <span class="float-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>学习完成</span>
          </div>
          <div class="float-bar"><div class="float-bar-fill" style="width:82%"></div></div>
          <div class="float-meta">正确率 82%</div>
        </div>
      </div>

      <div class="hero-inner">
        <span class="hero-badge">中医方剂学</span>
        <h1 class="hero-title">方剂闪背</h1>
        <p class="hero-slogan">背方剂，不该只是死记硬背</p>
        <p class="hero-subtitle">用 AI 和记忆算法，帮助中医学生高效掌握核心方剂</p>
        <div class="hero-actions">
          <button class="btn btn-primary">免费体验</button>
          <router-link to="/study-setup" class="btn btn-outline">开始学习</router-link>
        </div>
        <div class="hero-pills">
          <span v-for="p in heroPills" :key="p.text" class="hero-pill">
            <span class="pill-icon">{{ p.icon }}</span> {{ p.text }}
          </span>
        </div>
      </div>

      <div class="float float-right">
        <div class="float-card float-card-accent">
          <div class="float-tag">错题强化</div>
          <div class="float-count">6</div>
          <div class="float-meta">今日待复习</div>
          <div class="float-btn-outline">开始复习</div>
        </div>
      </div>

      <div class="scroll-hint" @click="scrollToSteps">
        <span class="scroll-text">查看学习流程</span>
        <svg class="scroll-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </section>

    <!-- Daily Recommend + Deep Learning -->
    <section class="section recommend">
      <div class="modules-grid">
        <div v-if="hasRecommendation" class="recommend-card">
          <div class="recommend-header">
            <h2 class="recommend-title">今日推荐学习</h2>
            <span class="recommend-count">{{ recommendIds.ids.length }} 首方剂</span>
          </div>
          <p class="recommend-desc">{{ description }}</p>
          <button class="btn btn-primary" @click="startRecommended">一键开始学习</button>
        </div>

        <div class="recommend-card deep-card">
          <div class="recommend-header">
            <h2 class="recommend-title">深度学习模式</h2>
            <span class="recommend-count" style="background: var(--color-accent-light); color: var(--color-accent-dark);">理解证治</span>
          </div>
          <p class="recommend-desc">理解证治机理与配伍逻辑</p>
          <button class="btn btn-accent" @click="router.push('/study-setup?mode=deep')">进入深度学习</button>
        </div>
      </div>
    </section>

    <!-- A. 学习流程 -->
    <section id="steps-section" class="section">
      <h2 class="section-title">为什么方剂闪背更高效</h2>
      <p class="section-subtitle">科学四步学习法，从记忆到掌握的完整闭环</p>
      <div class="steps-grid">
        <div v-for="s in steps" :key="s.num" class="step-card">
          <div class="step-num">{{ s.num }}</div>
          <h3 class="step-title">{{ s.title }}</h3>
          <p class="step-desc">{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- B. 学习成果展示 -->
    <section class="section">
      <h2 class="section-title">学习效果一目了然</h2>
      <p class="section-subtitle">实时追踪你的学习进度和掌握情况</p>
      <div class="dashboard-grid">
        <div v-for="s in mockStats" :key="s.label" class="dash-card">
          <span class="dash-icon">{{ s.icon }}</span>
          <span class="dash-value">{{ s.value }}</span>
          <span class="dash-label">{{ s.label }}</span>
        </div>
      </div>
      <!-- Mini progress bar mock -->
      <div class="dashboard-preview">
        <div class="preview-bar">
          <div class="preview-fill"></div>
        </div>
        <div class="preview-label">
          <span>已掌握 76/100 首</span>
          <span>继续加油</span>
        </div>
      </div>
    </section>

    <!-- C. 适用人群 -->
    <section class="section">
      <h2 class="section-title">适合</h2>
      <p class="section-subtitle">无论你在哪个阶段，方剂闪背都能帮到你</p>
      <div class="audience-grid">
        <div v-for="a in audiences" :key="a.title" class="audience-card">
          <span class="audience-icon">{{ a.icon }}</span>
          <h3 class="audience-title">{{ a.title }}</h3>
          <p class="audience-desc">{{ a.desc }}</p>
        </div>
      </div>
    </section>

    <!-- D. 用户评价 -->
    <section class="section proof">
      <h2 class="section-title">用户评价</h2>
      <div class="quotes-grid">
        <div class="quote-card">
          <p class="quote-text">比自己整理笔记效率高很多</p>
          <span class="quote-author">-- 王同学，大三中医学</span>
        </div>
        <div class="quote-card">
          <p class="quote-text">考前冲刺复习效率提升明显</p>
          <span class="quote-author">-- 李同学，考研上岸</span>
        </div>
      </div>
      <p class="proof-summary">已帮助 100+ 学生提升学习效率</p>
    </section>

    <!-- E. 底部 CTA -->
    <section class="section cta-section">
      <div class="cta-card">
        <h2 class="cta-title">开始你的方剂高效记忆训练</h2>
        <p class="cta-sub">免费体验 100 首核心方剂</p>
        <router-link to="/study-setup" class="btn btn-primary btn-lg">立即开始学习</router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p class="footer-brand">方剂闪背 -- 为中医学生而做</p>
      <div class="footer-links">
        <span>关于我们</span>
        <span class="footer-divider">|</span>
        <span>使用帮助</span>
        <span class="footer-divider">|</span>
        <span>联系我们</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
}

/* ---------- Shared section ---------- */
.section {
  max-width: 1080px;
  margin: 0 auto;
  padding: var(--space-20) var(--space-6);
  width: 100%;
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--space-4);
  letter-spacing: var(--tracking-tight);
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--space-10);
}

/* ---------- Hero ---------- */
.hero {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
}

.hero-inner {
  text-align: center;
  max-width: 560px;
  position: relative;
  z-index: 1;
}

/* Floating decoration cards */
.float {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
}

.float-left { left: 5%; }
.float-right { right: 5%; }

.float-card {
  width: 180px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  padding: var(--space-5);
  opacity: 0.35;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.float-card-accent {
  border-left: 3px solid var(--color-danger);
}

.float-left .float-card {
  animation: floatSlow 8s ease-in-out infinite;
}

.float-right .float-card {
  animation: floatSlow 8s ease-in-out infinite 3s;
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.float-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.float-row {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.float-check {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-bar {
  height: 4px;
  background: var(--color-bg-inset);
  border-radius: 2px;
  overflow: hidden;
  margin: var(--space-1) 0;
}

.float-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}

.float-tag {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-danger);
  background: var(--color-danger-light);
  padding: 2px var(--space-2);
  border-radius: 999px;
  display: inline-block;
  width: fit-content;
}

.float-count {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.float-meta {
  font-size: 10px;
  color: var(--color-text-muted);
}

.float-btn-outline {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-1);
  text-align: center;
  margin-top: var(--space-1);
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  animation: scrollBounce 2s ease-in-out infinite;
}

.scroll-text {
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

.scroll-arrow {
  color: var(--color-text-muted);
}

@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

.hero-badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--space-1) var(--space-4);
  border-radius: 999px;
  margin-bottom: var(--space-6);
  letter-spacing: var(--tracking-wide);
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-4);
}

.hero-slogan {
  font-size: var(--text-xl);
  color: var(--color-text);
  font-weight: 500;
  margin-bottom: var(--space-3);
}

.hero-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-8);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

/* Hero pills */
.hero-pills {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  background: var(--color-bg-inset);
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
}

.pill-icon {
  font-size: 12px;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 36px;
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  border: 2px solid transparent;
  font-family: var(--font-sans);
}

.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-outline:hover { background: var(--color-primary-light); }

.btn-lg { padding: 16px 48px; font-size: var(--text-lg); }

/* ---------- Recommend ---------- */
.modules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  max-width: 800px;
  margin: 0 auto;
}

.recommend-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border-left: 4px solid var(--color-accent);
}

.deep-card {
  border-left-color: var(--color-accent-dark, #0f766e);
}

.btn-accent {
  padding: 10px 24px;
  background: var(--color-accent-dark, #0f766e);
  color: #fff;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-accent:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}

.recommend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.recommend-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.recommend-count {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 2px var(--space-3);
  border-radius: 999px;
}

.recommend-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-5);
}

/* ---------- A. Steps ---------- */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.step-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6) var(--space-5);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.step-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.step-num {
  width: 36px;
  height: 36px;
  margin: 0 auto var(--space-4);
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.step-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* ---------- B. Dashboard ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.dash-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-1);
}

.dash-icon {
  font-size: var(--text-xl);
  margin-bottom: var(--space-1);
}

.dash-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.dash-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.dashboard-preview {
  max-width: 480px;
  margin: 0 auto;
}

.preview-bar {
  height: 8px;
  background: var(--color-bg-inset);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.preview-fill {
  width: 76%;
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
}

.preview-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* ---------- C. Audience ---------- */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.audience-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.audience-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.audience-icon {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-3);
}

.audience-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.audience-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* ---------- D. Proof / Quotes ---------- */
.quotes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.quote-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8) var(--space-6);
  border-left: 3px solid var(--color-accent);
}

.quote-text {
  font-size: var(--text-base);
  font-style: italic;
  color: var(--color-text);
  line-height: 1.7;
  margin-bottom: var(--space-4);
}

.quote-author {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.proof-summary {
  text-align: center;
  font-size: var(--text-base);
  color: var(--color-accent);
  font-weight: 600;
}

/* ---------- E. Bottom CTA ---------- */
.cta-card {
  text-align: center;
  background: var(--color-primary-light);
  border-radius: var(--radius-xl);
  padding: var(--space-16) var(--space-8);
}

.cta-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.cta-sub {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

/* ---------- Footer ---------- */
.landing-footer {
  border-top: 1px solid var(--color-divider);
  padding: var(--space-8) var(--space-6);
  text-align: center;
}

.footer-brand {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.footer-links {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.footer-divider {
  margin: 0 var(--space-2);
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .hero-title { font-size: var(--text-4xl); }
  .hero-slogan { font-size: var(--text-lg); }
  .hero-actions { flex-direction: column; align-items: center; }
  .btn { width: 100%; max-width: 240px; }
  .hero-pills { gap: var(--space-2); }
  .float { display: none; }
  .scroll-hint { display: none; }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .audience-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .quotes-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: var(--space-8);
  }
}

@media (max-width: 480px) {
  .steps-grid { grid-template-columns: 1fr; max-width: 320px; margin: 0 auto; }
  .hero-pills { flex-direction: column; align-items: center; }
}
</style>
