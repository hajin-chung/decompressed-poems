import { init } from "cuid2";

export const createId = init({
  length: 10,
});

export function current() {
  const date = new Date();
  return date.toISOString();
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}
