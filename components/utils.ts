export const checkIsLoggedIn = () => {
  return Boolean(document.querySelector(".user-btn"))
}

export const getOrderNumber = (path: string) => {
  const url = new URL(`https://www.seagm.com${path}`)

  return Number(url.searchParams.get("buy_now_orders"))
}

export const getTradeId = (fromUrl: string) => {
  const url = new URL(fromUrl)

  return Number(url.searchParams.get("trade_id"))
}
