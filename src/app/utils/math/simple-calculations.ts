export const getMeanOf = (...values: number[]) => {
  const sum = values.reduce((accumulator, next) => {
    return (accumulator += next);
  }, 0);

  return sum / values.length;
};
