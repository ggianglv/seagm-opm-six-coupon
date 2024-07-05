export const gameTopUpBuy = (uid: string) => {
  let bodyText =
    '------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="category_id"\r\n\r\n984\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="topupType"\r\n\r\n6109\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="type_id"\r\n\r\n6109\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="userid"\r\n\r\nUID\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="zoneid"\r\n\r\nSID\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="section"\r\n\r\nbuy_now\r\n------WebKitFormBoundaryoI7932MtHttpIh0C\r\nContent-Disposition: form-data; name="promotion_name"\r\n\r\nSearch Results:Related game top up\r\n------WebKitFormBoundaryoI7932MtHttpIh0C--\r\n'

  bodyText = bodyText.replace("UID", uid)
  bodyText = bodyText.replace("SID", uid.split("_")[1])

  return fetch("https://www.seagm.com/vi-vn/directtopup/game_topup_buy", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en,vi;q=0.9,ja;q=0.8,en-US;q=0.7,la;q=0.6",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundaryoI7932MtHttpIh0C",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    referrer:
      "https://www.seagm.com/vi-vn/one-punch-man-the-strongest-sea-top-up?ps=Search-Results:Related-game-top-up",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: bodyText,
    method: "POST",
    mode: "cors",
    credentials: "include"
  })
    .then((res) => res.json())
    .then((res) => res[1].redirect[0][0])
}

export const getCsrfToken = async (path: string) => {
  const html = await fetch(`https://www.seagm.com${path}`).then((res) =>
    res.text()
  )
  const domParser = new DOMParser()
  const document = domParser.parseFromString(html, "text/html")
  const csrfInput = document.querySelector(
    "input[name='csrfToken']"
  ) as HTMLInputElement
  return csrfInput?.value || ""
}

export const checkout = (order: number, csrfToken: string) => {
  const body = {
    checkOnOrders: [order],
    checkOnProductIds: ["984-6109"],
    cartAction: "checkOut",
    csrfToken: csrfToken,
    selected_coupons: undefined,
    bundle_key: undefined
  } as any

  return fetch(
    `https://www.seagm.com/vi-vn/cart/checkout?buy_now_orders=${order}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      body: new URLSearchParams(body).toString()
    }
  )
    .then((res) => res.json())
    .then((res) => res[0].redirect[0][0])
}

export const getCredits = async () => {
  const html = await fetch("https://www.seagm.com/vi-vn/member").then((res) =>
    res.text()
  )
  const domParser = new DOMParser()
  const document = domParser.parseFromString(html, "text/html")
  const credits = document.querySelector("[icon-brand='seagmcredits']")

  return credits?.textContent || "0"
}

export const getChangeLanguageUrl = async () => {
  const html = await fetch(
    "https://www.seagm.com/vi-vn/language_currency"
  ).then((res) => res.text())
  const domParser = new DOMParser()
  const document = domParser.parseFromString(html, "text/html")
  const form = document.querySelector('form[method="post"]') as HTMLFormElement

  return form.action
}

export const changeCurrency = async () => {
  const url = await getChangeLanguageUrl()
  const data = new FormData()
  data.append("region", "vn")
  data.append("language", "vi")
  data.append("currency", "VND")

  await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml"
    },
    body: data,
    method: "POST",
    mode: "cors",
    credentials: "include"
  })
}
