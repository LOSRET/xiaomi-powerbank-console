<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'
import { useToast } from '@/composables/useToast'
import { formatClock, formatHexInteger } from '@/lib/formatting'
import Icon from './Icon.vue'

const store = useDeviceStore()
const { t, lang } = useI18n()
const toast = useToast()
const open = ref(false)

const visibleLogs = computed(() => store.logs.slice(-60))
const hasMore = computed(() => store.logs.length > visibleLogs.value.length)

async function copyLogs(): Promise<void> {
  try {
    await navigator.clipboard.writeText(store.logsForCopy)
    toast.success(t('dashboard.protocolCopied'))
  } catch {
    toast.error(t('toast.copyFailed'))
  }
}

function directionLabel(direction: string): string {
  if (direction === 'tx') return t('dashboard.protocolTx')
  if (direction === 'rx') return t('dashboard.protocolRx')
  if (direction === 'error') return t('dashboard.protocolError')
  return t('dashboard.protocolInfo')
}
</script>

<template>
  <section class="protocol">
    <button
      type="button"
      class="protocol__toggle"
      :aria-expanded="open"
      :aria-label="t('a11y.protocolToggle')"
      @click="open = !open"
    >
      <span class="protocol__toggle-left">
        <span class="protocol__icon" aria-hidden="true">
          <Icon name="cpu" :size="17" />
        </span>
        <span>
          <span class="protocol__title">{{ t('dashboard.protocolLog') }}</span>
          <span class="protocol__sub">
            {{ t('dashboard.protocolFrames', { count: store.frameCount }) }}
            <template v-if="store.crcErrors">
              · {{ t('dashboard.protocolCrcErrors', { count: store.crcErrors }) }}
            </template>
          </span>
        </span>
      </span>
      <span class="protocol__chevron" :class="{ 'is-open': open }" aria-hidden="true">
        <Icon name="chevron-down" :size="16" />
      </span>
    </button>

    <div v-if="open" class="protocol__body">
      <div class="protocol__meta">
        <div>
          <span>{{ t('dashboard.protocolConnection') }}</span>
          <strong>{{
            store.transportKind === 'demo'
              ? t('dashboard.protocolDemo')
              : t('dashboard.protocolWebHid')
          }}</strong>
        </div>
        <div>
          <span>{{ t('dashboard.protocolVidPid') }}</span>
          <strong class="mono">
            {{ formatHexInteger(store.device?.vendorId ?? 0) }} /
            {{ formatHexInteger(store.device?.productId ?? 0) }}
          </strong>
        </div>
        <div>
          <span>{{ t('dashboard.protocolDevice') }}</span>
          <strong>{{ store.device?.productName || '--' }}</strong>
        </div>
      </div>

      <div class="protocol__toolbar">
        <p>{{ t('dashboard.protocolLogHint') }}</p>
        <div class="protocol__tools">
          <button type="button" class="btn btn--quiet" @click="copyLogs">
            <Icon name="copy" :size="14" />
            {{ t('dashboard.protocolCopy') }}
          </button>
          <button type="button" class="btn btn--quiet" @click="store.clearLogs()">
            {{ t('dashboard.protocolClear') }}
          </button>
        </div>
      </div>

      <div v-if="visibleLogs.length" class="protocol__logs">
        <div v-for="entry in visibleLogs" :key="entry.id" class="protocol__entry">
          <span class="protocol__direction" :class="`protocol__direction--${entry.direction}`">
            {{ directionLabel(entry.direction) }}
          </span>
          <span class="protocol__time tabular">{{ formatClock(entry.at, lang) }}</span>
          <span class="protocol__label">{{ entry.label }}</span>
          <code v-if="entry.hex" class="protocol__hex">{{ entry.hex }}</code>
          <span v-if="entry.detail" class="protocol__detail">{{ entry.detail }}</span>
        </div>
        <p v-if="hasMore" class="protocol__more">…</p>
      </div>
      <p v-else class="protocol__empty">{{ t('dashboard.protocolEmpty') }}</p>
    </div>
  </section>
</template>

<style scoped>
.protocol {
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}

.protocol__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 16px;
  text-align: left;
}

.protocol__toggle-left {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.protocol__icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 10px;
  color: var(--color-brand-strong);
  background: var(--color-brand-soft);
}

.protocol__title {
  display: block;
  color: var(--color-ink);
  font-size: 0.82rem;
  font-weight: 620;
}

.protocol__sub {
  display: block;
  margin-top: 2px;
  color: var(--color-muted);
  font-size: 0.68rem;
}

.protocol__chevron {
  color: var(--color-faint);
  transition: transform var(--transition-fast);
}

.protocol__chevron.is-open {
  transform: rotate(180deg);
}

.protocol__body {
  padding: 0 16px 16px;
  border-top: 1px solid var(--color-line);
}

.protocol__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 0;
}

.protocol__meta div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.protocol__meta span {
  color: var(--color-faint);
  font-size: 0.64rem;
}

.protocol__meta strong {
  overflow: hidden;
  color: var(--color-ink-soft);
  font-size: 0.72rem;
  font-weight: 550;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.protocol__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid var(--color-line);
}

.protocol__toolbar p {
  max-width: 56ch;
  color: var(--color-faint);
  font-size: 0.68rem;
  line-height: 1.5;
}

.protocol__tools {
  display: flex;
  flex: 0 0 auto;
  gap: 2px;
}

.protocol__tools .btn--quiet {
  min-height: 28px;
  padding: 0 8px;
  font-size: 0.68rem;
}

.protocol__logs {
  max-height: 320px;
  padding: 8px 10px;
  overflow-y: auto;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xs);
  background: #0f141c;
  scrollbar-color: #38414e #0f141c;
}

.protocol__entry {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 8px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.protocol__entry:last-child {
  border-bottom: 0;
}

.protocol__direction {
  flex: 0 0 38px;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.protocol__direction--tx {
  color: #93b4ff;
}

.protocol__direction--rx {
  color: #7ddbb5;
}

.protocol__direction--info {
  color: #a4afbf;
}

.protocol__direction--error {
  color: #ff9b9b;
}

.protocol__time {
  flex: 0 0 auto;
  color: #6f7b8c;
  font-size: 0.59rem;
}

.protocol__label {
  color: #dce3ed;
  font-size: 0.64rem;
}

.protocol__hex {
  flex-basis: 100%;
  padding-left: 46px;
  color: #8f9aab;
  font-size: 0.59rem;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.protocol__detail {
  flex-basis: 100%;
  padding-left: 46px;
  color: #6f7b8c;
  font-size: 0.59rem;
}

.protocol__more {
  padding: 6px 0 2px;
  color: #6f7b8c;
  font-family: var(--font-mono);
  font-size: 0.6rem;
}

.protocol__empty {
  padding: 18px 12px;
  border: 1px dashed var(--color-line-strong);
  border-radius: var(--radius-xs);
  color: var(--color-faint);
  font-size: 0.74rem;
  text-align: center;
}

@media (max-width: 640px) {
  .protocol__meta {
    grid-template-columns: 1fr;
  }

  .protocol__toolbar {
    flex-direction: column;
  }

  .protocol__hex,
  .protocol__detail {
    padding-left: 0;
  }
}
</style>
