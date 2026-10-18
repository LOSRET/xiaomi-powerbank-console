<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import BrandMark from './BrandMark.vue'
import LanguageSwitch from './LanguageSwitch.vue'

const { t } = useI18n()
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner page-shell">
      <RouterLink to="/" class="brand" :aria-label="t('app.title')">
        <BrandMark />
        <span class="brand__copy">
          <span class="brand__title">{{ t('app.title') }}</span>
          <span class="brand__sub">{{ t('app.kicker') }}</span>
        </span>
      </RouterLink>

      <nav class="site-nav" :aria-label="t('a11y.nav')">
        <RouterLink to="/" class="site-nav__link">{{ t('nav.device') }}</RouterLink>
        <RouterLink to="/models" class="site-nav__link">{{ t('nav.models') }}</RouterLink>
        <RouterLink to="/exception-guide" class="site-nav__link">{{ t('nav.guide') }}</RouterLink>
      </nav>

      <div class="site-header__actions">
        <LanguageSwitch />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid color-mix(in srgb, var(--color-line) 75%, transparent);
  background: color-mix(in srgb, var(--color-bg) 82%, transparent);
  backdrop-filter: blur(18px) saturate(1.2);
}

.site-header__inner {
  display: flex;
  min-height: 82px;
  align-items: center;
  gap: clamp(16px, 3vw, 38px);
}

.brand {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.brand__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.brand__title {
  overflow: hidden;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand__sub {
  color: var(--color-muted);
  font-size: 0.7rem;
  font-weight: 550;
  letter-spacing: 0.015em;
  white-space: nowrap;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.site-nav__link {
  position: relative;
  padding: 9px 13px;
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 550;
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

.site-nav__link:hover {
  color: var(--color-ink);
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
}

.site-nav__link.router-link-exact-active {
  color: var(--color-ink);
  background: var(--color-surface);
  box-shadow:
    inset 0 0 0 1px var(--color-line),
    0 2px 8px -6px rgba(16, 24, 40, 0.3);
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 720px) {
  .site-header__inner {
    min-height: 0;
    flex-wrap: wrap;
    gap: 10px 14px;
    padding-block: 12px;
  }

  .brand {
    flex: 1 1 auto;
  }

  .brand__title {
    font-size: 0.92rem;
  }

  .site-nav {
    order: 3;
    width: 100%;
    margin-left: 0;
    padding-top: 2px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .site-nav::-webkit-scrollbar {
    display: none;
  }

  .site-nav__link {
    padding: 7px 12px;
    white-space: nowrap;
  }

  .site-header__actions {
    margin-left: auto;
  }
}

@media (max-width: 390px) {
  .brand__sub {
    display: none;
  }
}
</style>
