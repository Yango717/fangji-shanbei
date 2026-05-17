<template>
  <div class="pricing-page">
    <header class="pricing-header">
      <h1 class="pricing-title">选择方案</h1>
      <p class="pricing-subtitle">开始你的方剂记忆之旅</p>
    </header>

    <div class="pricing-grid">
      <!-- Free -->
      <div class="pricing-card">
        <span class="plan-name">免费版</span>
        <div class="plan-price">
          <span class="price-amount">免费</span>
        </div>
        <ul class="plan-features">
          <li><span class="check">✓</span> 20 首体验方剂</li>
          <li><span class="check">✓</span> 翻转卡片学习</li>
          <li><span class="check">✓</span> 错题追踪</li>
          <li><span class="check">✓</span> 学习进度统计</li>
        </ul>
        <router-link to="/learn" class="plan-btn plan-btn-secondary">开始体验</router-link>
      </div>

      <!-- Pro -->
      <div class="pricing-card pricing-card-featured">
        <span class="plan-badge">推荐</span>
        <span class="plan-name">Pro版</span>
        <div class="plan-price">
          <span class="price-currency">¥</span>
          <span class="price-amount">29.9</span>
          <span class="price-period">/永久</span>
        </div>
        <p class="plan-tagline">推荐给认真备考的中医学生</p>
        <ul class="plan-features">
          <li><span class="check">✓</span> 100 首核心方剂全部解锁</li>
          <li><span class="check">✓</span> 包含免费版全部功能</li>
          <li><span class="check">✓</span> 分类筛选学习</li>
          <li><span class="check">✓</span> 间隔重复算法</li>
          <li><span class="check">✓</span> 学习数据导出</li>
        </ul>
        <button class="plan-btn plan-btn-primary">即将推出</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
  min-height: calc(100vh - 56px);
}

.pricing-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.pricing-title {
  font-size: var(--text-3xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.pricing-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  max-width: 640px;
  margin: 0 auto;
}

.pricing-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  position: relative;
}

.pricing-card-featured {
  border: 2px solid var(--color-primary);
}

.plan-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--space-1) var(--space-4);
  border-radius: 999px;
}

.plan-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.plan-price {
  margin-bottom: var(--space-6);
}

.price-amount {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text);
}

.price-currency {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-secondary);
  vertical-align: top;
}

.price-period {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.plan-tagline {
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: var(--space-4);
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
  flex: 1;
}

.plan-features li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.check {
  color: var(--color-primary);
  font-weight: 600;
}

.plan-btn {
  display: block;
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s;
}

.plan-btn-primary {
  background: var(--color-primary);
  color: #fff;
}
.plan-btn-primary:hover { background: var(--color-primary-hover); }

.plan-btn-secondary {
  background: var(--color-bg-inset);
  color: var(--color-text);
}
.plan-btn-secondary:hover { background: var(--color-border); color: var(--color-text); }

@media (max-width: 640px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 360px;
  }
}
</style>
