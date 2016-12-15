export const data = {
  name: "Perry's Steakhouse",
  coordinates: [30.269443, -97.743490],
  menu: 'Pork chop',
}

export function openAt (date) {
  const dayHour = date.getUTCDay() * 100 + date.getUTCHours()
  return (416 < dayHour && dayHour < 519)  // eslint-disable-line
}
