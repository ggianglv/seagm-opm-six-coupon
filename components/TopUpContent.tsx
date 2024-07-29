import { rem } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import React, { useEffect, useRef, useState } from "react"

import {
  changeCurrency,
  checkout,
  gameTopUpBuy,
  getCredits,
  getCsrfToken
} from "~components/api"
import TopUpForm from "~components/TopUpForm"
import TopUpProgress from "~components/TopUpProgress"
import { getOrderNumber, getTradeId, sleep } from "~components/utils"
import { storage } from "~storage"

const TopUpContent = () => {
  const [processing, setProcessing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [completed, setCompleted] = useState(0)
  const [message, setMessage] = useState("")
  const shouldProcess = useRef(false)

  useEffect(() => {
    const userBtn = document.querySelector("#user-btn")
    setIsLoggedIn(Boolean(userBtn))
  }, [])

  const handleRedirectToGithub = () => {
    window.open("https://github.com/ggianglv/seagm-opm-six-coupon")
  }

  useEffect(() => {
    setIsLoading(true)
    getCredits()
      .then((credits) => {
        setCredits(+credits.replace(/,/g, ""))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const processOrder = (uid: string) => {
    return new Promise(async (resolve, reject) => {
      const path = await gameTopUpBuy(uid)
      const csrfToken = await getCsrfToken(path)
      const orderNumber = getOrderNumber(path)
      const checkoutUrl = await checkout(orderNumber, csrfToken)
      const tradeId = getTradeId(checkoutUrl)
      await storage.set("tradeId", tradeId.toString())

      const iframe = document.createElement("iframe")
      iframe.src = checkoutUrl
      iframe.style.visibility = "hidden"
      iframe.style.position = "absolute"
      iframe.style.top = "0px"
      document.body.appendChild(iframe)

      const handleMessage = (message: any) => {
        if (message.data === "TOP_UP_SUCCESS") {
          window.removeEventListener("message", handleMessage)
          document.body.removeChild(iframe)
          resolve(true)
        }

        if (message.data === "TOP_UP_FAILED") {
          document.body.removeChild(iframe)
          window.removeEventListener("message", handleMessage)
          reject(false)
        }
      }
      window.addEventListener("message", handleMessage)
    })
  }

  const handleStart = async (uid: string) => {
    try {
      setProcessing(true)
      await changeCurrency()
      shouldProcess.current = true
      for (let i = 0; i < quantity; i++) {
        if (!shouldProcess.current) break
        await processOrder(uid)
        setCompleted((prev) => prev + 1)
        await sleep(3000)
      }
    } catch (e) {
      shouldProcess.current = false
      setMessage("Something went wrong, please refresh and try again!")
    }
  }

  const handleCancel = () => {
    shouldProcess.current = false
    setQuantity(0)
    setMessage("")
    setProcessing(false)
    setIsLoading(true)
    getCredits()
      .then((credits) => {
        setCredits(+credits.replace(/,/g, ""))
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="order">
      <div className="flex flex-col gap-[8px] p-[16px]">
        <div className="flex items-center gap-1">
          <div className="text-[16px] font-medium">Seagm 6 coupon spammer</div>
          <IconBrandGithub
            onClick={handleRedirectToGithub}
            className="cursor-pointer"
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        </div>

        {message && <div className="text-yellow-200">{message}</div>}

        {(() => {
          if (processing) {
            return (
              <TopUpProgress
                handleCancel={handleCancel}
                completed={completed}
                quantity={quantity}
              />
            )
          }

          return (
            <TopUpForm
              quantity={quantity}
              setQuantity={setQuantity}
              credits={credits}
              handleStart={handleStart}
              isLoggedIn={isLoggedIn}
              isLoading={isLoading}
            />
          )
        })()}
      </div>
    </div>
  )
}

export default React.memo(TopUpContent)
