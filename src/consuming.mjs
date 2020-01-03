import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

// Promise can have three states:
// 1. Pending
// 2. Fulfilled
// 3. Rejected
// when a promise it fulfilled it executes then, which takes a function as its only parameter.
export function get() {
  axios.get("http://localhost:3000/orders/1").then(({ data }) => {
    setText(JSON.stringify(data));
  });
}

export function getCatch() {
  axios
    .get("http://localhost:3000/orders/115")
    .then(({ result }) => {
      setText(JSON.stringify(result.data));
    })
    .catch(err => setText(err)); // handle the error case!
}

export function chain() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      // Have to return so you get the data back from the prior call!
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    });
}

export function chainCatch() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
      //throw new Error("Error!");
    })
    /*.catch(err => {
      // all data from first call
      setText(err);
      throw new Error("SECOND ERROR!");
      //return { data: {} }; // Need to pass that data!
    })*/
    .then(({ data }) => {
      setText(`City: ${data.my.city}`);
    })
    // Will catch any error from any call...
    .catch(err => setText(err));
}
export function final() {
  showWaiting();
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      return axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
      );
    })
    .then(({ data }) => {
      setText(`City: ${data.city}`);
    })
    .catch(err => setText(err))
    .finally(() => {
      setTimeout(() => {
        hideWaiting();
      }, 1500);
      appendText("<br /> *COMPLETELY DONE*");
    });
}
