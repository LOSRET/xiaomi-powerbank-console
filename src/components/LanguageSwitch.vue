<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { lang, setLanguage, t } = useI18n()
</script>

<template>
  <div class="language-switch" role="group" :aria-label="t('a11y.language')">
    <button
      type="button"
      class="language-switch__option"
      :class="{ 'is-active': lang === 'zh-CN' }"
      :aria-pressed="lang === 'zh-CN'"
      @click="setLanguage('zh-CN')"
    >
      中文
    </button>
    <button
      type="button"
      class="language-switch__option"
      :class="{ 'is-active': lang === 'en' }"
      :aria-pressed="lang === 'en'"
      @click="setLanguage('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.language-switch {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  background: var(--color-surface-muted);
}

.language-switch__option {
  min-width: 44px;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 600;
  transition:
    color var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.language-switch__option:hover {
  color: var(--color-ink);
}

.language-switch__option.is-active {
  color: var(--color-ink);
  background: var(--color-surface);
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1);
}
</style>
