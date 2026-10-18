<template>
  <span class="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 32 32" fill="none">
      <rect
        x="4.25"
        y="8.25"
        width="18.5"
        height="15.5"
        rx="4.25"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M22.75 13.2h1.2a2.3 2.3 0 0 1 2.3 2.3v1a2.3 2.3 0 0 1-2.3 2.3h-1.2"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path d="M15.9 10.4 11.25 17h3.35l-.5 4.6 4.65-6.6H15.4l.5-4.6Z" fill="var(--color-energy)" />
    </svg>
  </span>
</template>

<style scoped>
.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 13px;
  color: #fff;
  background: var(--color-ink);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 8px 18px -12px rgba(17, 21, 28, 0.75);
}

.brand-mark svg {
  width: 30px;
  height: 30px;
}
</style>
