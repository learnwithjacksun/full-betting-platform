function generateRandomNumber(length = 6) {
  if (length <= 0 || length > 19) {
    throw new Error("Length must be between 1 and 15 for number output");
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default generateRandomNumber;
