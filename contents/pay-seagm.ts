import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"

import { storage } from "~storage"

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
  const password = await storage.get("password")
  const sCreditInput = document.querySelector(
    'input[value="scredits"]'
  ) as HTMLInputElement
  if (!password || sCreditInput?.disabled) {
    window.opener.postMessage("TOP_UP_FAILED", "*")
    return
  }

  $("#login_psw").val(password)
  $(".paynow").click()

  setTimeout(() => {
    // window.opener.postMessage("TOP_UP_SUCCESS", "*")
  }, 2000)

  setTimeout(() => {
    window.opener.postMessage("TOP_UP_FAILED", "*")
  }, 20000)
}

if (document.readyState !== "loading") {
  autoPay()
} else {
  self?.addEventListener("DOMContentLoaded", autoPay)
}
