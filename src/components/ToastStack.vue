<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { useI18n } from '@/composables/useI18n'
import Icon from './Icon.vue'

const { toasts, dismiss } = useToast()
const { t } = useI18n()

function iconFor(kind: 'info' | 'success' | 'error'): string {
  if (kind === 'success') return 'check'
  if (kind === 'error') return 'alert'
  return 'info'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.kind}`"
          role="status"
        >
          <span class="toast__icon" aria-hidden="true">
            <Icon :name="iconFor(toast.kind)" :size="16" :stroke-width="2" />
          </span>
          <span class="toast__text">{{ toast.text }}</span>
          <button
            type="button"
            class="toast__close"
            :aria-label="t('common.close')"
            @click="dismiss(toast.id)"
          >
            <Icon name="close" :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  bottom: max(18px, env(safe-area-inset-bottom));
  z-index: 300;
  display: flex;
  width: min(360px, calc(100vw - 36px));
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px 12px 14px;
  border: 1px solid var(--color-line);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: var(--shadow-lift);
  pointer-events: auto;
}

.toast__icon {
  display: grid;
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  place-items: center;
  border-radius: 8px;
  color: var(--color-brand-strong);
  background: var(--color-brand-soft);
}

.toast--success .toast__icon {
  color: var(--color-success);
  background: var(--color-success-soft);
}

.toast--error .toast__icon {
  color: var(--color-danger);
  background: var(--color-danger-soft);
}

.toast__text {
  flex: 1;
  padding-top: 2px;
  color: var(--color-ink-soft);
  font-size: 0.84rem;
  line-height: 1.5;
}

.toast__close {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  place-items: center;
  border-radius: 7px;
  color: var(--color-faint);
}

.toast__close:hover {
  color: var(--color-ink);
  background: var(--color-surface-muted);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 200ms var(--ease-out),
    transform 260ms var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
