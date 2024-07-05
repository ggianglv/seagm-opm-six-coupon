import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://pay.seagm.com/*"]
}

const waitForElm = (selector: string) => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect()
        resolve(document.querySelector(selector))
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

const autoPay = async () => {
  const url = new URL(window.location.href)
  const tradeId = url.searchParams.get("trade_id")
  if (!tradeId) return
  await waitForElm(".paynow")
  $("#login_psw").val("123131312afdsfsd3")
  // $(".paynow").click()
  setTimeout(() => {
    window.opener.postMessage("TOP_UP_SUCCESS", "*")
  }, 5000)
}

if (document.readyState !== "loading") {
  autoPay()
} else {
  self?.addEventListener("DOMContentLoaded", autoPay)
}
