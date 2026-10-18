<script setup lang="ts">
import { computed } from 'vue'
import ConnectCard from '@/components/ConnectCard.vue'
import DevicePanel from '@/components/DevicePanel.vue'
import ReadingNotes from '@/components/ReadingNotes.vue'
import Icon from '@/components/Icon.vue'
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

    <section class="home__about card" aria-labelledby="home-about-title">
      <div class="home__about-intro">
        <span class="home__about-kicker">{{ t('app.kicker') }}</span>
        <h2 id="home-about-title">{{ t('home.aboutTitle') }}</h2>
        <p>{{ t('home.aboutBody') }}</p>
      </div>

      <div class="home__about-grid">
        <div class="home__about-item">
          <h3>{{ t('home.aboutReadTitle') }}</h3>
          <p>{{ t('home.aboutReadBody') }}</p>
        </div>
        <div class="home__about-item">
          <h3>{{ t('home.aboutSupportTitle') }}</h3>
          <p>{{ t('home.aboutSupportBody') }}</p>
        </div>
        <div class="home__about-item">
          <h3>{{ t('home.aboutPrivacyTitle') }}</h3>
          <p>{{ t('home.aboutPrivacyBody') }}</p>
        </div>
      </div>

      <div class="home__about-links">
        <RouterLink to="/models" class="home__about-link">
          {{ t('home.aboutModels') }}
          <Icon name="arrow-right" :size="13" />
        </RouterLink>
        <RouterLink to="/exception-guide" class="home__about-link">
          {{ t('home.aboutGuide') }}
          <Icon name="arrow-right" :size="13" />
        </RouterLink>
      </div>
    </section>
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

.home__about {
  display: grid;
  gap: clamp(20px, 3vw, 30px);
  margin-top: clamp(20px, 3vw, 32px);
  padding: clamp(24px, 3.5vw, 38px);
}

.home__about-intro {
  max-width: 72ch;
}

.home__about-kicker {
  color: var(--color-brand-strong);
  font-size: 0.7rem;
  font-weight: 620;
  letter-spacing: 0.02em;
}

.home__about h2 {
  margin-top: 8px;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
}

.home__about-intro p {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 0.86rem;
  line-height: 1.7;
}

.home__about-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px clamp(18px, 2.5vw, 30px);
  padding-top: clamp(18px, 2.5vw, 26px);
  border-top: 1px solid var(--color-line);
}

.home__about-item h3 {
  font-size: 0.82rem;
  font-weight: 620;
}

.home__about-item p {
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 0.76rem;
  line-height: 1.65;
}

.home__about-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.home__about-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--color-brand-strong);
  font-size: 0.76rem;
  font-weight: 550;
}

.home__about-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 860px) {
  .home__about-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
