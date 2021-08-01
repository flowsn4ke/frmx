import React, { useMemo, useState } from 'react';
import { useFrmX } from 'frmx';
import parsePhoneNumber, { AsYouType } from 'libphonenumber-js'
import Flag from 'react-flagkit'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, InputBase, ButtonBase, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons';
import clsx from "clsx"

const countries = [
  { code: "FR", prefix: "+33", name: "France" },
  { code: "US", prefix: "+1", name: "United State" },
  { code: "GB", prefix: "+44", name: "United Kingdom" },
  { code: "RU", prefix: "+7", name: "Russia" },
]

const useStyles = makeStyles((theme) => ({
  root: ({ isFocused, isHovered, isError }) => ({
    display: 'flex',
    height: 56,
    alignItems: 'center',
    width: "100%",
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: isFocused ? 2 : 1,
    borderColor: isError
      ? theme.palette.error.main
      : isFocused
        ? theme.palette.primary.main
        : isHovered
          ? "rgba(0, 0, 0, 0.87)"
          : "rgba(0, 0, 0, 0.23)"
  }),
  input: {
    paddingLeft: "1em",
    width: "100%"
  },
  countrySelect: {
    height: "100%",
    paddingLeft: "2em",
    paddingRight: "1em",
  },
  dropDownIcon: {
    marginLeft: ".3em"
  }
}));

export default function PhoneInput({ field, className, placeholder = "" }) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [country, setCountry] = useState('FR')
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const {
    setOneField,
    setOneVisited,
    getOneVisited,
    getOneError,
    setOneError
  } = useFrmX()

  const isError = useMemo(() => {
    return getOneError(field) && getOneVisited(field)
  }, [field, getOneError, getOneVisited])

  const handleChange = (e) => {
    const newDisplayVal = new AsYouType(country).input(e.target.value)
    setPhoneNumber(newDisplayVal)
    const n = parsePhoneNumber(newDisplayVal, country)

    if (n) {
      setCountry(n.country)
      setOneError(field, !n.isValid())
      setOneField(field, n.number)
    }
  }

  const handleBlur = (e) => {
    handleChange(e)
    setOneVisited(field)
  }

  const closeMenu = () => setAnchorEl(null)

  const classes = useStyles({ isFocused, isHovered, isError })

  return <>
    <Box className={clsx(classes.root, className)}>
      <ButtonBase
        className={classes.countrySelect}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Flag country={country} />
        <ArrowDropDownIcon className={classes.dropDownIcon} />
      </ButtonBase>
      <Divider orientation="vertical" />
      <Box className={classes.input}>
        <InputBase
          type="tel"
          value={phoneNumber}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            handleBlur(e)
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classes.input}
          placeholder={placeholder}
        />
      </Box>
    </Box>
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={!!anchorEl}
      onClose={closeMenu}
    >
      {countries.map((c, i) => <MenuItem
        key={`country-prefix-${c.name}-${i}`}
        onClick={() => {
          setCountry(c.code)
          setPhoneNumber(c.prefix)
          closeMenu()
        }}>{c.name}</MenuItem>)}
    </Menu>
  </>
}
