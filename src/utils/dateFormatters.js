export const dateToPolish = (givenDate) => {
  const date = new Date(parseInt(givenDate));
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const polishDate = date.toLocaleString("pl-PL", options);
  return polishDate;
};

export const dateToInput = (givenDate) => {
  const date = new Date(parseInt(givenDate));
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}T${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
};
