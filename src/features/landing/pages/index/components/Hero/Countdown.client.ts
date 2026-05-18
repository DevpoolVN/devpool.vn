const DAY = 86_400_000
const HOUR = 3_600_000
const MIN = 60_000
const REFRESH_MS = 30_000

const pad2 = (n: number) => String(n).padStart(2, '0')

class DpCountdown extends HTMLElement {
  private target = 0
  private timer: number | undefined
  private slots: Partial<Record<'d' | 'h' | 'm', HTMLElement>> = {}

  connectedCallback() {
    this.target = new Date(this.dataset.to ?? '').getTime()
    if (Number.isNaN(this.target)) return

    this.slots = {
      d: this.querySelector<HTMLElement>('[data-slot="d"]') ?? undefined,
      h: this.querySelector<HTMLElement>('[data-slot="h"]') ?? undefined,
      m: this.querySelector<HTMLElement>('[data-slot="m"]') ?? undefined,
    }

    this.tick()
    this.timer = window.setInterval(() => this.tick(), REFRESH_MS)
  }

  disconnectedCallback() {
    if (this.timer !== undefined) window.clearInterval(this.timer)
  }

  private tick() {
    const diff = Math.max(0, this.target - Date.now())
    const d = Math.floor(diff / DAY)
    const h = Math.floor((diff % DAY) / HOUR)
    const m = Math.floor((diff % HOUR) / MIN)
    if (this.slots.d) this.slots.d.textContent = pad2(d)
    if (this.slots.h) this.slots.h.textContent = pad2(h)
    if (this.slots.m) this.slots.m.textContent = pad2(m)
  }
}

if (!customElements.get('dp-countdown')) {
  customElements.define('dp-countdown', DpCountdown)
}
