import React from 'react'

export interface FormContextInterface {
  disabled: boolean,
  formId: string,
  handleSubmit(event: React.ChangeEvent<HTMLInputElement>): any,
  getErrors(): any,
  getFields(): object,
  getOneField(path: string): any,
  getOneUpdated(path: string): any,
  getOneError(path: string): boolean,
  getUpdatesList(): string[],
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

export const FormContext = React.createContext<FormContextInterface | null>(null)
export const useForm = () => React.useContext(FormContext)

export interface ArrayContextInterface {
  validationPath: string
}

export const ArrayContext = React.createContext<ArrayContextInterface | null>(null)
export const useArray = () => React.useContext(ArrayContext)
