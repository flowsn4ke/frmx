import React from "react";
import { Form, Field, FieldArray, Submit, Reset, useFieldObserver } from "frmx"
import { isEmail, isHexColor } from "validator"
import parsePhoneNumber from 'libphonenumber-js'

import {
  Box,
  Button,
  Checkbox,
  Slider,
  TextField,
  Typography
} from "@material-ui/core";
import useStyles from "./styles.js";
import PhoneInput from "./components/PhoneInput.js";

const fields = {
  name: "",
  email: "",
  phoneNumber: "",
  date: "2021-07-11",
  options: {
    arr: [""],
    obj: { 0: "" },
    colors: {
      main: "#ffbb00"
    },
    slider: 10,
    checked: true
  },
  newPassword: "",
  confirmedPassword: "",
  objInArr: []
};

const isTrue = (val) => val;

const validationMethods = {
  name: (val, form) => {
    return val.length > 3
    // implement some way to register observers inside validation?
    // now only reruns after some changes have been made to the field
    // ONLY BUBBLES UP RELATIONAL ERRORS UPON INVALID SUBMIT OR FIELD CHANGE
    // return form['options.checked']
  },
  email: (val) => isEmail(val),
  phoneNumber: val => {
    const n = parsePhoneNumber(val)
    if (n && !n?.isValid()) return false
    else return true
  },
  options: {
    checked: isTrue,
    colors: {
      main: isHexColor
    }
  },
  objInArr: {
    name: s => s.length > 3,
    email: (val) => isEmail(val),
  }
}

export default function Demo() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Form
        afterChange={(v, f, h, g) => console.log(g)}
        className={classes.formContainer}
        initialValues={fields}
        onSubmit={(values) => console.log(values)}
        onReset={(values) => console.log("reset")}
        // disabled
        // clearAfterSubmit
        disableIfInvalid
        // disabledIf={(data) => data.name === data.newPassword}
        disableIfNoUpdates
        onInvalidSubmit={() => alert("Invalid form!")}
        schemaValidation={validationMethods}
      >
        <Typography variant="h4" className={classes.input}>
          Some Meaningful Form
        </Typography>

        <Field path="date" type="date">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Date"
          />
        </Field>

        <Field path="options.slider" type="range" getValueFromArgs={args => args[1]}>
          <Slider valueLabelDisplay="auto" />
        </Field>

        <Field path="name" type="text" afterChange={console.log} isErrorProp="error">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Name"
          />
        </Field>

        <PhoneInput
          path="phoneNumber"
          className={classes.input}
          placeholder="Enter your number"
        />

        <Field path="email" isErrorProp="error" trim>
          <TextField
            className={classes.input}
            variant="outlined"
            label="me@email.com"
          />
        </Field>

        <Field path="options.obj.0">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Field Object"
          />
        </Field>

        <Field path="options.arr.0">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Field Array"
          />
        </Field>

        <SomeComponent path='options.colors.main' />

        <Box className={classes.checkboxContainer}>
          <Field path="options.checked" type="checkbox">
            <Checkbox className={classes.checkbox} />
          </Field>
        </Box>

        <ArrayStuff path="objInArr" />

        <Form
          initialValues={{ name: "I'm a nested form" }}
          onSubmit={data => console.log("Nested Form Submit")}
        >
          <Field path="name" type="text">
            <TextField
              className={classes.input}
              variant="outlined"
              label="Name"
            />
          </Field>

          <Submit>
            <Button variant="contained" className={classes.input}>
              Submit Nested Form
            </Button>
          </Submit>

        </Form>

        <Submit>
          <Button variant="contained" className={classes.input}>
            Submit
          </Button>
        </Submit>

        <Reset >
          <Button variant="contained" className={classes.input}>
            Reset
          </Button>
        </Reset>
      </Form>
    </Box>
  );
}

function SomeComponent({ path }) {
  const classes = useStyles();

  useFieldObserver("options.slider", f => console.log("observer1", f))

  return <Field path={path} type="color">
    <input className={classes.input} />
  </Field>
}

function ArrayStuff({ path }) {
  const classes = useStyles();

  const fieldVal = useFieldObserver("options.slider")
  console.log("observer2", fieldVal)

  return <FieldArray path={path} model={{ name: "", email: "" }}>
    {({ path, items, addItem, removeItem, disabled }) => (
      <Box>
        {items.map((item, i) => (
          <Box key={`unique-id-${i}`}>
            <Field path={`${path}.${i}.name`} isErrorProp="error">
              <TextField
                className={classes.input}
                variant="outlined"
                label="Name"
              />
            </Field>
            <Field path={`${path}.${i}.email`} isErrorProp="error">
              <TextField
                className={classes.input}
                variant="outlined"
                label="Email"
              />
            </Field>

            <Button disabled={disabled} onClick={() => removeItem(i)}>Remove</Button>
          </Box>
        ))}
        <Button disabled={disabled} onClick={addItem}>Add Person</Button>
      </Box>
    )}
  </FieldArray>
}
