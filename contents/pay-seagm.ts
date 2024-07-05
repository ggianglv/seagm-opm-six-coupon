import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://pay.seagm.com/*"]
}

const regex = /^https:\/\/pay\.seagm\.com\/select\?from=seagm&trade_id=\d+$/

const autoPay = () => {
  console.log("auto pay")
}

if (document.readyState !== "loading") {
  autoPay()
} else {
  self?.addEventListener("DOMContentLoaded", autoPay)
}
