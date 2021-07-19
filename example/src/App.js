import React from 'react'
import { FrmX, FldX, BtnX } from 'frmx'
import { isEmail } from 'validator'
import { Box, Button, Checkbox, TextField, Typography } from "@material-ui/core"
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

const isTrue = val => val

const validationMethods = {
  email: isEmail,
  options: {
    checked: isTrue,
    breakfast: (str) => str.length > 10
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
        disableIf={formData => formData.options.breakfast.length < 15}
        disableSubmitIfInvalid
        // onInvalidSubmit={() => alert("invalid form")}
        schemaValidation={validationMethods}
      >
        <Typography variant="h4" className={classes.input}>
          Some Meaningful Form
        </Typography>

        <FldX field="date" type="date" >
          <TextField className={classes.input} variant="outlined" label="Date" />
        </FldX>

        <FldX field="name" type="text" required>
          <TextField className={classes.input} variant="outlined" label="Name" />
        </FldX>

        <FldX field="email" type="text" isErrorProp="error">
          <TextField className={classes.input} variant="outlined" label="me@email.com" />
        </FldX>

        <FldX field="options.breakfast" type="text" required>
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
