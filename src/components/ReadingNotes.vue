<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'
import Icon from './Icon.vue'

const store = useDeviceStore()
const { t } = useI18n()
</script>

<template>
  <section class="reading-notes card">
    <h2>{{ t('notes.title') }}</h2>
    <div class="reading-notes__list">
      <div class="reading-notes__item">
        <span class="reading-notes__icon" aria-hidden="true">
          <Icon name="shield" :size="15" />
        </span>
        <div>
          <h3>{{ t('notes.healthTitle') }}</h3>
          <p>{{ t('notes.healthBody') }}</p>
        </div>
      </div>
      <div class="reading-notes__item">
        <span class="reading-notes__icon" aria-hidden="true">
          <Icon name="refresh" :size="15" />
        </span>
        <div>
          <h3>{{ t('notes.cyclesTitle') }}</h3>
          <p>{{ t('notes.cyclesBody') }}</p>
        </div>
      </div>
      <div class="reading-notes__item">
        <span class="reading-notes__icon" aria-hidden="true">
          <Icon name="thermometer" :size="15" />
        </span>
        <div>
          <h3>{{ t('notes.temperatureTitle') }}</h3>
          <p>{{ t('notes.temperatureBody', { range: store.temperatureRange }) }}</p>
        </div>
      </div>
    </div>
    <RouterLink to="/exception-guide" class="reading-notes__link">
      {{ t('home.openGuide') }}
      <Icon name="arrow-right" :size="13" />
    </RouterLink>
  </section>
</template>

<style scoped>
.reading-notes {
  padding: var(--card-pad);
}

.reading-notes h2 {
  font-size: 0.9rem;
  font-weight: 640;
}

.reading-notes__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px clamp(18px, 2.5vw, 28px);
  margin-top: 16px;
}

.reading-notes__item {
  display: flex;
  gap: 10px;
}

.reading-notes__icon {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  border-radius: 8px;
  color: var(--color-brand-strong);
  background: var(--color-brand-soft);
}

.reading-notes__item:nth-child(2) .reading-notes__icon {
  color: var(--color-energy);
  background: var(--color-energy-soft);
}

.reading-notes__item:nth-child(3) .reading-notes__icon {
  color: var(--color-warning);
  background: var(--color-warning-soft);
}

.reading-notes__item h3 {
  margin-top: 2px;
  font-size: 0.76rem;
  font-weight: 620;
}

.reading-notes__item p {
  margin-top: 3px;
  color: var(--color-muted);
  font-size: 0.7rem;
  line-height: 1.55;
}

.reading-notes__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--color-line);
  color: var(--color-brand-strong);
  font-size: 0.73rem;
  font-weight: 550;
}

.reading-notes__link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 860px) {
  .reading-notes__list {
    grid-template-columns: minmax(0, 1fr);
    gap: 15px;
  }
}
</style>
