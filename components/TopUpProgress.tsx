import { Button, Progress } from "@mantine/core"
import { IconLoader2 } from "@tabler/icons-react"
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
  const isDone = completed === quantity

  return (
    <div className="flex flex-col gap-[8px] mt-[10px]">
      {isDone ? (
        <div>Completed {quantity} orders</div>
      ) : (
        <div className="flex items-center gap-[4px]">
          <IconLoader2 className="w-[16px] animate-spin" />
          Processing order {completed + 1}/{quantity}
        </div>
      )}

      <Progress radius="xs" value={(completed / quantity) * 100} />

      <Button
        color={isDone ? "gray" : "red"}
        onClick={handleCancel}
        className="mt-[10px]"
        fullWidth={false}>
        {isDone ? "Done" : "Cancel"}
      </Button>
    </div>
  )
}

export default React.memo(TopUpProgress)
