import React from "react";
import { FrmX, FldX, ArrX, BtnX, RstX } from "frmx";
import { isEmail, isHexColor } from "validator";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography
} from "@material-ui/core";
import useStyles from "./styles.js";

const fields = {
  name: "",
  email: "",
  date: "2021-07-11",
  options: {
    arr: [""],
    obj: { 0: "" },
    colors: {
      main: "#ffbb00"
    },
    checked: true
  },
  newPassword: "",
  confirmedPassword: "",
  objInArr: []
};

const isTrue = (val) => val;

const validationMethods = {
  email: isEmail,
  options: {
    checked: isTrue,
    colors: {
      main: isHexColor
    }
  }
};

export default function Demo() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <FrmX
        className={classes.formContainer}
        updatesOnly
        initialValues={fields}
        onSubmit={(values) => console.log(values)}
        onReset={(values) => console.log(values)}
        // disableSubmitIfInvalid
        // disabledIf={(formData) => formData.name === formData.newPassword}
        // disableIfNoUpdates
        onInvalidSubmit={() => alert("Invalid form!")}
        schemaValidation={validationMethods}
      >
        <Typography variant="h4" className={classes.input}>
          Some Meaningful Form
        </Typography>

        <FldX field="date" type="date">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Date"
          />
        </FldX>

        <FldX field="name" type="text">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Name"
          />
        </FldX>

        <FldX field="email" type="text" isErrorProp="error">
          <TextField
            className={classes.input}
            variant="outlined"
            label="me@email.com"
          />
        </FldX>

        <FldX field="options.obj.0">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Field Object"
          />
        </FldX>

        <FldX field="options.arr.0">
          <TextField
            className={classes.input}
            variant="outlined"
            label="Field Array"
          />
        </FldX>

        <FldX field="options.colors.main" type="color">
          <input className={classes.input} />
        </FldX>

        <Box className={classes.checkboxContainer}>
          <FldX field="options.checked" type="checkbox">
            <Checkbox className={classes.checkbox} />
          </FldX>
        </Box>

        <ArrX startWithOneMore field="objInArr" model={{ name: "", email: "" }}>
          {({ field, items, addItem, removeItem }) => (
            <Box>
              {items.map((item, i) => (
                <Box key={`unique-id-${i}`}>
                  <FldX field={`${field}.${i}.name`}>
                    <TextField
                      className={classes.input}
                      variant="outlined"
                      label="Name"
                    />
                  </FldX>
                  <FldX field={`${field}.${i}.email`}>
                    <TextField
                      className={classes.input}
                      variant="outlined"
                      label="Email"
                    />
                  </FldX>

                  <Button onClick={() => removeItem(i)}>Remove</Button>
                </Box>
              ))}
              <Button onClick={addItem}>Add Person</Button>
            </Box>
          )}
        </ArrX>

        <BtnX>
          <Button variant="contained" className={classes.input}>
            Submit
          </Button>
        </BtnX>

        <RstX>
          <Button variant="contained" className={classes.input}>
            Reset
          </Button>
        </RstX>
      </FrmX>
    </Box>
  );
}
