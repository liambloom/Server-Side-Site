//jshint esversion:9
const invalidBase = (base) => {
  console.warn(base + " is not a valid base. Using base 10");
  return 10;
};
module.exports = (length, base) => {
  if (parseInt(base)) base = parseInt(base);
  else base = invalidBase(base);
  if (base > 64) base = invalidBase(base);
  if (parseInt(length)) length = parseInt(length);
  else throw length + " is not a valid length";
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".slice(0, base || 10);
  let key = "";
  for (let i = 0; i < length; i++) {
    key += characters[Math.floor(Math.random() * (base - 1))];
  }
  return key;
};