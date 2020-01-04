import setText, { appendText } from "./results.mjs";

// Promise takes a function as the one and only parameter to its constructor
// This is called the "executor"
export function timeout() {
  const wait = new Promise(resolve => {
    // executor
    setTimeout(() => {
      resolve("Timeout!");
    }, 1500);
  });

  wait.then(text => setText(text));
}

export function interval() {}

export function clearIntervalChain() {}

export function xhr() {}

export function appPromises() {}

export function allSettled() {}

export function race() {}
