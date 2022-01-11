export const setEvent = (formId: string, path: string) => `frmx-${formId}-set-${path}`
export const resetEvent = (formId: string) => `form-${formId}-reset`
export const submitEvent = (formId: string) => `form-${formId}-invalid-submit`
