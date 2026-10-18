<script setup lang="ts">
import { computed } from 'vue'
import ConnectCard from '@/components/ConnectCard.vue'
import DevicePanel from '@/components/DevicePanel.vue'
import ReadingNotes from '@/components/ReadingNotes.vue'
import { useDeviceStore } from '@/stores/device'
import { useI18n } from '@/composables/useI18n'

const store = useDeviceStore()
const { t } = useI18n()
const connected = computed(() => store.isConnected)
</script>

<template>
  <div class="home page-shell">
    <h1 v-if="connected" class="sr-only">
      {{ t(store.isDemo ? 'dashboard.demoTitle' : 'dashboard.connectedTitle') }}
    </h1>
    <div class="home__grid">
      <aside v-if="!connected" class="home__aside">
        <ConnectCard />
      </aside>
      <section class="home__panel">
        <DevicePanel />
      </section>
      <ReadingNotes v-if="connected" class="home__notes" />
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: clamp(24px, 3.5vw, 40px);
}

.home__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: clamp(14px, 2vw, 22px);
}

.home__aside,
.home__panel,
.home__notes {
  min-width: 0;
}
</style>
