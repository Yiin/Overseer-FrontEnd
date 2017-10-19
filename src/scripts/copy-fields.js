export default function copyFields(fromObj, toObj) {
  for (let key in fromObj) {
    if (typeof fromObj[key] === 'object' && fromObj[key] === null) {
      copyFields(fromObj[key], toObj[key])
    } else {
      toObj[key] = fromObj[key]
    }
  }
}
