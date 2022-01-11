import { createContext, useContext, ChangeEvent } from 'react'

export interface FormContextInterface {
  disabled: boolean,
  formId: string,
  handleSubmit(event: ChangeEvent<HTMLInputElement>): any,
  getErrors(): any,
  getFields(): object,
  getOneField(path: string): any,
  getOneUpdated(path: string): any,
  getOneError(path: string): boolean,
  hasUpdates(): boolean,
  hasErrors(): boolean,
  registerFieldObserver(path: string): void,
  render: string,
  resetForm(): void,
  setOneError(path: string, isError: boolean): void,
  setOneField(path: string, value: any): void,
  setOneUpdated(path: string): void,
  schemaValidation: object
}

export const FormContext = createContext<FormContextInterface | null>(null)
export const useForm = () => useContext(FormContext)

export interface ArrayContextInterface {
  validationPath: string
}

export const ArrayContext = createContext<ArrayContextInterface | null>(null)
export const useArray = () => useContext(ArrayContext)
