const a = 1;
const b = { c: 3 };
let d = {
  a,
  ...b
};
console.info(d);
export default d;
