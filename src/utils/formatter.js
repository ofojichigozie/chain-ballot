export const toCompactNumber = (number) => {
  number = Number(number);
  if (number < 1000) {
    return number;
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(3) + "K";
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(3) + "M";
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(3) + "B";
  } else if (number >= 1_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(3) + "T";
  }
};

export const toInt = (value) => {
  return parseInt(value, 10);
};

export const toDuration = (startTime, endTime) => {
  let duration = (endTime - startTime) / (60 * 60 * 24);
  return toInt(duration);
};

export const fNumber = (value) => {
  return Number(value).toLocaleString();
};
