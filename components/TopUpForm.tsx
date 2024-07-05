import { Button, NumberInput, Tooltip } from "@mantine/core"
import React, { useEffect, useMemo, useState } from "react"

const uidRegex = /^\d{8}_\d{6}$/

const PRICE = 276

interface TopUpFormProps {
  credits: number
  handleStart: () => Promise<void>
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
  const [uid, setUid] = useState("12670357_310594")
  const [password, setPassword] = useState("12123123")

  const handleClickMax = () => {
    setQuantity(Math.floor(credits / PRICE))
  }

  const buttonTooltip = useMemo(() => {
    if (!uid) return "Please enter your UID"
    if (!password) return "Please enter your Seagm password"
    if (!uidRegex.test(uid)) return "Invalid UID"
    if (!isLoggedIn) return "Please login to Seagm"
    if (credits < PRICE * quantity) return "Not enough credits"
    if (quantity <= 0) return "Quantity must be greater than 0"
    if (isLoading) return "Loading credits..."
    return ""
  }, [uid, password, isLoggedIn, credits, quantity, isLoading])

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

      <div>Your Seagm credits: {credits}</div>

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
          loading={isLoading}
          onClick={handleStart}
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
