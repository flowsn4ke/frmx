export const devEnvOnly = (fn) => (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && typeof fn === "function" && fn()

export const noProviderFor = (cmp) => devEnvOnly(() => console.warn(`You must be inside a <FrmX/> provider in order to use ${cmp}. See https://www.frmx.io/docs/quickstart`))
