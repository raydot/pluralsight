import setText, { appendText } from "./results.mjs";

// With promises this would look like:
export function withPromises() {
  axios
    .get("http://localhost:3000/orders/1")

    .then(({ data }) => {
      setText(JSON.stringify(data));
    });
}

// With async await this looks like:
export async function get() {
  const { data } = await axios.get("http://localhost:3000/orders/1");
  setText(JSON.stringify(data));
}

export async function getCatch() {
  try {
    // same for async and sync
    const { data } = await axios.get("http://localhost:3000/orders/111");
    setText(JSON.stringify(data));
  } catch (error) {
    setText(error);
  }
}

export async function chain() {
  // Similar to chain in consuming.mjs but with async/await
  // Calls are seqential!
  const { data } = await axios.get("http://localhost:3000/orders/1");
  const { data: address } = await axios.get(
    `http://localhost:3000/addresses/${data.shippingAddress}`
  );

  setText(`City: ${JSON.stringify(address.city)}`);
}

// Now for concurrent requests:
export async function concurrent() {
  const orderStatus = axios.get("http://localhost:3000/orderStatuses");
  const orders = axios.get("http://localhost:3000/orders");

  setText("");

  // Even though second call completes first, await holds things right here.
  const { data: statuses } = await orderStatus;
  const { data: order } = await orders;

  appendText(JSON.stringify(statuses));
  appendText(JSON.stringify(order[0]));
}

// In Parallel!
// Code will be handled as individual functions settle.
export async function parallel() {
  setText("");

  await Promise.all([
    (async () => {
      // anonymous async #1
      const { data } = await axios.get("http://localhost:3000/orderStatuses");
      appendText(JSON.stringify(data));
    })(),
    (async () => {
      // anonymous async #2
      const { data } = await axios.get("http://localhost:3000/orders");
      appendText(JSON.stringify(data));
    })()
  ]);
}
