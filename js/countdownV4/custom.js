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
document.querySelectorAll(".date, .fullDate").forEach(e => { 
  e.innerHTML =  new Date(3333, 10, 22).toLocaleDateString()
    .replace("11", input({ id: "month", placeholder: "mm", type: "number", maxLength: "2", value: now.getMonth() + 1, required: "required" }))
    .replace("22", input({ id: "day", placeholder: "dd", type: "number", maxLength: "2", value: now.getDate(), required: "required" }))
    .replace("/3333", e.classList.contains("fullDate") ? ("/" + input({ id: "year", placeholder: "yyyy", type: "number", maxLength: "4", value: now.getFullYear(), required: "required" })) : "");
});

[...document.getElementsByClassName("time")].forEach(e => {
  e.innerHTML = now.toLocaleTimeString()
    .replace(/(\d{1,2}(?=:))/, input({ id: "hour", placeholder: "hh", type: "number", maxLength: "2", value: "$1", required: "required" }))
    .replace(/(\d{2}(?=:))/, input({ id: "minute", placeholder: "mm", type: "text", pattern: "\\d{0,2}", maxLength: "2", value: "0".padStart(2, "0"), required: "required" }))
    .replace(/:\d{2}/, "")
    .replace(/AM|PM/, '<select id="ampm"><option>AM</option><option>PM</option></select>');
});
for (let e of document.getElementsByTagName("input")) {
  e.addEventListener("input", () => {
    if (e.type === "number" || /\\d(?=\*|\+|\{\d+,\d*\})/.test(e.pattern)) { console.log(e.value, e.value.replace(/\D/g, "")); e.value = e.value.replace(/\D/g, ""); }
    //if (e.maxLength < e.value.length) e.value = e.value.substr(0, e.maxLength);
  });
}