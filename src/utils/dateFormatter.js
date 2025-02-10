export const formattedDate = (date) => {
  const fixedDate = new Date(date);
  fixedDate.setHours(0, 0, 0, 0); // Ensures it stays on the same day
  return fixedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
