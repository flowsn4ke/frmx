import { useEffect, useRef } from "react";
import { deepDiff } from "../utils/diff"

export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      const diff = deepDiff(previousProps.current, props)
      if (Object.keys(diff).length) console.log("[why-did-you-update]", name, diff);
    }
    previousProps.current = props;
  });
}
