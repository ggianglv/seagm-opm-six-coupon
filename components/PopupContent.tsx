import { Button, Checkbox, rem, TextInput } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import React from "react"

const PopupContent = () => {
  return (
    <div className="w-[250px] flex flex-col gap-[8px] p-[16px]">
      <div className="flex items-center gap-1">
        <div className="text-[16px] font-medium">Seagm 6 coupon spam</div>

        <IconBrandGithub
          className="cursor-pointer"
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      </div>

      <TextInput size="xs" label="UID" placeholder="UID" />
      <TextInput size="xs" label="SID" placeholder="SID" />

      <Checkbox size="xs" defaultChecked label="Save" />

      <Button className="mt-[10px]" fullWidth={false}>
        Start
      </Button>
    </div>
  )
}

export default React.memo(PopupContent)
