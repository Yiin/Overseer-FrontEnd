export default function () {
  const hostname = window.location.hostname
  const regexParse = new RegExp('[a-z\\-0-9]{2,63}\\.[a-z\\.]{2,5}$')
  const urlParts = regexParse.exec(hostname)

  return hostname.replace(urlParts[0], '').slice(0, -1)
}
