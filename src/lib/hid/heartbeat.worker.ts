/// <reference lib="webworker" />

const scope = self as unknown as DedicatedWorkerGlobalScope
let timer: ReturnType<typeof setInterval> | null = null

scope.onmessage = (event: MessageEvent<{ type: 'start' | 'stop'; interval?: number }>) => {
  const { type, interval } = event.data
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }

  if (type === 'start') {
    const milliseconds = Math.max(1_000, interval ?? 15_000)
    timer = setInterval(() => {
      scope.postMessage({ type: 'tick', timestamp: Date.now() })
    }, milliseconds)
  }
}

export {}
