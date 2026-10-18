# AGENTS.md

## Project

- Static Vue 3 + Vite SPA that reads Xiaomi power banks over WebHID. No backend, no telemetry; keep device data local.
- Protocol was reverse-engineered from `powerbank.mieco.net`. Read `docs/REVERSE_ENGINEERING.md` before changing CRC, frames, commands, decoders, model tables, or battery-ID parsing.
- Public repo: `LOSRET/xiaomi-powerbank-console`, branch `main`. Deploy target is Cloudflare Pages (`dist`). The user handles deployment.

## Commands

- Node 22+ (`.nvmrc`). Use `npm install` / `npm ci`.
- `npm run dev` — use desktop Chrome, Edge, or Opera. WebHID is unavailable in Firefox, Safari, and mobile; use the in-app demo mode for UI work without hardware.
- Verify changes in this order: `npm run typecheck` → `npm test` → `npm run build`.
- Single test file: `npx vitest run src/tests/decoders.test.ts`; single test: `npx vitest run -t "<test name>"`.
- `npm run format` runs Prettier (no semicolons, single quotes, width 100).
- Pages smoke test after building: `npx wrangler pages dev dist --port 4175`, then check `/`, `/models`, `/exception-guide`, and asset cache headers.
- `npm run deploy` needs Cloudflare auth and publishes a live site. Do not run it unless explicitly asked.

## Architecture

- Entry: `src/main.ts` → `src/App.vue` → `src/router/index.ts`.
- `src/stores/device.ts` is the single owner of connection state, retries, heartbeat, history loading, and logs. Components must call store actions; do not send HID commands or re-implement decoding in components.
- HID layer: `src/lib/hid/webhid-transport.ts` (real device), `mock-transport.ts` (demo), `device-client.ts` (request/response correlation), `heartbeat.worker.ts` (background heartbeat).
- Protocol layer: `src/lib/protocol/` — `frames.ts`, `decoders.ts`, `crc8.ts`, `battery-id.ts`, `constants.ts`.
- Protocol data: `src/data/models.ts` and `src/data/batteryIdMaps.ts`.
- UI: `ConnectCard.vue` (connect/how-to), `DevicePanel.vue` (connected dashboard), `HomeView.vue` (layout), plus models and troubleshooting views. `@/` aliases `src/`.

## Gotchas

- `navigator.hid.requestDevice()` must stay on the click gesture path. Do not add an `await` before `WebHidTransport.request()` in the connect flow.
- Hello is a special 32-byte frame (timestamp + `xiaomi-pb` magic), not the generic `A5 CMD LEN payload CRC` frame. Generic reports are padded to 32 bytes and sent with report ID `0`.
- CRC is CRC-8/ATM (poly `0x07`, init `0`). Source vector: `A5 06 01 00` → `D9`. Do not “correct” it to `C8` from third-party notes.
- Response command is usually request command OR `0x10` (`0x01` → `0x11`), except `0x05` has no response and `0x0A` reuses Hello. `DeviceClient` resolves responses by expected command code.
- Heartbeat is a Web Worker every 15 s. Do not replace it with a page timer; background tabs throttle normal timers.
- `formatDeviceTime` intentionally formats the device's Beijing wall-clock seconds as UTC. Changing it to browser-local time breaks history display.
- Model quirks: `WPB1007ZX` hides cell serial and only exposes the first temperature sensor; its history before `1772323200` is filtered. Only model IDs `> 14` (and demo mode) request command `0x18`.
- Battery/cell/history decoding is length-sensitive. Preserve signed/LE reads and the cell-count nibble formula; add decoder tests for any change.
- The Qi2.2 toggle (`0x06` write / `0x07` status) is gated by `supportsQi2Toggle` on `WPB1025S` / `WPB1026S` only. Do not expose it for other models; it requires a confirmation modal and a status read-back.

## i18n And UX

- Every user-visible string must be added to both `src/data/i18n/zh-CN.ts` and `en.ts`. `en.ts` is typed as `Record<MessageKey, string>`, so missing keys fail typecheck.
- Keep `MockTransport` working for every command used by refresh/history/Qi2; it is the only way to verify the UI without a physical power bank.
- Read-only by default: no firmware/parameter writes except the model-gated Qi2.2 enable/disable control (`0x06`) for `WPB1025S` / `WPB1026S`; no arbitrary-command UI, no network calls or analytics.

## Testing And Deployment

- Tests run in Vitest's Node environment (no jsdom/browser). `src/tests/` covers CRC/frames, all decoders, and a full mock-device session.
- No physical-device CI. Real hardware remains unverified; protocol changes need unit coverage plus a manual device check when possible.
- Cloudflare Pages specifics: output is `dist`; `public/_redirects` provides SPA fallback; `public/_headers` sets caching/security headers; `wrangler.toml` with `pages_build_output_dir` is the Pages source of truth.
- `package.json` `allowScripts` entries for `esbuild` and `workerd` are intentional; keep them or local/CI installs may skip binaries.
- Do not commit `dist/`, `node_modules/`, `.wrangler/`, or `*.tsbuildinfo`. Do not push or deploy without an explicit request.
