export function pickProperties(obj, [...props]) {
  return props.reduce(function (result, prop) {
    result[prop] = obj[prop];
    return result;
  }, {});
}
