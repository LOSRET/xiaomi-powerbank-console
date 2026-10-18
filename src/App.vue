<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppModal from '@/components/AppModal.vue'
import ToastStack from '@/components/ToastStack.vue'
import { useI18n } from '@/composables/useI18n'
import { useDeviceStore } from '@/stores/device'

const route = useRoute()
const store = useDeviceStore()
const { t, lang } = useI18n()

const pageTitle = computed(() => {
  if (route.name === 'models') return `${t('models.title')} · ${t('app.title')}`
  if (route.name === 'guide') return `${t('guide.title')} · ${t('app.title')}`
  return t('app.title')
})

watchEffect(() => {
  if (typeof document === 'undefined') return
  document.title = pageTitle.value
  document.documentElement.lang = lang.value === 'en' ? 'en' : 'zh-CN'
  const description = document.querySelector('meta[name="description"]')
  description?.setAttribute('content', t('app.description'))
})

const errorModalOpen = computed(() => Boolean(store.errorModal))
</script>

<template>
  <a class="skip-link" href="#main">{{ t('nav.skip') }}</a>
  <AppHeader />

  <main id="main">
    <RouterView />
  </main>

  <AppFooter />
  <ToastStack />

  <AppModal
    :open="store.disconnectConfirmOpen"
    :title="t('modal.disconnect.title')"
    :body="t('modal.disconnect.body')"
    :ok-text="t('modal.disconnect.ok')"
    :cancel-text="t('modal.disconnect.cancel')"
    tone="warning"
    icon="power"
    @close="store.disconnectConfirmOpen = false"
    @confirm="store.confirmDisconnect()"
  />

  <AppModal
    :open="store.disconnectedModalOpen"
    :title="t('modal.disconnected.title')"
    :body="t('modal.disconnected.body')"
    :ok-text="t('modal.disconnected.ok')"
    :closable="false"
    icon="power"
    @close="store.dismissDisconnectedModal()"
    @confirm="store.dismissDisconnectedModal()"
  />

  <AppModal
    :open="store.unauthorizedModalOpen"
    :title="t('modal.unauthorized.title')"
    :body="t('modal.unauthorized.body')"
    :ok-text="t('modal.unauthorized.ok')"
    tone="warning"
    icon="shield"
    @close="store.dismissUnauthorizedModal()"
    @confirm="store.dismissUnauthorizedModal()"
  />

  <AppModal
    :open="errorModalOpen"
    :title="store.errorModal?.title ?? t('modal.error.title')"
    :body="store.errorModal?.body"
    :ok-text="t('modal.error.ok')"
    tone="danger"
    icon="alert"
    @close="store.closeErrorModal()"
    @confirm="store.closeErrorModal()"
  />
</template>
