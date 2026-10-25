<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'
import { chargeStateVisual, faultKey } from '@/lib/labels'
import { formatCurrent, formatPercent, formatRelativeTime, formatVoltage } from '@/lib/formatting'
import type { DataItem } from '@/types/ui'
import Icon from './Icon.vue'
import PowerBankVisual from './PowerBankVisual.vue'
import MetricTile from './MetricTile.vue'
import DataList from './DataList.vue'
import TemperatureSection from './TemperatureSection.vue'
import CellTable from './CellTable.vue'
import AnomalyLog from './AnomalyLog.vue'
import ProtocolLog from './ProtocolLog.vue'
import EmptyDeviceState from './EmptyDeviceState.vue'

type TabKey = 'details' | 'history'

const store = useDeviceStore()
const { t, lang, isEnglish } = useI18n()
const activeTab = ref<TabKey>('details')
const now = ref(Date.now())
let clockTimer: number | null = null

onMounted(() => {
  clockTimer = window.setInterval(() => {
    now.value = Date.now()
  }, 30_000)
})

onBeforeUnmount(() => {
  if (clockTimer !== null) window.clearInterval(clockTimer)
})

const battery = computed(() => store.battery)
const isConnected = computed(() => store.isConnected)
const visualStatus = computed(() => chargeStateVisual(battery.value?.chargeState))
const updatedLabel = computed(() => {
  void now.value
  return store.lastUpdated ? formatRelativeTime(store.lastUpdated, lang.value) : '--'
})
const healthTone = computed(() => {
  const health = battery.value?.health ?? 0
  if (health >= 90) return 'success'
  if (health >= 80) return 'warning'
  return 'danger'
})
const temperatureTone = computed(() => {
  const temperature = battery.value?.temperature ?? 0
  if (temperature >= 55) return 'danger'
  if (temperature >= 45 || temperature < 0) return 'warning'
  return 'neutral'
})
const faultLabelKey = computed(() => faultKey(battery.value?.faultType ?? 0))
const firstCellParsed = computed(() => Object.values(store.cellIds).find((id) => id.parsed)?.parsed)
const qi2Enabled = computed(() => store.qi2Status?.enabled === true)

const basicItems = computed<DataItem[]>(() => {
  const items: DataItem[] = [
    {
      label: t('dashboard.productName'),
      value: isEnglish.value ? store.productNameEn : store.productName,
      wide: true,
    },
    {
      label: t('dashboard.productModel'),
      value: store.device?.model || '--',
      mono: true,
    },
    {
      label: t('dashboard.port'),
      value: store.activeModel?.connection || '--',
      mono: true,
    },
  ]

  items.push({
    label: t('dashboard.deviceSn'),
    value: store.isWPB1007ZX
      ? t('dashboard.noSerial')
      : store.serialNumber || t('dashboard.serialUnavailable'),
    mono: !store.isWPB1007ZX,
    wide: true,
  })

  return items
})

const batteryItems = computed<DataItem[]>(() => {
  if (!battery.value) return []
  return [
    { label: t('dashboard.batteryHealth'), value: formatPercent(battery.value.health) },
    {
      label: t('dashboard.cycleCount'),
      value: `${battery.value.cycleCount} ${t('unit.cycles')}`,
    },
    { label: t('dashboard.batteryModel'), value: store.batteryModel, mono: true },
    {
      label: t('dashboard.batteryManufacturer'),
      value: isEnglish.value ? store.batteryManufacturerEn : store.batteryManufacturer,
    },
    { label: t('dashboard.totalVoltage'), value: formatVoltage(battery.value.voltage) },
    { label: t('dashboard.current'), value: formatCurrent(battery.value.current) },
    { label: t('dashboard.cellCount'), value: String(battery.value.cellCount) },
    {
      label: t('dashboard.productionDate'),
      value: firstCellParsed.value?.fixed.productionDate ?? '--',
    },
  ]
})

const healthProgress = computed(() => battery.value?.health ?? 0)

function selectTab(tab: TabKey): void {
  activeTab.value = tab
  if (tab === 'history') void store.loadHistory()
}

function refresh(): void {
  void store.refreshData()
}

function disconnect(): void {
  if (store.isDemo) {
    void store.exitDemo()
  } else {
    store.requestDisconnect()
  }
}
</script>

<template>
  <EmptyDeviceState v-if="!isConnected" />

  <div
    v-else-if="!battery"
    class="loading-panel card"
    :role="store.dataError ? undefined : 'status'"
  >
    <template v-if="store.dataError">
      <div class="data-error">
        <span class="data-error__icon" aria-hidden="true">
          <Icon name="alert" :size="22" />
        </span>
        <h2>{{ t('dashboard.dataErrorTitle') }}</h2>
        <p>{{ t('dashboard.dataErrorBody') }}</p>
        <div class="data-error__actions">
          <button
            type="button"
            class="btn btn--primary"
            @click="store.refreshData({ initial: true })"
          >
            <Icon name="refresh" :size="16" />
            {{ t('common.retry') }}
          </button>
          <button type="button" class="btn btn--ghost" @click="disconnect">
            {{ t('connect.disconnect') }}
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ t('common.loading') }}</span>
    </template>
  </div>

  <div v-else class="device-panel card">
    <div v-if="store.isDemo" class="demo-banner" role="status">
      <span class="demo-banner__icon" aria-hidden="true">
        <Icon name="activity" :size="17" />
      </span>
      <p>{{ t('dashboard.demoNotice') }}</p>
      <button type="button" class="demo-banner__action" @click="store.exitDemo()">
        {{ t('dashboard.demoAction') }}
      </button>
    </div>

    <header class="device-panel__head">
      <div class="device-panel__identity">
        <div class="device-panel__eyebrow">
          <span class="dot" aria-hidden="true"></span>
          {{ store.isDemo ? t('dashboard.demo') : t('dashboard.live') }}
        </div>
        <h2 class="device-panel__title">
          {{ store.isDemo ? t('dashboard.demoTitle') : t('dashboard.connectedTitle') }}
        </h2>
        <div class="device-panel__badges">
          <span class="pill pill--brand">{{ t(store.chargeStateLabelKey) }}</span>
          <span v-if="battery.faultType !== 0" class="pill pill--warning">
            {{ t(faultLabelKey) }}
          </span>
          <span v-else class="pill pill--neutral">{{ t('fault.normal') }}</span>
        </div>
      </div>

      <div class="device-panel__tools">
        <span class="device-panel__updated">{{
          t('dashboard.lastUpdated', { time: updatedLabel })
        }}</span>
        <button
          type="button"
          class="icon-button"
          :disabled="store.refreshing || store.qi2Toggling"
          :aria-label="t('a11y.refresh')"
          @click="refresh"
        >
          <span v-if="store.refreshing" class="spinner" aria-hidden="true"></span>
          <Icon v-else name="refresh" :size="17" />
        </button>
        <button type="button" class="btn btn--ghost device-panel__disconnect" @click="disconnect">
          <Icon name="power" :size="16" />
          {{ store.isDemo ? t('dashboard.demoAction') : t('connect.disconnect') }}
        </button>
      </div>
    </header>

    <section class="device-panel__overview" :aria-label="t('dashboard.overview')">
      <PowerBankVisual
        :level="battery.level"
        :cell-count="battery.cellCount || 1"
        :status="visualStatus"
        :model-name="store.device?.model"
        :demo="store.isDemo"
        connected
      />

      <div class="device-panel__metrics">
        <MetricTile
          :label="t('dashboard.batteryHealth')"
          :value="battery.health"
          unit="%"
          icon="shield"
          :tone="healthTone"
          :progress="healthProgress"
        />
        <MetricTile
          :label="t('dashboard.cycleCount')"
          :value="battery.cycleCount"
          :unit="t('unit.cycles')"
          icon="refresh"
        />
        <MetricTile
          :label="t('dashboard.temperature')"
          :value="battery.temperature"
          unit="°C"
          icon="thermometer"
          :tone="temperatureTone"
        />
        <MetricTile
          :label="t('dashboard.totalVoltage')"
          :value="(battery.voltage / 1000).toFixed(2)"
          unit="V"
          icon="bolt"
          :hint="`${formatCurrent(battery.current)} · ${t('dashboard.current')}`"
        />
      </div>
    </section>

    <section v-if="store.supportsQi2Toggle" class="qi2-panel" :class="{ 'is-on': qi2Enabled }">
      <span class="qi2-panel__icon" aria-hidden="true">
        <Icon name="bolt" :size="19" />
      </span>
      <div class="qi2-panel__copy">
        <div class="qi2-panel__title-row">
          <h3>{{ t('dashboard.qi2.title') }}</h3>
          <span
            v-if="store.qi2Status"
            class="pill"
            :class="qi2Enabled ? 'pill--success' : 'pill--neutral'"
          >
            {{ t(qi2Enabled ? 'dashboard.qi2.enabled' : 'dashboard.qi2.disabled') }}
          </span>
        </div>
        <p v-if="store.qi2Status">
          {{ t(qi2Enabled ? 'dashboard.qi2.onHint' : 'dashboard.qi2.offHint') }}
        </p>
        <p v-else>
          {{ store.qi2Loading ? t('common.loading') : t('dashboard.qi2.unavailable') }}
        </p>
      </div>
      <button
        v-if="store.qi2Status"
        type="button"
        role="switch"
        class="qi2-switch"
        :class="{ 'is-on': qi2Enabled }"
        :aria-checked="qi2Enabled"
        :aria-label="t('a11y.qi2Toggle')"
        :disabled="store.qi2Toggling || store.refreshing"
        @click="store.requestQi2Toggle(!qi2Enabled)"
      >
        <span v-if="store.qi2Toggling" class="spinner" aria-hidden="true"></span>
        <span v-else class="qi2-switch__thumb" aria-hidden="true"></span>
      </button>
      <button
        v-else
        type="button"
        class="btn btn--ghost qi2-panel__retry"
        :disabled="store.qi2Loading || store.refreshing"
        @click="store.reloadQi2Status()"
      >
        {{ t('common.retry') }}
      </button>
    </section>

    <div class="device-panel__tabs" role="tablist" :aria-label="t('a11y.tabs')">
      <button
        type="button"
        role="tab"
        class="device-panel__tab"
        :class="{ 'is-active': activeTab === 'details' }"
        :aria-selected="activeTab === 'details'"
        aria-controls="tab-details"
        @click="selectTab('details')"
      >
        {{ t('dashboard.detailsTab') }}
      </button>
      <button
        type="button"
        role="tab"
        class="device-panel__tab"
        :class="{ 'is-active': activeTab === 'history' }"
        :aria-selected="activeTab === 'history'"
        aria-controls="tab-history"
        @click="selectTab('history')"
      >
        {{ t('dashboard.anomalyTab') }}
        <span v-if="battery.historyErrorCount" class="device-panel__tab-count">
          {{ battery.historyErrorCount }}
        </span>
      </button>
    </div>

    <div
      v-if="activeTab === 'details'"
      id="tab-details"
      class="device-panel__tab-panel"
      role="tabpanel"
    >
      <section class="detail-block">
        <div class="detail-block__head">
          <h3>{{ t('dashboard.basicInfo') }}</h3>
        </div>
        <DataList :items="basicItems" />
      </section>

      <section class="detail-block">
        <div class="detail-block__head">
          <h3>{{ t('dashboard.batteryInfo') }}</h3>
        </div>
        <DataList :items="batteryItems" />
      </section>

      <section class="detail-block">
        <div class="detail-block__head">
          <h3>{{ t('dashboard.temperature') }}</h3>
        </div>
        <TemperatureSection :sensors="store.temperatureSensors" :range="store.temperatureRange" />
      </section>

      <section class="detail-block">
        <div class="detail-block__head">
          <h3>{{ t('dashboard.cells') }}</h3>
        </div>
        <CellTable
          :battery="battery"
          :cells="store.cells"
          :cell-ids="store.cellIds"
          :hide-serial="store.isWPB1007ZX"
        />
      </section>

      <ProtocolLog />
    </div>

    <div v-else id="tab-history" class="device-panel__tab-panel" role="tabpanel">
      <AnomalyLog />
    </div>
  </div>
</template>

<style scoped>
.device-panel {
  overflow: hidden;
  padding: clamp(22px, 3vw, 34px);
}

.loading-panel {
  display: flex;
  min-height: 420px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.data-error {
  display: flex;
  max-width: 420px;
  flex-direction: column;
  align-items: center;
  padding: 28px;
  text-align: center;
}

.data-error__icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  place-items: center;
  border-radius: 50%;
  color: var(--color-danger);
  background: var(--color-danger-soft);
}

.data-error h2 {
  font-size: 1.12rem;
}

.data-error p {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}

.data-error__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.demo-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  padding: 10px 12px;
  border: 1px solid #f5d8c4;
  border-radius: var(--radius-sm);
  background: var(--color-energy-soft);
}

.demo-banner__icon {
  flex: 0 0 auto;
  color: var(--color-energy);
}

.demo-banner p {
  flex: 1;
  color: #8d4a25;
  font-size: 0.74rem;
  line-height: 1.5;
}

.demo-banner__action {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--color-energy);
  font-size: 0.7rem;
  font-weight: 600;
}

.demo-banner__action:hover {
  background: rgba(240, 102, 28, 0.1);
}

.device-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.device-panel__identity {
  min-width: 0;
}

.device-panel__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-success);
  font-size: 0.69rem;
  font-weight: 600;
}

.device-panel__title {
  margin-top: 8px;
  font-size: clamp(1.35rem, 2.3vw, 1.72rem);
  font-weight: 630;
  line-height: 1.2;
}

.device-panel__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.device-panel__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.device-panel__updated {
  margin-right: 2px;
  color: var(--color-faint);
  font-size: 0.68rem;
}

.device-panel__disconnect {
  min-height: 38px;
  padding-inline: 13px;
  font-size: 0.76rem;
}

.device-panel__overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(18px, 2.5vw, 28px);
  margin-top: 26px;
  padding: 28px 20px 24px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fbfcfe 0%, var(--color-surface-muted) 100%);
}

.device-panel__metrics {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}

.qi2-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #fbfcfe 0%, var(--color-surface-muted) 100%);
}

.qi2-panel.is-on {
  border-color: #cfe9df;
  background: linear-gradient(135deg, #fbfefc 0%, var(--color-success-soft) 100%);
}

.qi2-panel__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
  color: var(--color-energy);
  background: var(--color-energy-soft);
}

.qi2-panel.is-on .qi2-panel__icon {
  color: var(--color-success);
  background: rgba(255, 255, 255, 0.72);
}

.qi2-panel__copy {
  flex: 1;
  min-width: 0;
}

.qi2-panel__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.qi2-panel__title-row h3 {
  font-size: 0.84rem;
  font-weight: 650;
}

.qi2-panel__copy p {
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

.qi2-switch {
  position: relative;
  display: inline-flex;
  width: 46px;
  height: 26px;
  flex: 0 0 auto;
  align-items: center;
  padding: 3px;
  border-radius: 999px;
  background: var(--color-line-strong);
  transition: background var(--transition-fast);
}

.qi2-switch:hover:not(:disabled) {
  background: #b6c2d2;
}

.qi2-switch.is-on {
  background: var(--color-success);
}

.qi2-switch.is-on:hover:not(:disabled) {
  background: #0a7f59;
}

.qi2-switch:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}

.qi2-switch:disabled {
  cursor: wait;
  opacity: 0.6;
}

.qi2-switch__thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.28);
  transition: transform var(--transition-fast);
}

.qi2-switch.is-on .qi2-switch__thumb {
  transform: translateX(20px);
}

.qi2-switch .spinner {
  width: 14px;
  height: 14px;
  margin: auto;
  color: #fff;
}

.qi2-panel__retry {
  min-height: 34px;
  flex: 0 0 auto;
  padding-inline: 12px;
  font-size: 0.72rem;
}

.device-panel__tabs {
  display: flex;
  gap: 24px;
  margin-top: 28px;
  border-bottom: 1px solid var(--color-line);
}

.device-panel__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 0 12px;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 550;
  transition: color var(--transition-fast);
}

.device-panel__tab:hover {
  color: var(--color-ink);
}

.device-panel__tab.is-active {
  color: var(--color-brand-strong);
}

.device-panel__tab.is-active::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--color-brand);
  content: '';
}

.device-panel__tab-count {
  min-width: 18px;
  padding: 1px 5px;
  border-radius: 999px;
  color: var(--color-muted);
  background: var(--color-surface-sunken);
  font-size: 0.62rem;
  text-align: center;
}

.device-panel__tab-panel {
  padding-top: 10px;
}

.detail-block {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-line);
}

.detail-block:last-of-type {
  border-bottom: 0;
}

.detail-block__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.detail-block__head h3 {
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 650;
}

@media (min-width: 981px) {
  .device-panel__overview {
    gap: 28px;
  }

  .device-panel__overview :deep(.power-bank-visual) {
    gap: 14px;
  }

  .device-panel__overview :deep(.power-bank-visual__stage) {
    flex-basis: 148px;
    padding: 8px;
  }

  .device-panel__overview :deep(.power-bank-visual__body) {
    width: 128px;
    border-radius: 22px;
  }

  .device-panel__overview :deep(.power-bank-visual__cells) {
    margin: 14px 0 12px;
  }

  .device-panel__overview :deep(.power-bank-visual__readout) {
    width: 82px;
  }

  .device-panel__overview :deep(.power-bank-visual__level) {
    font-size: 3.3rem;
  }
}

@media (max-width: 980px) {
  .device-panel__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .device-panel__head {
    flex-direction: column;
  }

  .device-panel__tools {
    width: 100%;
    justify-content: flex-start;
  }

  .device-panel__updated {
    width: 100%;
  }

  .device-panel__overview {
    padding: 20px 14px;
  }

  .device-panel__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-block {
    padding: 18px 0;
  }
}

@media (max-width: 360px) {
  .device-panel__metrics {
    grid-template-columns: minmax(0, 1fr);
  }

  .device-panel__tools .device-panel__disconnect {
    margin-left: auto;
  }
}
</style>
