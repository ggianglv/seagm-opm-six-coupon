import React from "react"

import "../style.css"
import "@mantine/core/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"

import TopUpContent from "~components/TopUpContent"

const theme = createTheme({})

const TopUp = () => {
  return (
    <MantineProvider theme={theme}>
      <TopUpContent />
    </MantineProvider>
  )
}

export default React.memo(TopUp)
