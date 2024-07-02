import "./style.css"
import "@mantine/core/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"

import PopupContent from "~components/PopupContent"

const theme = createTheme({})

const Popup = () => {
  return (
    <MantineProvider theme={theme}>
      <PopupContent />
    </MantineProvider>
  )
}

export default Popup
