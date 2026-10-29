<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'
import Icon from './Icon.vue'

const store = useDeviceStore()
const { t } = useI18n()

const busy = computed(() => store.status === 'connecting')

function connect(): void {
  void store.connect()
}

function demo(): void {
  void store.connectDemo()
}
</script>

<template>
  <section class="connect-card card" aria-labelledby="connect-heading">
    <div class="connect-card__intro">
      <div class="connect-card__kicker">
        <Icon name="usb" :size="15" />
        <span>{{ t('app.kicker') }}</span>
      </div>
      <h1 id="connect-heading" class="connect-card__title">{{ t('home.title') }}</h1>
      <p class="connect-card__body">{{ t('home.body') }}</p>
      <div class="connect-card__facts">
        <span>
          <Icon name="lock" :size="14" />
          {{ t('home.private') }}
        </span>
        <span>
          <Icon name="monitor" :size="14" />
          {{ t('home.offline') }}
        </span>
      </div>
    </div>

    <div v-if="!store.isSupported" class="compat-note" role="status">
      <span class="compat-note__icon" aria-hidden="true">
        <Icon name="alert" :size="18" />
      </span>
      <div>
        <strong>{{ t('unsupported.title') }}</strong>
        <p>{{ t('unsupported.body') }}</p>
      </div>
    </div>

    <ol class="steps" :aria-label="t('how.title')">
      <li class="step">
        <span class="step__index" :aria-label="t('a11y.step', { index: 1 })">1</span>
        <div class="step__content">
          <h2 class="step__title">{{ t('how.step1.title') }}</h2>
          <p class="step__desc">{{ t('how.step1.desc') }}</p>
          <p class="step__tip">{{ t('how.step1.portTip') }}</p>
          <RouterLink to="/models" class="step__link">
            {{ t('connect.supported') }}
            <Icon name="arrow-right" :size="13" />
          </RouterLink>
          <p class="step__tip">{{ t('how.step1.cableTip') }}</p>
        </div>
      </li>

      <li class="step">
        <span class="step__index" :aria-label="t('a11y.step', { index: 2 })">2</span>
        <div class="step__content">
          <h2 class="step__title">{{ t('how.step2.title') }}</h2>
          <p class="step__desc">{{ t('how.step2.desc') }}</p>
        </div>
      </li>

      <li class="step">
        <span class="step__index" :aria-label="t('a11y.step', { index: 3 })">3</span>
        <div class="step__content">
          <h2 class="step__title">{{ t('how.step3.title') }}</h2>
          <p class="step__desc">{{ t('how.step3.desc') }}</p>
          <p class="step__tip">{{ t('how.step3.tip') }}</p>
        </div>
      </li>
    </ol>

    <div class="connect-card__actions">
      <button
        v-if="store.isSupported"
        type="button"
        class="btn btn--primary connect-card__primary"
        :disabled="busy"
        @click="connect"
      >
        <span v-if="busy" class="spinner" aria-hidden="true"></span>
        <Icon v-else name="usb" :size="19" />
        {{ busy ? t('connect.connecting') : t('connect.button') }}
      </button>

      <button type="button" class="btn btn--ghost" :disabled="busy" @click="demo">
        <Icon name="activity" :size="18" />
        {{ t('connect.demo') }}
      </button>
    </div>

    <p class="connect-card__footnote">
      <span>{{ t('home.demoLabel') }}</span>
      <span class="connect-card__dot" aria-hidden="true">·</span>
      <span>{{ t('home.supportHint') }}</span>
    </p>
  </section>
</template>

<style scoped>
.connect-card {
  display: flex;
  flex-direction: column;
  padding: var(--card-pad);
}

.connect-card > * {
  width: 100%;
  max-width: 680px;
  margin-right: auto;
  margin-left: auto;
}

.connect-card__intro {
  display: flex;
  flex-direction: column;
}

.connect-card__kicker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--color-brand-strong);
  font-size: 0.73rem;
  font-weight: 620;
  letter-spacing: 0.02em;
}

.connect-card__title {
  margin-top: 18px;
  font-size: clamp(2rem, 3.4vw, 2.85rem);
  font-weight: 640;
  line-height: 1.08;
  letter-spacing: -0.04em;
  text-align: center;
  text-wrap: balance;
}

.connect-card__body {
  max-width: 48ch;
  margin: 14px auto 0;
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.65;
  text-align: center;
}

.connect-card__facts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  margin-top: 18px;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.connect-card__facts span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.connect-card__facts svg {
  color: var(--color-faint);
}

.compat-note {
  display: flex;
  gap: 11px;
  margin-top: 22px;
  padding: 14px;
  border: 1px solid var(--color-warning-line);
  border-radius: var(--radius-sm);
  background: var(--color-warning-soft);
}

.compat-note__icon {
  flex: 0 0 auto;
  color: var(--color-warning);
}

.compat-note strong {
  display: block;
  color: var(--color-warning-ink);
  font-size: 0.82rem;
  font-weight: 650;
}

.compat-note p {
  margin-top: 3px;
  color: var(--color-warning-ink);
  font-size: 0.76rem;
  line-height: 1.55;
}

.connect-card > .steps {
  max-width: 680px;
}

.steps {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
  padding-left: 2px;
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 13px;
}

.step:not(:last-child)::before {
  position: absolute;
  top: 32px;
  bottom: -20px;
  left: 13px;
  width: 1px;
  background: var(--color-line);
  content: '';
}

.step__index {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--color-line);
  border-radius: 50%;
  color: var(--color-muted);
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
}

.step__content {
  min-width: 0;
}

.step__title {
  margin-top: 3px;
  font-size: 0.86rem;
  font-weight: 650;
}

.step__desc {
  margin-top: 4px;
  color: var(--color-ink-soft);
  font-size: 0.84rem;
  line-height: 1.55;
}

.step__tip {
  margin-top: 5px;
  color: var(--color-faint);
  font-size: 0.72rem;
  line-height: 1.5;
}

.step__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: var(--color-brand-strong);
  font-size: 0.74rem;
  font-weight: 550;
}

.step__link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.connect-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 32px;
}

.connect-card__primary {
  max-width: 320px;
  flex: 1 1 160px;
}

.connect-card__footnote {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 18px;
  color: var(--color-faint);
  font-size: 0.7rem;
}

.connect-card__dot {
  color: var(--color-line-strong);
}

@media (max-width: 980px) {
  .connect-card__actions {
    margin-top: 26px;
  }
}

@media (max-width: 540px) {
  .connect-card {
    padding: 22px 20px;
  }

  .connect-card__title {
    font-size: clamp(1.5rem, 8vw, 2rem);
  }
}
</style>
