interface SubmitWindow extends Window {
  __dpRegisterInit?: boolean
}

const w = window as SubmitWindow
if (!w.__dpRegisterInit) {
  w.__dpRegisterInit = true
  init()
}

function init() {
  const form = document.getElementById('regForm') as HTMLFormElement | null
  if (!form) return

  const endpoint = form.dataset.endpoint
  const eventCode = form.dataset.event ?? ''
  const status = document.getElementById('regStatus') as HTMLElement | null
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const submitLabel = submitBtn?.textContent ?? ''

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (!endpoint) {
      setStatus(status, 'error', 'Form chưa được cấu hình endpoint. Liên hệ ban tổ chức nhé.')
      return
    }

    setStatus(status, 'loading', 'Đang gửi…')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.setAttribute('aria-busy', 'true')
      submitBtn.textContent = 'ĐANG GỬI…'
    }

    try {
      const data = new FormData(form)
      // Checkbox unchecked → field absent. Chuẩn hoá ra 'yes'/'' cho rõ.
      data.set('consent', form.querySelector<HTMLInputElement>('input[name="consent"]')?.checked ? 'yes' : '')
      if (eventCode) data.set('event', eventCode)
      data.set('ua', navigator.userAgent)
      data.set('referer', document.referrer)

      const res = await fetch(endpoint, { method: 'POST', body: data })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }

      if (!res.ok || !json.ok) {
        throw new Error(json.error || `HTTP ${res.status}`)
      }

      form.reset()
      setStatus(status, 'success', '✓ Đã ghi nhận! Tụi mình sẽ gửi email xác nhận trong vài phút tới.')
    } catch (err) {
      setStatus(status, 'error', `Gửi thất bại: ${err instanceof Error ? err.message : 'lỗi không xác định'}. Thử lại nhé.`)
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.removeAttribute('aria-busy')
        submitBtn.textContent = submitLabel
      }
    }
  })
}

type StatusKind = 'loading' | 'success' | 'error'

function setStatus(el: HTMLElement | null, kind: StatusKind, message: string) {
  if (!el) return
  el.dataset.state = kind
  el.textContent = message
  el.hidden = false
}
