import { Button, rem, Tooltip } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import {
  changeCurrency,
  checkout,
  gameTopUpBuy,
  getCredits,
  getCsrfToken
} from "~components/api"
import { getOrderNumber, getTradeId } from "~components/utils"

const uidRegex = /^\d{8}_\d{6}$/

const PRICE = 276

const TopUpContent = () => {
  const [uid, setUid] = useState("12670357_310594")
  const [password, setPassword] = useState("12123123")
  const [processing, setProcessing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      changeCurrency()
    }
  }, [isLoggedIn])

  useEffect(() => {
    const userBtn = document.querySelector("#user-btn")
    setIsLoggedIn(Boolean(userBtn))
  }, [])

  useEffect(() => {
    getCredits().then((credits) => {
      console.log(credits, "credits")
    })
  }, [])

  const handleStart = async () => {
    try {
      setProcessing(true)
      const path = await gameTopUpBuy(uid)
      const csrfToken = await getCsrfToken(path)
      const orderNumber = getOrderNumber(path)
      const checkoutUrl = await checkout(orderNumber, csrfToken)
      console.log(checkoutUrl)
      // const tradeId = getTradeId(checkoutUrl)
      // console.log(tradeId, checkoutUrl, "urlll")
    } catch (e) {
      console.log(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleRedirectToGithub = () => {
    window.open("https://github.com")
  }

  const buttonTooltip = useMemo(() => {
    if (!uid) return "Please enter your UID"
    if (!password) return "Please enter your Seagm password"
    if (!uidRegex.test(uid)) return "Invalid UID"
    return ""
  }, [uid, password])

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

        <div className="field">
          <label className="cpt-text">
            <span>UID</span>
            <input
              onChange={(e) => setUid(e.target.value)}
              value={uid}
              type="text"
              className="tukifield userFieldParam "
              placeholder="Please enter UID"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="field">
          <label className="cpt-text">
            <span>PW</span>
            <input
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              value={password}
              type="password"
              className="tukifield userFieldParam"
              placeholder="Please enter Password"
            />
          </label>
        </div>

        {buttonTooltip ? (
          <Tooltip label={buttonTooltip}>
            <Button
              onClick={handleStart}
              disabled={Boolean(buttonTooltip)}
              className="mt-[10px]"
              fullWidth={false}>
              Start
            </Button>
          </Tooltip>
        ) : (
          <Button
            onClick={handleStart}
            disabled={Boolean(buttonTooltip)}
            className="mt-[10px]"
            fullWidth={false}>
            Start
          </Button>
        )}
      </div>
    </div>
  )
}

export default React.memo(TopUpContent)
