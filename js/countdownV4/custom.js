input = options => {
  if (typeof options !== "object") options = {};
  if (typeof options.type !== "string") options.type = "text";
  let newInput = "<input";
  for (let [key, value] of Object.entries(options)) {
    newInput += ` ${key}="${value}"`;
  }
  return newInput + ">";
};
const now = new Date();
document.getElementById("date").innerHTML =  new Date(3333, 10, 22).toLocaleDateString()
  .replace("11", input({ id: "month", placeholder: "mm", type: "number", maxLength: "2", value: now.getMonth() + 1, required: "required" }))
  .replace("22", input({ id: "day", placeholder: "dd", type: "number", maxLength: "2", value: now.getDate(), required: "required" }))
  .replace("3333", input({ id: "year", placeholder: "yyyy", type: "number", maxLength: "4", value: now.getFullYear(), required: "required" }));
document.getElementById("time").innerHTML = now.toLocaleTimeString()
  .replace(/(\d{2}(?=:))/, input({ id: "hour", placeholder: "hh", type: "number", maxLength: "2", value: "$1", required: "required" }))
  .replace(/(\d{2}(?=:))/, input({ id: "minute", placeholder: "mm", type: "number", maxLength: "2", value: "$1", required: "required" }))
  .replace(/:\d{2}/, "")
  .replace(/AM|PM/, '<select id="ampm"><option>AM</option><option>PM</option></select>');
for (let e of document.getElementsByTagName("input")) {
  e.addEventListener("input", () => {
    if (e.type === "number") e.value.match(/\D/g, "");
    if (e.maxLength < e.value.length) e.value = e.value.substr(0, e.maxLength);
  });
}