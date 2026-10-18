import { ref } from 'vue'

export type ToastKind = 'info' | 'success' | 'error'

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
}

const toasts = ref<ToastMessage[]>([])
let nextId = 1

export function useToast() {
  function show(text: string, kind: ToastKind = 'info', duration = 4_000): number {
    const id = nextId
    nextId += 1
    toasts.value = [...toasts.value, { id, kind, text }]
    window.setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function success(text: string): void {
    show(text, 'success')
  }

  function error(text: string): void {
    show(text, 'error', 5_000)
  }

  return { toasts, show, dismiss, success, error }
}
