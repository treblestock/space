import { MONTHS } from "./vars.js"

export function jsDateFromInput(dateStr) {
  const dateArgs = dateStr.split('-')
  dateArgs[1]--
  return new Date(...dateArgs)
}

export function parseDateFormated(dateStr) {
  const dateJS = new Date(dateStr)

  const date = dateJS.getDate()
  const month = MONTHS[dateJS.getMonth()]
  const year = dateJS.getFullYear()

  return [date, month, year].join(' ')
}

export function getShortBody(bodyText) {
  const isTooLongText = bodyText.match('...')
  if (isTooLongText) {
    let firstPart = bodyText.split('[+')[0]
    return typeof firstPart === 'string' ? firstPart : firstPart[0]
  }
  return bodyText
}