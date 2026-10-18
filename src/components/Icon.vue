<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    strokeWidth?: number
  }>(),
  {
    size: 20,
    strokeWidth: 1.7,
  },
)

const paths: Record<string, string[]> = {
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'chevron-left': ['m15 18-6-6 6-6'],
  check: ['m5 12 4 4L19 6'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  copy: ['M8 8h11v11H8z', 'M16 8V5H5v11h3'],
  refresh: ['M20 12a8 8 0 1 1-2.34-5.66', 'M20 4v5h-5'],
  bolt: ['M13 2 5 14h6l-1 8 8-12h-6l1-8Z'],
  usb: ['M12 21V7', 'M9 5a3 3 0 0 1 6 0v2H9V5Z', 'M9 11H6l-1 2h4', 'M15 14h3l1 2h-4', 'M12 17h.01'],
  shield: ['M12 3 5 6v6c0 4.4 3 8.4 7 9 4-.6 7-4.6 7-9V6l-7-3Z', 'm9 12 2 2 4-4'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 11v6', 'M12 7h.01'],
  alert: ['M12 3 2.5 20h19L12 3Z', 'M12 9v5', 'M12 17h.01'],
  thermometer: ['M14 14.76V6a2 2 0 0 0-4 0v8.76a4 4 0 1 0 4 0Z', 'M12 9v6'],
  activity: ['M3 12h4l2-7 4 14 2-7h6'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.35-4.35'],
  lock: ['M5 11h14v9H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  monitor: ['M3 4h18v12H3z', 'M8 20h8', 'M12 16v4'],
  cpu: [
    'M7 7h10v10H7z',
    'M9 2v3',
    'M15 2v3',
    'M9 19v3',
    'M15 19v3',
    'M2 9h3',
    'M2 15h3',
    'M19 9h3',
    'M19 15h3',
  ],
  power: ['M12 3v9', 'M6.4 6.4a8 8 0 1 0 11.2 0'],
}

const iconPaths = computed(() => paths[props.name] ?? paths.info)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in iconPaths" :key="index" :d="path" />
  </svg>
</template>
