import { cloneElement, Children, useMemo } from "react"
import { useFrmX } from "./Contexts"

export default function RstX({
  children,
  ...rest
}) {
  const { resetForm, hasUpdates } = useFrmX()

  const props = {
    type: "button",
    disabled: !hasUpdates,
    onClick: resetForm,
    ...rest
  }

  return useMemo(() => Children.only(children) && Children.map(children, child => cloneElement(child, props)), [hasUpdates])
}
