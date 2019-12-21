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
for (let e of document.querySelectorAll(".date, .fullDate")){ 
  e.innerHTML =  new Date(3333, 10, 22).toLocaleDateString()
    .replace("11", input({ class: "month", placeholder: "mm", type: "number", maxLength: "2", value: now.getMonth() + 1, required: "required" }))
    .replace("22", input({ class: "day", placeholder: "dd", type: "number", maxLength: "2", value: now.getDate(), required: "required" }))
    .replace("/3333", e.classList.contains("fullDate") ? ("/" + input({ class: "year", placeholder: "yyyy", type: "number", maxLength: "4", value: now.getFullYear(), required: "required" })) : "");
}

for (let e of document.getElementsByClassName("time")) {
  e.innerHTML = now.toLocaleTimeString()
    .replace(/(\d{1,2}(?=:))/, input({ id: "hour", placeholder: "hh", type: "number", maxLength: "2", value: "$1", required: "required" }))
    .replace(/(\d{2}(?=:))/, match => input({ id: "minute", placeholder: "mm", type: "text", pattern: "\\d{0,2}", maxLength: "2", value: match.padStart(2, "0"), required: "required" }))
    .replace(/:\d{2}/, "")
    .replace(/AM|PM/, '<select id="ampm"><option value="0">AM</option><option value="12">PM</option></select>');
  if (!e.innerHTML.includes("ampm")) e.innerHTML += '<input id="ampm" type="hidden" value="0">';
}
for (let e of document.getElementsByTagName("input")) {
  e.previousValue = e.value;
  e.addEventListener("input", () => {
    if (e.maxLength !== -1 && e.maxLength < e.value.length || !new RegExp(e.pattern).test(e.value) || e.type === "number" && /\D/.test(e.value)) e.value = e.previousValue ;
    e.previousValue = e.value;
  });
}
document.getElementById("form").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("submit").error.clear();
  const formObj = {
    name: document.getElementById("eventName").value,
    icon: document.getElementById("icon").files[0],
    timing: `${(parseInt(document.getElementById("hour").value.replace("12", "0")) + parseInt(document.getElementById("ampm").value)).toString().padStart(2, "0")}:${document.getElementById("minute").value.padStart(2, "0")} `,
    message: document.getElementById("message").value
  };
  switch (document.getRadio("timing").id) {
    case "singleOccurrence":
      formObj.timing += `${document.getElementsByClassName("month")[0].value.padStart(2, "0")}/${document.getElementsByClassName("day")[0].value.padStart(2, "0")}/${document.getElementsByClassName("year")[0].value.padStart(4, now.getFullYear())}`;
      break;
    case "yearlyRepitition":
      formObj.timing += `${document.getElementsByClassName("month")[1].value}/${document.getElementsByClassName("day")[1].value} every year`;
      break;
    case "nthOfMonth":
      formObj.timing += `${document.getElementById("nth").value} ${document.getElementById("dayOfWeek").value.substring(0, 3).toLowerCase()} of ${document.getElementById("month").value.substring(0, 3).toLowerCase()}`;
      break;
    default:
      document.getElementById("submit").error = "Something is very broken D:";
  }
  fetch("/countdown/new", {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.status >= 500) throw res;
      else return res;
    })
    .then(res => {
      location.assign(res.id);
    })
    .catch(res => {
      document.getElementById("submit").error = res.error;
    });
});