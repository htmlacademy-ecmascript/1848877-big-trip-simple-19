export const getRandomArrayElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomElementOfArray = (arr) => {
  const result = [];
  for (let i; i < arr.length; i++) {
    const item = getRandomArrayElement(arr);
    if(!result.includes(item)) {
      result.push(item);
      continue;
    }
  }
  return result;
};

export const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min) ) + min;

export const updateItem = (items, update) => items.map((item) => item.uniqueId === update.uniqueId ? update : item);

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
