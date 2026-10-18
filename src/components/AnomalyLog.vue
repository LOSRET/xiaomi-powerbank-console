<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'
import { historyFaultKey } from '@/lib/protocol/decoders'
import { formatDeviceTime } from '@/lib/protocol/formatting'
import type { HistoryRecord } from '@/types/device'
import Icon from './Icon.vue'

const store = useDeviceStore()
const { t, lang } = useI18n()

const page = ref(1)
const pageSize = 7
const totalPages = computed(() => Math.max(1, Math.ceil(store.history.length / pageSize)))
const pagedRecords = computed(() =>
  store.history.slice((page.value - 1) * pageSize, page.value * pageSize),
)

watch(totalPages, (value) => {
  if (page.value > value) page.value = value
})

onMounted(() => {
  void store.loadHistory()
})

function typeLabel(record: HistoryRecord): string {
  return t(historyFaultKey(record.errorType, record.chargeState), {
    cellId: record.cellId,
  })
}

function valueLabel(record: HistoryRecord): string {
  if (record.errorType === 1 || record.errorType === 2) {
    return `${(record.value / 1000).toFixed(2)} V`
  }
  if (record.errorType === 3 || record.errorType === 4) {
    return `${record.value} °C`
  }
  if (record.errorType === 5) {
    return record.value > 100 ? `${(record.value / 1000).toFixed(2)} A` : `${record.value} A`
  }
  if (record.errorType === 7) {
    return `${record.value} mV`
  }
  return String(record.value)
}

function previous(): void {
  page.value = Math.max(1, page.value - 1)
}

function next(): void {
  page.value = Math.min(totalPages.value, page.value + 1)
}
</script>

<template>
  <div class="anomaly">
    <div v-if="store.historyLoading" class="anomaly__loading" role="status">
      <span class="spinner" aria-hidden="true"></span>
      {{ t('dashboard.historyLoading') }}
    </div>

    <template v-else>
      <div v-if="pagedRecords.length" class="anomaly__table-wrap">
        <table class="anomaly__table">
          <caption class="sr-only">
            {{
              t('a11y.historyTable')
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">{{ t('dashboard.historyTime') }}</th>
              <th scope="col">{{ t('dashboard.historyType') }}</th>
              <th scope="col">{{ t('dashboard.historyValue') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in pagedRecords"
              :key="`${record.timestamp}-${record.cellId}-${record.errorType}`"
            >
              <td class="anomaly__time tabular">{{ formatDeviceTime(record.timestamp, lang) }}</td>
              <td>{{ typeLabel(record) }}</td>
              <td class="tabular">{{ valueLabel(record) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="anomaly__empty">
        <span class="anomaly__empty-icon" aria-hidden="true">
          <Icon name="check" :size="22" />
        </span>
        <h3>{{ t('dashboard.historyEmptyTitle') }}</h3>
        <p>{{ t('dashboard.historyEmptyBody') }}</p>
      </div>

      <div v-if="store.history.length" class="anomaly__footer">
        <p class="anomaly__hint">{{ t('dashboard.historyHint') }}</p>
        <div class="anomaly__pagination">
          <button
            type="button"
            class="icon-button"
            :disabled="page <= 1"
            :aria-label="t('common.previous')"
            @click="previous"
          >
            <Icon name="chevron-left" :size="16" />
          </button>
          <span class="tabular">{{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="icon-button"
            :disabled="page >= totalPages"
            :aria-label="t('common.next')"
            @click="next"
          >
            <Icon name="chevron-right" :size="16" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.anomaly {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.anomaly__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 220px;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.anomaly__table-wrap {
  overflow-x: auto;
}

.anomaly__table {
  width: 100%;
  min-width: 560px;
  text-align: left;
}

.anomaly__table th,
.anomaly__table td {
  padding: 12px 16px 12px 0;
  border-bottom: 1px solid var(--color-line);
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.5;
  white-space: nowrap;
}

.anomaly__table thead th {
  padding-top: 0;
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 550;
}

.anomaly__table tbody tr:last-child td {
  border-bottom: 0;
}

.anomaly__time {
  color: var(--color-muted);
  font-size: 0.74rem;
}

.anomaly__empty {
  display: flex;
  min-height: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}

.anomaly__empty-icon {
  display: grid;
  width: 46px;
  height: 46px;
  margin-bottom: 14px;
  place-items: center;
  border-radius: 50%;
  color: var(--color-success);
  background: var(--color-success-soft);
}

.anomaly__empty h3 {
  font-size: 0.95rem;
}

.anomaly__empty p {
  max-width: 36ch;
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 0.8rem;
  line-height: 1.55;
}

.anomaly__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 4px;
}

.anomaly__hint {
  max-width: 56ch;
  color: var(--color-faint);
  font-size: 0.68rem;
  line-height: 1.5;
}

.anomaly__pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-muted);
  font-size: 0.72rem;
}

.anomaly__pagination .icon-button {
  width: 30px;
  height: 30px;
}

.anomaly__pagination .icon-button:disabled {
  opacity: 0.4;
}

@media (max-width: 640px) {
  .anomaly__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
