import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from "react-dom/client"

import AutoPurchase from "~components/TopUp"

const seagmRegex =
  /^https?:\/\/(www\.)?seagm\.com(\/[a-zA-Z]{2}-[a-zA-Z]{2})?\/one-punch-man-the-strongest-sea-top-up(\?.*)?(\/|$)/

const renderContent = () => {
  const container = document.querySelector(".item_function")
  if (!container || !seagmRegex.test(window.location.href)) return
  const div = document.createElement("div")
  container.prepend(div)
  const root = createRoot(div)
  root.render(<AutoPurchase />)
}

if (document.readyState !== "loading") {
  renderContent()
} else {
  self?.addEventListener("DOMContentLoaded", renderContent)
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.seagm.com/*", "https://seagm.com/*"]
}

export default () => null
