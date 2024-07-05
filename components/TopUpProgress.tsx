import { Button, Progress } from "@mantine/core"
import React from "react"

interface TopUpProgressProps {
  completed: number
  quantity: number
  handleCancel: () => void
}

const TopUpProgress = ({
  completed,
  quantity,
  handleCancel
}: TopUpProgressProps) => {
  return (
    <div className="flex flex-col gap-[8px] mt-[10px]">
      {completed === quantity ? (
        <div>Completed {quantity} orders</div>
      ) : (
        <div>
          Processing order {completed + 1}/{quantity}
        </div>
      )}

      <Progress radius="xs" value={(completed / quantity) * 100} />

      <Button
        color="red"
        onClick={handleCancel}
        className="mt-[10px]"
        fullWidth={false}>
        Cancel
      </Button>
    </div>
  )
}

export default React.memo(TopUpProgress)
