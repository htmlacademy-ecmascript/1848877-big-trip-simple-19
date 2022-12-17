function getRandomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElementOfArray(arr) {
  const result = [];
  for (let i; i < arr.length; i++) {
    const item = getRandomArrayElement(arr);
    if(!result.includes(item)) {
      result.push(item);
      continue;
    }
  }
  return result;
}

const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min) ) + min;

export {getRandomArrayElement, getRandomElementOfArray, getRndInteger};
