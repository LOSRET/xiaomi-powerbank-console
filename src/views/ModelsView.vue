<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { VISIBLE_MODELS, modelDisplayName } from '@/data/models'
import Icon from '@/components/Icon.vue'

const { t, lang } = useI18n()
const query = ref('')

const filteredModels = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return VISIBLE_MODELS
  return VISIBLE_MODELS.filter((model) => {
    return [model.name, model.nameEn, model.model, model.connection, model.tempRange]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })
})
</script>

<template>
  <div class="models-page page-view page-shell">
    <div class="page-intro">
      <RouterLink to="/" class="back-link">
        <Icon name="arrow-left" :size="15" />
        {{ t('models.back') }}
      </RouterLink>
      <div class="page-intro__title-row">
        <h1>{{ t('models.title') }}</h1>
        <span class="pill pill--neutral">{{
          t('models.count', { count: VISIBLE_MODELS.length })
        }}</span>
      </div>
      <p class="page-intro__body">{{ t('models.subtitle') }}</p>
    </div>

    <section class="models-card card" :aria-label="t('models.supportedTitle')">
      <div class="models-card__toolbar">
        <h2>{{ t('models.allModels') }}</h2>
        <label class="search">
          <span class="sr-only">{{ t('models.search') }}</span>
          <Icon name="search" :size="16" />
          <input
            id="model-search"
            v-model="query"
            name="model-search"
            type="search"
            :placeholder="t('models.search')"
          />
        </label>
      </div>

      <div class="models-table" role="table">
        <div class="models-table__head" role="row">
          <span role="columnheader">{{ t('models.colId') }}</span>
          <span role="columnheader">{{ t('models.colName') }}</span>
          <span role="columnheader">{{ t('models.colModel') }}</span>
          <span role="columnheader">{{ t('models.colPort') }}</span>
          <span role="columnheader">{{ t('models.colTemp') }}</span>
        </div>

        <div
          v-for="(model, index) in filteredModels"
          :key="model.id"
          class="models-table__row"
          role="row"
        >
          <span class="models-table__index" role="cell">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span class="models-table__name" role="cell" :data-label="t('models.colName')">
            {{ modelDisplayName(model, lang) }}
          </span>
          <span class="models-table__model mono" role="cell" :data-label="t('models.colModel')">
            {{ model.model }}
          </span>
          <span role="cell" :data-label="t('models.colPort')">
            <span class="pill pill--brand">{{ model.connection }}</span>
          </span>
          <span class="models-table__temp" role="cell" :data-label="t('models.colTemp')">
            {{ model.tempRange }}
          </span>
        </div>

        <div v-if="!filteredModels.length" class="models-table__empty">
          <Icon name="search" :size="18" />
          {{ t('models.noResults') }}
        </div>
      </div>

      <div class="models-card__note">
        <span class="models-card__note-icon" aria-hidden="true">
          <Icon name="info" :size="15" />
        </span>
        <p>{{ t('models.note') }}</p>
      </div>
      <p class="models-card__port-note">{{ t('models.portNote') }}</p>
    </section>
  </div>
</template>

<style scoped>
.models-card {
  padding: var(--card-pad);
}

.models-card__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.models-card__toolbar h2 {
  font-size: 1.05rem;
  font-weight: 640;
}

.search {
  display: flex;
  width: min(300px, 100%);
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  color: var(--color-faint);
  background: var(--color-surface-muted);
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.search:focus-within {
  border-color: var(--color-brand);
  background: var(--color-surface);
}

.search input {
  min-width: 0;
  flex: 1;
  border: 0;
  color: var(--color-ink);
  background: transparent;
  font-size: 0.78rem;
  outline: none;
}

.search input::placeholder {
  color: var(--color-faint);
}

.models-table {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  overflow: hidden;
}

.models-table__head,
.models-table__row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1.6fr) minmax(120px, 0.65fr) minmax(100px, 0.5fr) minmax(
      100px,
      0.55fr
    );
  gap: 16px;
  align-items: center;
}

.models-table__head {
  padding: 12px 18px;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-muted);
  font-size: 0.68rem;
  font-weight: 550;
}

.models-table__row {
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-line);
  background: var(--color-surface);
  transition: background var(--transition-fast);
}

.models-table__row:hover {
  background: var(--color-surface-muted);
}

.models-table__row:last-of-type {
  border-bottom: 0;
}

.models-table__index {
  color: var(--color-faint);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.models-table__name {
  color: var(--color-ink);
  font-size: 0.82rem;
  font-weight: 550;
  line-height: 1.45;
}

.models-table__model {
  color: var(--color-muted);
  font-size: 0.73rem;
}

.models-table__temp {
  color: var(--color-muted);
  font-size: 0.74rem;
  white-space: nowrap;
}

.models-table__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: var(--color-faint);
  font-size: 0.82rem;
}

.models-card__note {
  display: flex;
  gap: 9px;
  margin-top: 18px;
  padding: 12px;
  border-radius: var(--radius-xs);
  background: var(--color-brand-soft);
  color: var(--color-brand-ink);
  font-size: 0.73rem;
  line-height: 1.55;
}

.models-card__note-icon {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--color-brand-strong);
}

.models-card__port-note {
  margin-top: 10px;
  color: var(--color-faint);
  font-size: 0.68rem;
}

@media (max-width: 900px) {
  .models-table__head {
    display: none;
  }

  .models-table__row {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 8px 12px;
    padding: 16px;
  }

  .models-table__row > :nth-child(n + 3) {
    display: flex;
    align-items: baseline;
    gap: 8px;
    grid-column: 2;
  }

  .models-table__row > :nth-child(n + 3)::before {
    flex: 0 0 112px;
    color: var(--color-faint);
    content: attr(data-label);
    font-size: 0.67rem;
  }

  :lang(en) .models-table__row > :nth-child(n + 3)::before {
    flex-basis: 128px;
  }

  .models-table__name {
    font-size: 0.86rem;
  }

  .models-table__model {
    font-size: 0.74rem;
  }

  .models-card__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .search {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .models-table__row > :nth-child(n + 3) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
</style>
