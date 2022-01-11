// Slightly refactored version of https://github.com/ramda/ramda/blob/v0.27.0/source/clone.js
export default function clone(value: any) {
  const type = (val: any) => {
    return val === null
      ? 'Null'
      : val === undefined
        ? 'Undefined'
        : Object.prototype.toString.call(val).slice(8, -1);
  }

  const cloneRegExp = (pattern: RegExp) => {
    return new RegExp(pattern.source, (pattern.global ? 'g' : '') +
      (pattern.ignoreCase ? 'i' : '') +
      (pattern.multiline ? 'm' : '') +
      (pattern.sticky ? 'y' : '') +
      (pattern.unicode ? 'u' : ''));
  }

  const _clone = (value: any) => {
    var copy = function copy(copiedValue: any) {
      for (var key in value)
        copiedValue[key] = _clone(value[key])

      return copiedValue;
    }
    switch (type(value)) {
      case 'Object': return copy({});
      case 'Array': return copy([]);
      case 'Date': return new Date(value.valueOf());
      case 'RegExp': return cloneRegExp(value);
      default: return value;
    }
  }

  return value != null && typeof value.clone === 'function'
    ? value.clone()
    : _clone(value);
}
