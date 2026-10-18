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
  <div class="home page-shell" :class="{ 'is-connected': connected }">
    <h1 v-if="connected" class="sr-only">
      {{ t(store.isDemo ? 'dashboard.demoTitle' : 'dashboard.connectedTitle') }}
    </h1>
    <div class="home__grid">
      <aside class="home__aside">
        <ConnectCard />
        <ReadingNotes v-if="connected" />
      </aside>
      <section class="home__panel">
        <DevicePanel />
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: clamp(24px, 3.5vw, 40px);
}

.home__grid {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(330px, 0.82fr) minmax(0, 1.18fr);
  gap: clamp(14px, 2vw, 22px);
}

.home__aside,
.home__panel {
  min-width: 0;
}

@media (min-width: 981px) {
  .home.is-connected .home__aside {
    position: sticky;
    top: 102px;
  }
}

@media (max-width: 980px) {
  .home__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .home.is-connected .home__aside {
    display: none;
  }

  .home.is-connected .home__panel {
    order: -1;
  }
}
</style>
