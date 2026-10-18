<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const props = withDefaults(
  defineProps<{
    level?: number
    cellCount?: number
    status?: 'charging' | 'discharging' | 'idle' | 'unknown'
    modelName?: string
    connected?: boolean
    demo?: boolean
  }>(),
  {
    level: 0,
    cellCount: 2,
    status: 'unknown',
    modelName: '',
    connected: true,
    demo: false,
  },
)

const { t } = useI18n()

const clampedLevel = computed(() => Math.max(0, Math.min(100, Math.round(props.level))))
const cells = computed(() => Array.from({ length: Math.max(1, Math.min(4, props.cellCount)) }))
const statusLabel = computed(() => t(`status.${props.status}`))
const levelStyle = computed(() => ({
  '--level': `${clampedLevel.value}%`,
  '--cells': String(cells.value.length),
}))
</script>

<template>
  <div
    class="power-bank-visual"
    :class="[`power-bank-visual--${status}`, { 'is-empty': !connected, 'is-demo': demo }]"
    :style="levelStyle"
    :aria-label="connected ? t('a11y.batteryGauge', { level: clampedLevel }) : undefined"
  >
    <div class="power-bank-visual__stage">
      <div class="power-bank-visual__ambient" aria-hidden="true"></div>

      <div class="power-bank-visual__body">
        <div class="power-bank-visual__head">
          <span class="power-bank-visual__brand">POWER BANK</span>
          <span class="power-bank-visual__led" aria-hidden="true"></span>
        </div>

        <div class="power-bank-visual__cells" aria-hidden="true">
          <div v-for="(_, index) in cells" :key="index" class="power-bank-visual__cell">
            <span class="power-bank-visual__cell-fill"></span>
            <span class="power-bank-visual__cell-shine"></span>
          </div>
        </div>

        <div class="power-bank-visual__foot">
          <span class="power-bank-visual__port" aria-hidden="true">
            <span class="power-bank-visual__port-core"></span>
          </span>
          <span class="power-bank-visual__model">{{ modelName || 'USB-C' }}</span>
        </div>
      </div>

      <div v-if="!connected" class="power-bank-visual__cable" aria-hidden="true">
        <span class="power-bank-visual__cable-line"></span>
        <span class="power-bank-visual__cable-tip"></span>
      </div>
    </div>

    <div v-if="connected" class="power-bank-visual__readout">
      <span class="power-bank-visual__level"> {{ clampedLevel }}<small>%</small> </span>
      <span class="power-bank-visual__state">
        <span class="power-bank-visual__state-dot" aria-hidden="true"></span>
        {{ statusLabel }}
      </span>
      <span v-if="demo" class="pill pill--energy">{{ t('dashboard.demo') }}</span>
    </div>
  </div>
</template>

<style scoped>
.power-bank-visual {
  --accent: var(--color-brand);
  --accent-soft: var(--color-brand-soft);
  display: flex;
  align-items: center;
  gap: clamp(18px, 3vw, 30px);
}

.power-bank-visual--charging {
  --accent: #2f7cf6;
  --accent-soft: #e9f1ff;
}

.power-bank-visual--discharging {
  --accent: var(--color-energy);
  --accent-soft: var(--color-energy-soft);
}

.power-bank-visual--idle,
.power-bank-visual--unknown {
  --accent: #7e8ba0;
  --accent-soft: #eef2f7;
}

.power-bank-visual.is-demo {
  --accent: var(--color-energy);
  --accent-soft: var(--color-energy-soft);
}

.power-bank-visual__stage {
  position: relative;
  display: grid;
  flex: 0 0 clamp(148px, 17vw, 190px);
  place-items: center;
  padding: 14px;
}

.power-bank-visual__ambient {
  position: absolute;
  inset: 14% 4% 6%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-soft) 0%, transparent 68%);
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 500ms var(--ease-out),
    transform 700ms var(--ease-out);
}

.power-bank-visual:not(.is-empty) .power-bank-visual__ambient {
  opacity: 1;
  transform: scale(1);
}

.power-bank-visual--charging .power-bank-visual__ambient {
  animation: ambient-breathe 3.6s ease-in-out infinite;
}

.power-bank-visual__body {
  position: relative;
  display: flex;
  width: clamp(136px, 15.5vw, 172px);
  aspect-ratio: 0.63;
  flex-direction: column;
  padding: 16px 14px 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  color: #fff;
  background:
    radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.15), transparent 34%),
    linear-gradient(155deg, #29313d 0%, #131820 52%, #0b0f14 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 28px 42px -26px rgba(17, 21, 28, 0.78);
}

.power-bank-visual__body::after {
  position: absolute;
  right: 10%;
  bottom: 7%;
  width: 40%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14), transparent);
  content: '';
}

.is-empty .power-bank-visual__body {
  color: var(--color-muted);
  background: transparent;
  border: 1.5px dashed var(--color-line-strong);
  box-shadow: none;
}

.is-empty .power-bank-visual__body::after {
  display: none;
}

.power-bank-visual__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.power-bank-visual__brand {
  color: rgba(255, 255, 255, 0.44);
  font-size: 0.4rem;
  font-weight: 650;
  letter-spacing: 0.13em;
}

.is-empty .power-bank-visual__brand {
  color: var(--color-faint);
}

.power-bank-visual__led {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
}

.is-empty .power-bank-visual__led {
  background: var(--color-faint);
  box-shadow: none;
}

.power-bank-visual__cells {
  display: grid;
  flex: 1;
  gap: 8px;
  margin: 20px 0 18px;
  grid-template-rows: repeat(var(--cells), minmax(0, 1fr));
}

.power-bank-visual__cell {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.045);
}

.is-empty .power-bank-visual__cell {
  border-color: var(--color-line);
  background: transparent;
}

.power-bank-visual__cell-fill {
  position: absolute;
  inset: auto 0 0;
  height: var(--level);
  border-radius: 5px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 72%, white), var(--accent));
  opacity: 0.92;
  transform-origin: bottom;
  transition: height 700ms var(--ease-out);
}

.is-empty .power-bank-visual__cell-fill {
  display: none;
}

.power-bank-visual__cell-shine {
  position: absolute;
  inset: 2px;
  border-radius: 5px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), transparent 45%);
  pointer-events: none;
}

.is-empty .power-bank-visual__cell-shine {
  display: none;
}

.power-bank-visual__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.power-bank-visual__port {
  display: grid;
  width: 30px;
  height: 10px;
  padding: 2px;
  place-items: center;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.16);
}

.is-empty .power-bank-visual__port {
  background: var(--color-line);
}

.power-bank-visual__port-core {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #07090c;
}

.is-empty .power-bank-visual__port-core {
  background: var(--color-bg-deep);
}

.power-bank-visual__model {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.56);
  font-family: var(--font-mono);
  font-size: 0.46rem;
  letter-spacing: 0.06em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.is-empty .power-bank-visual__model {
  color: var(--color-faint);
}

.power-bank-visual__cable {
  position: absolute;
  right: -16px;
  bottom: 8px;
  display: flex;
  align-items: center;
  gap: 0;
  opacity: 0.7;
}

.power-bank-visual__cable-line {
  width: 38px;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--color-line-strong) 0 4px, transparent 4px 8px);
}

.power-bank-visual__cable-tip {
  width: 9px;
  height: 9px;
  border: 1.5px solid var(--color-line-strong);
  border-radius: 50%;
}

.power-bank-visual__readout {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.power-bank-visual__level {
  color: var(--color-ink);
  font-size: clamp(2.8rem, 6vw, 4.6rem);
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.07em;
  font-variant-numeric: tabular-nums;
}

.power-bank-visual__level small {
  margin-left: 2px;
  color: var(--color-muted);
  font-size: 0.3em;
  font-weight: 550;
  letter-spacing: 0;
}

.power-bank-visual__state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 550;
}

.power-bank-visual__state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

@keyframes ambient-breathe {
  0%,
  100% {
    opacity: 0.72;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@media (max-width: 700px) {
  .power-bank-visual {
    gap: 16px;
  }

  .power-bank-visual__stage {
    flex-basis: 126px;
    padding: 8px;
  }

  .power-bank-visual__body {
    width: 118px;
    border-radius: 22px;
  }

  .power-bank-visual__cells {
    margin: 14px 0 12px;
    gap: 6px;
  }

  .power-bank-visual__level {
    font-size: 2.9rem;
  }
}
</style>
