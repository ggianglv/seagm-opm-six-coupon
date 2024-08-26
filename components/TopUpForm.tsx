import { Button, NumberInput, Tooltip } from "@mantine/core"
import { IconHelpOctagon } from "@tabler/icons-react"
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react"

import { storage } from "~storage"

const uidRegex = /^\d{8}_\d{6}$/

const PRICE = 261

interface TopUpFormProps {
  credits: number
  handleStart: (uid: string) => Promise<void>
  isLoggedIn: boolean
  isLoading: boolean
  quantity: number
  setQuantity: (value: number) => void
}

const TopUpForm = ({
  credits,
  handleStart,
  isLoggedIn,
  isLoading,
  quantity,
  setQuantity
}: TopUpFormProps) => {
  const [uid, setUid] = useState("")
  const [password, setPassword] = useState("")

  const handleClickMax = () => {
    setQuantity(Math.floor(credits / PRICE))
  }

  const buttonTooltip = useMemo(() => {
    if (!isLoggedIn) return "Please login to Seagm"
    if (!uid) return "Please enter your UID"
    if (!password) return "Please enter your Seagm password"
    if (!uidRegex.test(uid)) return "Invalid UID"
    if (credits < PRICE * quantity) return "Not enough credits"
    if (quantity <= 0) return "Quantity must be greater than 0"
    if (isLoading) return "Loading credits..."
    return ""
  }, [uid, password, isLoggedIn, credits, quantity, isLoading])

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    storage.set("password", e.target.value)
  }

  useEffect(() => {
    setQuantity(Math.min(Math.floor(credits / PRICE), 1))
  }, [credits])

  return (
    <div className="flex flex-col gap-[8px]">
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
            onChange={handleChangePassword}
            value={password}
            type="password"
            className="tukifield userFieldParam"
            placeholder="Please enter Seagm Password"
          />
        </label>
      </div>

      <div>Your Seagm credits: {credits}</div>

      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center gap-[4px]">
          <span>Orders</span>

          <Tooltip label={`${PRICE} Seagm credits per order`}>
            <IconHelpOctagon style={{ width: 20, height: 20 }} />
          </Tooltip>
        </div>
        <div className="flex items-center gap-[4px]">
          <NumberInput
            value={quantity}
            onChange={(value) => setQuantity(+value)}
            size="xs"
            style={{ width: 80 }}
          />
          <Button onClick={handleClickMax} color="gray" size="xs">
            Max
          </Button>
        </div>
      </div>

      {buttonTooltip ? (
        <Tooltip label={buttonTooltip}>
          <Button
            onClick={() => handleStart(uid)}
            disabled={Boolean(buttonTooltip)}
            className="mt-[10px]"
            fullWidth={false}>
            Start
          </Button>
        </Tooltip>
      ) : (
        <Button
          loading={isLoading}
          onClick={() => handleStart(uid)}
          disabled={Boolean(buttonTooltip)}
          className="mt-[10px]"
          fullWidth={false}>
          Start
        </Button>
      )}
    </div>
  )
}

export default React.memo(TopUpForm)
