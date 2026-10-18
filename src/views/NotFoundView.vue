<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import Icon from '@/components/Icon.vue'

const { t } = useI18n()
</script>

<template>
  <div class="not-found page-shell">
    <div class="not-found__card card">
      <span class="not-found__code mono">404 / 0xA5</span>
      <h1>{{ t('empty.title') }}</h1>
      <p>{{ t('empty.body') }}</p>
      <RouterLink to="/" class="btn btn--primary">
        <Icon name="arrow-left" :size="17" />
        {{ t('common.back') }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  min-height: 62vh;
  align-items: center;
  justify-content: center;
  padding-block: 48px;
}

.not-found__card {
  max-width: 480px;
  padding: 34px;
  text-align: center;
}

.not-found__code {
  color: var(--color-faint);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
}

.not-found h1 {
  margin-top: 16px;
  font-size: 1.6rem;
}

.not-found p {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.not-found .btn {
  margin-top: 24px;
}
</style>
