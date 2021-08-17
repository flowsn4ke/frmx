import React, { useRef, useState } from 'react'
import parsePhoneNumber, { AsYouType } from 'libphonenumber-js'
import Flag from 'react-flagkit'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Divider, InputBase, ButtonBase, Menu, MenuItem } from '@material-ui/core'
import { ArrowDropDown as ArrowDropDownIcon } from '@material-ui/icons'
import clsx from 'clsx'
import { useFldX } from 'frmx'

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
  const {
    value,
    setValue,
    error,
    disabled
  } = useFldX(field)

  const [country, setCountry] = useState('FR')
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleChange = useRef((e) => {
    const newDisplayVal = new AsYouType(country).input(e.target.value)
    setValue(newDisplayVal)
    const n = parsePhoneNumber(newDisplayVal, country)

    if (!!n) {
      setCountry(n.country)
    }
  })

  const closeMenu = useRef(() => setAnchorEl(null))
  const classes = useStyles({ isFocused, isHovered, isError: error })

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
          disabled={disabled}
          value={value}
          onChange={handleChange.current}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      onClose={closeMenu.current}
    >
      {countries.map((c, i) => <MenuItem
        key={`country-prefix-${c.name}-${i}`}
        onClick={() => {
          setCountry(c.code)
          setValue(c.prefix)
          closeMenu.current()
        }}>{c.name}</MenuItem>)}
    </Menu>
  </>
}
