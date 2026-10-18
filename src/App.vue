<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppModal from '@/components/AppModal.vue'
import ToastStack from '@/components/ToastStack.vue'
import { useI18n } from '@/composables/useI18n'
import { useSeo } from '@/composables/useSeo'
import { useDeviceStore } from '@/stores/device'

const store = useDeviceStore()
const { t } = useI18n()

useSeo()
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
    :open="store.qi2ConfirmOpen"
    :title="t(store.qi2PendingEnable ? 'modal.qi2Enable.title' : 'modal.qi2Disable.title')"
    :body="t(store.qi2PendingEnable ? 'modal.qi2Enable.body' : 'modal.qi2Disable.body')"
    :ok-text="t(store.qi2PendingEnable ? 'modal.qi2Enable.ok' : 'modal.qi2Disable.ok')"
    :cancel-text="t('common.cancel')"
    tone="warning"
    icon="bolt"
    @close="store.cancelQi2Toggle()"
    @confirm="store.confirmQi2Toggle()"
  />

  <AppModal
    :open="store.disconnectConfirmOpen"
    :title="t('modal.disconnect.title')"
    :body="t('modal.disconnect.body')"
    :ok-text="t('modal.disconnect.ok')"
    :cancel-text="t('modal.disconnect.cancel')"
    tone="warning"
    icon="power"
    @close="store.cancelDisconnect()"
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
</template>
