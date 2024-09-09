const weekDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const padNumber = (number: number): string => {
  if (number < 10) {
    return `0${number}`;
  }
  return String(number);
};

const formatDay = (number: number): string => {
  return weekDay[number] ?? '';
};

export const formatDate = (number: number): string => {
  const d = new Date(number);
  const dayString = formatDay(d.getDay());
  const date = padNumber(d.getDate());
  const month = padNumber(d.getMonth() + 1);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const year = d.getFullYear().toString().slice(-2);
  const hours = padNumber(d.getHours());
  const minutes = padNumber(d.getMinutes());
  return `${dayString} ${date}/${month}/${year} à ${hours}:${minutes}`;
};
