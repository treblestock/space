const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

function parseDateFormated(dateStr) {
  const dateJS = Date.parse(dateStr)
  console.log(dateJS)

  const date = dateJS.getDate()
  const month = MONTHS[dateJS.getMonth()]
  const year = dateJS.getFullYear()

  console.log(date, month, year)
  return [date, month, year].join(' ')
}