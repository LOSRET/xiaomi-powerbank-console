<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="site-footer" :aria-label="t('a11y.footer')">
    <div class="page-shell site-footer__inner">
      <div class="site-footer__brand">
        <p class="site-footer__note">{{ t('footer.note') }}</p>
        <p class="site-footer__privacy">
          <span class="dot" aria-hidden="true"></span>
          {{ t('footer.privacy') }}
        </p>
      </div>

      <div class="site-footer__links">
        <RouterLink to="/models">{{ t('footer.models') }}</RouterLink>
        <RouterLink to="/exception-guide">{{ t('footer.guide') }}</RouterLink>
        <a
          href="https://github.com/yomiel-s/xiaomi-powerbank-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('footer.source') }}
        </a>
        <a href="https://powerbank.mieco.net/" target="_blank" rel="noopener noreferrer">
          {{ t('footer.original') }}
        </a>
      </div>

      <div class="site-footer__meta">
        <span>{{ t('footer.madeWith') }}</span>
        <span aria-hidden="true" class="site-footer__sep">/</span>
        <span>{{ t('footer.license') }}</span>
        <span aria-hidden="true" class="site-footer__sep">/</span>
        <span>{{ t('footer.copyright', { year }) }}</span>
      </div>

      <p class="site-footer__disclaimer">{{ t('footer.disclaimer') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: clamp(42px, 7vw, 86px);
  border-top: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
}

.site-footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 18px clamp(24px, 6vw, 80px);
  padding-block: 34px 38px;
}

.site-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.site-footer__note {
  max-width: 48ch;
  color: var(--color-ink-soft);
  font-size: 0.82rem;
  line-height: 1.6;
}

.site-footer__privacy {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.site-footer__privacy .dot {
  color: var(--color-success);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  justify-content: flex-end;
  gap: 8px 18px;
}

.site-footer__links a {
  color: var(--color-muted);
  font-size: 0.8rem;
  transition: color var(--transition-fast);
}

.site-footer__links a:hover {
  color: var(--color-brand-strong);
}

.site-footer__meta {
  display: flex;
  flex-wrap: wrap;
  grid-column: 1 / -1;
  gap: 6px;
  color: var(--color-faint);
  font-size: 0.72rem;
}

.site-footer__sep {
  color: var(--color-line-strong);
}

.site-footer__disclaimer {
  grid-column: 1 / -1;
  color: var(--color-faint);
  font-size: 0.7rem;
  line-height: 1.55;
}

@media (max-width: 700px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
    padding-block: 28px 32px;
  }

  .site-footer__links {
    justify-content: flex-start;
  }
}
</style>
