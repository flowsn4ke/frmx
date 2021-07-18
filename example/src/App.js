import React from 'react'
import { FrmX, FldX, BtnX } from 'frmx'
import { isEmail, isHexColor } from 'validator'
import { Box, Button, Checkbox, TextField } from "@material-ui/core"
import useStyles from "./styles.js"

const fields = {
  name: "",
  email: "",
  date: "2021-07-11",
  options: {
    breakfast: "",
    colors: {
      main: "#ffbb00"
    },
    checked: true
  }
}

export default function App() {
  const classes = useStyles()

  return (
    <Box className={classes.container}>

      <FrmX
        className={classes.formContainer}
        updatesOnly
        initialValues={fields}
        onSubmit={values => alert(JSON.stringify(values, null, 2))}
      >

        <FldX field="date" type="date" >
          <TextField className={classes.input} variant="outlined" label="Date" />
        </FldX>

        <FldX field="name" type="text" required>
          <TextField className={classes.input} variant="outlined" label="Name" />
        </FldX>

        <FldX field="email" type="text" validate={isEmail}>
          <TextField className={classes.input} variant="outlined" label="me@email.com" />
        </FldX>

        <FldX field="options.breakfast" type="text">
          <TextField className={classes.input} variant="outlined" label="Breakfast" />
        </FldX>

        <FldX field="options.colors.main" type="color">
          <input className={classes.input} />
        </FldX>

        <Box className={classes.checkboxContainer}>
          <FldX field="options.checked" type="checkbox">
            <Checkbox className={classes.checkbox} />
          </FldX>
        </Box>


        <BtnX>
          <Button variant="contained" className={classes.input}>Submit</Button>
        </BtnX>

      </FrmX>

    </Box >
  )
}
