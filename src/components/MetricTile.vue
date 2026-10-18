<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    unit?: string
    icon?: string
    tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
    progress?: number
    hint?: string
  }>(),
  {
    unit: '',
    icon: 'activity',
    tone: 'neutral',
    progress: undefined,
    hint: '',
  },
)
</script>

<template>
  <div class="metric" :class="`metric--${tone}`">
    <div class="metric__head">
      <span class="metric__label">{{ label }}</span>
      <span class="metric__icon" aria-hidden="true">
        <Icon :name="icon" :size="15" />
      </span>
    </div>
    <div class="metric__value tabular">
      {{ value }} <small v-if="unit">{{ unit }}</small>
    </div>
    <div v-if="progress !== undefined" class="metric__bar" aria-hidden="true">
      <span :style="{ width: `${Math.max(0, Math.min(100, progress))}%` }"></span>
    </div>
    <p v-if="hint" class="metric__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.metric {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 12px 13px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
}

.metric--brand {
  border-color: transparent;
  background: var(--color-brand-soft);
}

.metric--success {
  border-color: transparent;
  background: var(--color-success-soft);
}

.metric--warning {
  border-color: transparent;
  background: var(--color-warning-soft);
}

.metric--danger {
  border-color: transparent;
  background: var(--color-danger-soft);
}

.metric__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric__label {
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 550;
  line-height: 1.3;
}

.metric__icon {
  color: var(--color-faint);
}

.metric--brand .metric__icon {
  color: var(--color-brand-strong);
}

.metric--success .metric__icon {
  color: var(--color-success);
}

.metric--warning .metric__icon {
  color: var(--color-warning);
}

.metric--danger .metric__icon {
  color: var(--color-danger);
}

.metric__value {
  margin-top: 4px;
  overflow: hidden;
  color: var(--color-ink);
  font-size: clamp(1.4rem, 2.2vw, 1.85rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.045em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric__value small {
  margin-left: 1px;
  color: var(--color-muted);
  font-size: 0.44em;
  font-weight: 550;
  letter-spacing: 0;
}

.metric__bar {
  height: 3px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(17, 21, 28, 0.08);
}

.metric__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: currentColor;
}

.metric--neutral .metric__bar {
  color: var(--color-brand);
}

.metric--success .metric__bar {
  color: var(--color-success);
}

.metric--warning .metric__bar {
  color: var(--color-warning);
}

.metric__hint {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 0.66rem;
  line-height: 1.45;
}
</style>
