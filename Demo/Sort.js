function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[i]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

let arr = [3, 1, 2, 7, 4, 9, 4, 0];
console.log(bubbleSort(arr));

export const debounce = (func, delay) => {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func.apply(this, arguments), delay);
  };
};

export const throttle = (func, delay) => {
  let last = 0;
  return function() {
    let curr = new Date().getTime();
    if (curr - last > delay) {
      func.apply(this, arguments);
      last = curr;
    }
  };
};

const debounce = (func, delay) => {
  let timer = null;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
};

const throttle = (func, delay) => {
  let last = null;

  return function() {
    let curr = new Date().getTime();
    if (curr - last > delay) {
      func.apply(this, arguments);
      last = new Date().getTime();
    }
  };
};
