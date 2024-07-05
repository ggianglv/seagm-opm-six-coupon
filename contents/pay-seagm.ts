import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"

import { sleep } from "~components/utils"
import { storage } from "~storage"

export const config: PlasmoCSConfig = {
  matches: ["https://pay.seagm.com/*", "https://www.pay.seagm.com/*"]
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
  await sleep(3000)
  if (!password || sCreditInput?.disabled) {
    window.opener.postMessage("TOP_UP_FAILED", "*")
    return
  }

  $("#login_psw").val(password)
  $(".paynow").click()

  setTimeout(() => {
    window.opener.postMessage("TOP_UP_FAILED", "*")
  }, 20000)
}

if (document.readyState !== "loading") {
  autoPay()
} else {
  document.addEventListener("DOMContentLoaded", autoPay)
}

const checkSuccess = async () => {
  const currentTradeId = await storage.get("tradeId")
  const url = new URL(window.location.href)
  if (
    +currentTradeId === +url.searchParams.get("trade_id") &&
    window.location.href.includes("seagm/success")
  ) {
    window.opener.postMessage("TOP_UP_SUCCESS", "*")
  }
}

if (document.readyState !== "loading") {
  checkSuccess()
} else {
  document.addEventListener("DOMContentLoaded", checkSuccess)
}
