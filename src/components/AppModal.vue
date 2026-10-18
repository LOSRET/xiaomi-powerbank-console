<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    body?: string
    okText: string
    cancelText?: string
    tone?: 'brand' | 'warning' | 'danger' | 'success'
    icon?: string
    closable?: boolean
  }>(),
  {
    body: '',
    cancelText: '',
    tone: 'brand',
    icon: 'info',
    closable: true,
  },
)

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const dialog = ref<HTMLElement | null>(null)

watch(
  () => props.open,
  async (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      await nextTick()
      dialog.value?.focus()
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
})

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open && props.closable) emit('close')
}

function close(): void {
  if (props.closable) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-root" @click.self="close">
        <div
          ref="dialog"
          class="modal-card"
          :class="`modal-card--${tone}`"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabindex="-1"
        >
          <div class="modal-card__icon" aria-hidden="true">
            <Icon :name="icon" :size="24" />
          </div>
          <h2 id="modal-title" class="modal-card__title">{{ title }}</h2>
          <p v-if="body" class="modal-card__body">{{ body }}</p>

          <div class="modal-card__actions">
            <button v-if="cancelText" type="button" class="btn btn--ghost" @click="emit('close')">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn"
              :class="tone === 'danger' ? 'btn--danger' : 'btn--primary'"
              @click="emit('confirm')"
            >
              {{ okText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  padding: 20px;
  overflow-y: auto;
  place-items: center;
  background: rgba(16, 24, 40, 0.42);
  backdrop-filter: blur(5px);
}

.modal-card {
  width: min(440px, 100%);
  padding: 28px;
  border: 1px solid var(--color-line);
  border-radius: 28px;
  background: var(--color-surface);
  box-shadow: 0 32px 80px -36px rgba(16, 24, 40, 0.6);
  outline: none;
}

.modal-card__icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 16px;
  color: var(--color-brand-strong);
  background: var(--color-brand-soft);
}

.modal-card--warning .modal-card__icon {
  color: var(--color-warning);
  background: var(--color-warning-soft);
}

.modal-card--danger .modal-card__icon {
  color: var(--color-danger);
  background: var(--color-danger-soft);
}

.modal-card--success .modal-card__icon {
  color: var(--color-success);
  background: var(--color-success-soft);
}

.modal-card__title {
  font-size: 1.32rem;
  font-weight: 650;
}

.modal-card__body {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

.modal-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 26px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 220ms var(--ease-out);
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 280ms var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(12px) scale(0.98);
}
</style>
