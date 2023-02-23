export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`
}