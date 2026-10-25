<script setup lang="ts">
import { computed } from 'vue'
import type { BatteryIdInfo, BatteryInfo, CellStatus } from '@/types/device'
import { useI18n } from '@/composables/useI18n'
import { formatVoltage } from '@/lib/formatting'

const props = defineProps<{
  battery: BatteryInfo | null
  cells: CellStatus[]
  cellIds: Record<number, BatteryIdInfo>
  hideSerial: boolean
}>()

const { t } = useI18n()

const cellCount = computed(() => props.battery?.cellCount ?? 0)
const rows = computed(() =>
  Array.from({ length: cellCount.value }, (_, index) => {
    const cellNumber = index + 1
    const status = props.cells.find((cell) => cell.index === cellNumber)
    const id = props.cellIds[cellNumber]
    return {
      index: cellNumber,
      voltage: status ? formatVoltage(status.voltage) : '--',
      productionDate: id?.parsed?.fixed.productionDate ?? '--',
      rawId: id?.raw ?? '--',
    }
  }),
)
</script>

<template>
  <div v-if="rows.length" class="cell-table-wrap">
    <table class="cell-table">
      <caption class="sr-only">
        {{
          t('a11y.cellTable')
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="cell-table__number">{{ t('dashboard.cell') }}</th>
          <th scope="col">{{ t('dashboard.cellVoltage') }}</th>
          <th scope="col">{{ t('dashboard.productionDate') }}</th>
          <th v-if="!hideSerial" scope="col">{{ t('dashboard.cellSerial') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.index">
          <th scope="row" class="cell-table__number">
            <span class="cell-table__badge">{{ row.index }}</span>
          </th>
          <td class="tabular">{{ row.voltage }}</td>
          <td>{{ row.productionDate }}</td>
          <td v-if="!hideSerial" class="cell-table__serial mono">{{ row.rawId }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="cell-table__empty">{{ t('dashboard.noCells') }}</p>
</template>

<style scoped>
.cell-table-wrap {
  overflow-x: auto;
  scrollbar-width: thin;
}

.cell-table {
  width: 100%;
  min-width: 480px;
  text-align: left;
}

.cell-table th,
.cell-table td {
  padding: 11px 14px 11px 0;
  border-bottom: 1px solid var(--color-line);
  font-size: 0.79rem;
  font-weight: 400;
  line-height: 1.5;
  vertical-align: middle;
}

.cell-table thead th {
  padding-top: 0;
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 550;
}

.cell-table tbody tr:last-child th,
.cell-table tbody tr:last-child td {
  border-bottom: 0;
}

.cell-table__number {
  width: 72px;
  color: var(--color-ink-soft);
  font-weight: 600;
}

.cell-table__badge {
  display: inline-grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 7px;
  color: var(--color-brand-strong);
  background: var(--color-brand-soft);
  font-family: var(--font-mono);
  font-size: 0.66rem;
}

.cell-table__serial {
  color: var(--color-muted);
  font-size: 0.68rem;
  overflow-wrap: anywhere;
}

.cell-table__empty {
  color: var(--color-faint);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .cell-table {
    min-width: 0;
    table-layout: fixed;
  }

  .cell-table th,
  .cell-table td {
    padding: 9px 5px 9px 0;
    font-size: 0.7rem;
  }

  .cell-table__number {
    width: 46px;
  }

  .cell-table thead th:nth-child(2) {
    width: 62px;
  }

  .cell-table thead th:nth-child(3) {
    width: 82px;
  }

  .cell-table__serial {
    font-size: 0.62rem;
    word-break: break-all;
  }
}
</style>
