<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import PowerBankVisual from './PowerBankVisual.vue'

const { t } = useI18n()
</script>

<template>
  <div class="empty-panel card">
    <div class="empty-panel__top">
      <span class="empty-panel__tag">
        <span class="dot" aria-hidden="true"></span>
        HID · {{ t('status.disconnected') }}
      </span>
      <span class="empty-panel__code mono">0x00 / 0x10</span>
    </div>

    <div class="empty-panel__content">
      <PowerBankVisual :connected="false" :cell-count="2" status="unknown" model-name="USB-C" />
    </div>

    <div class="empty-panel__tabs" aria-hidden="true">
      <span class="empty-panel__tab is-active">{{ t('dashboard.detailsTab') }}</span>
      <span class="empty-panel__tab">{{ t('dashboard.anomalyTab') }}</span>
      <span class="empty-panel__tab-line"></span>
    </div>
    <p class="empty-panel__placeholder">{{ t('empty.details') }}</p>
  </div>
</template>

<style scoped>
.empty-panel {
  display: flex;
  min-height: 460px;
  flex-direction: column;
  padding: clamp(24px, 3.5vw, 36px);
}

.empty-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.empty-panel__tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-faint);
  font-size: 0.7rem;
  font-weight: 550;
}

.empty-panel__tag .dot {
  color: var(--color-faint);
  box-shadow: none;
}

.empty-panel__code {
  color: var(--color-faint);
  font-size: 0.63rem;
  letter-spacing: 0.06em;
}

.empty-panel__content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 28px 0 20px;
}

.empty-panel__tabs {
  display: flex;
  align-items: center;
  gap: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--color-line);
}

.empty-panel__tab {
  position: relative;
  color: var(--color-faint);
  font-size: 0.78rem;
  font-weight: 550;
}

.empty-panel__tab.is-active {
  color: var(--color-brand-strong);
}

.empty-panel__tab.is-active::after {
  position: absolute;
  right: 0;
  bottom: -15px;
  left: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--color-brand);
  content: '';
}

.empty-panel__tab-line {
  flex: 1;
  height: 1px;
  background: var(--color-line);
}

.empty-panel__placeholder {
  display: flex;
  min-height: 130px;
  align-items: center;
  justify-content: center;
  color: var(--color-faint);
  font-size: 0.8rem;
  text-align: center;
}

@media (max-width: 760px) {
  .empty-panel {
    min-height: 0;
  }

  .empty-panel__content {
    padding-top: 24px;
  }

  .empty-panel__placeholder {
    min-height: 90px;
  }
}
</style>
