import { makeStyles } from "@material-ui/core"

export default makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "mistyrose",
    margin: 0,
    padding: 0,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
    width: "50%",
    maxWidth: "500px"
  },
  input: {
    margin: "1em 0em",
    width: "100%"
  },
  checkboxContainer: {
    width: "100%",
    textAlign: "center"
  }
})
