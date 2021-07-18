import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { createTheme, ThemeProvider, CssBaseline } from "@material-ui/core"

const theme = createTheme()

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
  ,
  document.getElementById('root')
)
