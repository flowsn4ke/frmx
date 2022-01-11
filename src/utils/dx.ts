export const devEnvOnly = (fn: () => void) => (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && fn()
export const warnDev = (str: string) => devEnvOnly(() => console.warn(str + " (This message won't pop up in production mode. See the docs here: https://www.frmx.io/docs)."))
export const noProviderFor = (el: string) => warnDev(`You must be inside a <FrmX/> provider in order to use ${el}.`)
