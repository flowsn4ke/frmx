import React from 'react'
import { render } from 'react-dom'
import Demo from './Demo'
import { createTheme, ThemeProvider, CssBaseline } from "@material-ui/core"

const theme = createTheme()

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Demo />
  </ThemeProvider>
  ,
  document.getElementById('root')
)
