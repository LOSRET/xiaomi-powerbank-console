<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import Icon from '@/components/Icon.vue'

const { t } = useI18n()
</script>

<template>
  <div class="guide-page page-shell">
    <div class="page-intro">
      <RouterLink to="/" class="back-link">
        <Icon name="arrow-left" :size="15" />
        {{ t('guide.back') }}
      </RouterLink>
      <h1>{{ t('guide.title') }}</h1>
    </div>

    <div class="guide-layout">
      <article class="guide-article card">
        <section class="guide-section">
          <h2>{{ t('guide.introTitle') }}</h2>
          <p>{{ t('guide.introBody') }}</p>
        </section>

        <section class="guide-section">
          <h2>{{ t('guide.handlingTitle') }}</h2>

          <div class="guide-topic">
            <h3>{{ t('guide.chargeHighTempTitle') }}</h3>
            <p>{{ t('guide.chargeHighTempBody') }}</p>
          </div>

          <div class="guide-topic">
            <h3>{{ t('guide.dischargeHighTempTitle') }}</h3>
            <p>{{ t('guide.dischargeHighTempBody') }}</p>
          </div>

          <div class="guide-topic">
            <h3>{{ t('guide.overvoltageTitle') }}</h3>
            <p>{{ t('guide.overvoltageBody') }}</p>
          </div>
        </section>

        <div class="guide-warning">
          <span class="guide-warning__icon" aria-hidden="true">
            <Icon name="alert" :size="19" />
          </span>
          <p>{{ t('guide.warmTips') }}</p>
        </div>
      </article>

      <aside class="guide-side">
        <section class="guide-side__card card">
          <span class="guide-side__icon" aria-hidden="true">
            <Icon name="shield" :size="20" />
          </span>
          <h2>{{ t('guide.sideTitle') }}</h2>
          <p>{{ t('guide.sideBody') }}</p>
        </section>

        <section class="guide-side__card card">
          <h2>{{ t('guide.relatedTitle') }}</h2>
          <div class="guide-side__links">
            <RouterLink to="/" class="guide-side__link">
              <span>{{ t('guide.deviceLink') }}</span>
              <Icon name="arrow-right" :size="14" />
            </RouterLink>
            <RouterLink to="/models" class="guide-side__link">
              <span>{{ t('guide.relatedModels') }}</span>
              <Icon name="arrow-right" :size="14" />
            </RouterLink>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.guide-page {
  padding-top: clamp(26px, 4vw, 48px);
}

.page-intro {
  max-width: 760px;
  margin-bottom: 26px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 24px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 550;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-brand-strong);
}

.page-intro h1 {
  max-width: 18ch;
  margin-top: 10px;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 640;
  letter-spacing: -0.05em;
}

.guide-layout {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.62fr);
  gap: clamp(16px, 2.4vw, 26px);
}

.guide-article {
  padding: clamp(24px, 4vw, 46px);
}

.guide-section + .guide-section {
  margin-top: 38px;
  padding-top: 32px;
  border-top: 1px solid var(--color-line);
}

.guide-section h2 {
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  font-weight: 630;
}

.guide-section > p {
  max-width: 68ch;
  margin-top: 14px;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.75;
}

.guide-topic {
  margin-top: 26px;
}

.guide-topic h3 {
  font-size: 0.93rem;
  font-weight: 620;
}

.guide-topic p {
  max-width: 64ch;
  margin-top: 7px;
  color: var(--color-muted);
  font-size: 0.86rem;
  line-height: 1.7;
}

.guide-warning {
  display: flex;
  gap: 12px;
  margin-top: 38px;
  padding: 16px;
  border: 1px solid #f5dcb6;
  border-radius: var(--radius-sm);
  background: var(--color-warning-soft);
}

.guide-warning__icon {
  flex: 0 0 auto;
  color: var(--color-warning);
}

.guide-warning p {
  color: #7c5a1d;
  font-size: 0.8rem;
  line-height: 1.65;
}

.guide-side {
  display: flex;
  position: sticky;
  top: 110px;
  flex-direction: column;
  gap: 14px;
}

.guide-side__card {
  padding: 22px;
}

.guide-side__icon {
  display: grid;
  width: 40px;
  height: 40px;
  margin-bottom: 14px;
  place-items: center;
  border-radius: 12px;
  color: var(--color-success);
  background: var(--color-success-soft);
}

.guide-side__card h2 {
  font-size: 0.9rem;
  font-weight: 630;
}

.guide-side__card p {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 0.79rem;
  line-height: 1.65;
}

.guide-side__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
}

.guide-side__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-ink-soft);
  font-size: 0.78rem;
  transition: color var(--transition-fast);
}

.guide-side__link:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.guide-side__link:hover {
  color: var(--color-brand-strong);
}

@media (max-width: 900px) {
  .guide-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .guide-side {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .guide-side {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
