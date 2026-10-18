<script setup lang="ts">
import type { CellStatus } from '@/types/device'
import { useI18n } from '@/composables/useI18n'
import Icon from './Icon.vue'

defineProps<{
  sensors: CellStatus[]
  range: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="temperature">
    <div v-if="sensors.length" class="temperature__grid">
      <div v-for="(sensor, index) in sensors" :key="sensor.index" class="temperature__item">
        <span class="temperature__icon" aria-hidden="true">
          <Icon name="thermometer" :size="16" />
        </span>
        <span class="temperature__label">
          {{ t('dashboard.temperatureSensor', { index: index + 1 }) }}
        </span>
        <span class="temperature__value tabular">{{ sensor.temperature }}<small>°C</small></span>
      </div>
    </div>
    <p v-else class="temperature__empty">{{ t('dashboard.noTemperature') }}</p>

    <p class="temperature__tip">{{ t('dashboard.temperatureRange', { range }) }}</p>
    <p class="temperature__tip">{{ t('dashboard.temperatureProtect') }}</p>
  </div>
</template>

<style scoped>
.temperature {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.temperature__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
}

.temperature__item {
  display: grid;
  align-items: center;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xs);
  background: var(--color-surface-muted);
}

.temperature__icon {
  color: var(--color-energy);
}

.temperature__label {
  overflow: hidden;
  color: var(--color-muted);
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.temperature__value {
  color: var(--color-ink);
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.temperature__value small {
  margin-left: 1px;
  color: var(--color-muted);
  font-size: 0.62em;
  font-weight: 550;
  letter-spacing: 0;
}

.temperature__empty {
  color: var(--color-faint);
  font-size: 0.8rem;
}

.temperature__tip {
  max-width: 72ch;
  color: var(--color-faint);
  font-size: 0.7rem;
  line-height: 1.55;
}
</style>
