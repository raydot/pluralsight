import setText, { appendText } from "./results.mjs";

// Promise takes a function as the one and only parameter to its constructor
// This is called the "executor"
// Takes only one parameter: resolve
export function timeout() {
  const wait = new Promise(resolve => {
    // executor
    setTimeout(() => {
      // calls one time
      resolve("Timeout!");
    }, 1500);
  });

  wait.then(text => setText(text));
}

export function interval() {
  let counter = 0;
  const wait = new Promise(resolve => {
    // executor
    setInterval(() => {
      // calls multiple times
      console.log("INTERVAL.");
      resolve(`Timeout! ${++counter}`);
    }, 1500);
  });

  wait
    .then(text => setText(text))
    .finally(() => appendText(` :Done ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  const wait = new Promise(resolve => {
    // executor
    interval = setInterval(() => {
      // calls multiple times
      console.log("INTERVAL.");
      resolve(`Timeout! ${++counter}`);
    }, 1500);
  });

  wait.then(text => setText(text)).finally(() => clearInterval(interval));
}

export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    // only called on actual error
    xhr.onerror = () => reject("Request failed");
    xhr.send();
  });

  request.then(result => setText(result)).catch(reason => setText(reason));
}

export function allPromises() {
  // How to make sure all data is called?!
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressTypes = axios.get("http://localhost:3000/addressTypes");

  Promise.all([categories, statuses, userTypes, addressTypes])
    .then(([cat, stat, type, address]) => {
      setText("");

      appendText(JSON.stringify(cat.data));
      appendText(JSON.stringify(stat.data));
      appendText(JSON.stringify(type.data));
      appendText(JSON.stringify(address.data));
    })
    .catch(reasons => {
      console.log("reasons", reasons.message);
      setText(reasons.message);
    });
}

export function allSettled() {}

export function race() {}
