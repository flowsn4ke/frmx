export const devEnvOnly = (fn) => (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && typeof fn === "function" && fn()
export const devEnvOnlyWarn = (str) => devEnvOnly(() => console.warn(str + " (This message won't pop up in production mode. See the docs here: https://www.frmx.io/docs)."))
export const noProviderFor = (el) => devEnvOnlyWarn(`You must be inside a <FrmX/> provider in order to use ${el}.`)
