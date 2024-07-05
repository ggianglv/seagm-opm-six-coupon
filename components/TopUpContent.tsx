import { Button, NumberInput, rem, Tooltip } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { getCredits } from "~components/api"
import TopUpForm from "~components/TopUpForm"
import TopUpProgress from "~components/TopUpProgress"
import { sleep } from "~components/utils"

const TopUpContent = () => {
  const [processing, setProcessing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [completed, setCompleted] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const userBtn = document.querySelector("#user-btn")
    setIsLoggedIn(Boolean(userBtn))
  }, [])

  const handleRedirectToGithub = () => {
    window.open("https://github.com")
  }

  useEffect(() => {
    setIsLoading(true)
    getCredits()
      .then((credits) => {
        setCredits(10000)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const processOrder = () => {
    return new Promise((resolve, reject) => {
      // const path = await gameTopUpBuy(uid)
      // const csrfToken = await getCsrfToken(path)
      // const orderNumber = getOrderNumber(path)
      // const checkoutUrl = await checkout(orderNumber, csrfToken)
      const checkoutUrl =
        "https://pay.seagm.com/vi-vn/select?from=seagm&trade_id=55922731"

      const checkoutWindow = window.open(checkoutUrl)

      const handleMessage = (message: any) => {
        if (message.data === "TOP_UP_SUCCESS") {
          checkoutWindow.close()
          window.removeEventListener("message", handleMessage)
          resolve(true)
        }
      }
      window.addEventListener("message", handleMessage)

      setInterval(() => {
        if (checkoutWindow.closed) reject(false)
      }, 100)
    })
  }

  const handleStart = async () => {
    try {
      setProcessing(true)
      for (let i = 0; i < quantity; i++) {
        await processOrder()
        setCompleted((prev) => prev + 1)
        await sleep(3000)
      }
    } catch (e) {
      setMessage("Something went wrong, please refresh and try again!")
    }
  }

  const handleCancel = () => {
    setQuantity(0)
    setMessage("")
    setProcessing(false)
    setIsLoading(true)
    getCredits()
      .then((credits) => {
        setCredits(+credits)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="order">
      <div className="flex flex-col gap-[8px] p-[16px]">
        <div className="flex items-center gap-1">
          <div className="text-[16px] font-medium">Seagm 6 coupon spam</div>
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
