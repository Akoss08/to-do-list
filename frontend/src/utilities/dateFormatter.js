const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function getDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const weekDay = DAYS[d.getDay()];
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${year}, ${month}, ${day} ${weekDay} - ${hours.toString().length == 2 ? hours : '0' + hours}:${minutes.toString().length == 2 ? minutes : '0' + minutes}`;
}
