<script setup lang="ts">
import type { DataItem } from '@/types/ui'

withDefaults(
  defineProps<{
    items: DataItem[]
    columns?: 1 | 2
  }>(),
  { columns: 2 },
)
</script>

<template>
  <dl class="data-list" :class="`data-list--${columns}`">
    <div
      v-for="item in items"
      :key="item.label"
      class="data-list__item"
      :class="{ 'data-list__item--wide': item.wide }"
    >
      <dt>{{ item.label }}</dt>
      <dd :class="{ mono: item.mono }">{{ item.value || '--' }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.data-list {
  display: grid;
  gap: 0;
}

.data-list--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(24px, 3vw, 40px);
}

.data-list__item {
  display: grid;
  min-width: 0;
  grid-template-columns: 136px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-line);
}

.data-list__item--wide {
  grid-column: 1 / -1;
}

.data-list dt {
  color: var(--color-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.data-list dd {
  min-width: 0;
  color: var(--color-ink-soft);
  font-size: 0.82rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.data-list dd.mono {
  color: var(--color-ink);
  font-size: 0.76rem;
  letter-spacing: 0.01em;
}

@media (max-width: 720px) {
  .data-list--2 {
    grid-template-columns: minmax(0, 1fr);
  }

  .data-list__item {
    grid-template-columns: 104px minmax(0, 1fr);
  }
}
</style>
