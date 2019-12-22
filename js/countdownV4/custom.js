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
    .replace(/(\d{2}(?=:))/, $1 => input({ id: "minute", placeholder: "mm", type: "text", pattern: "\\d{0,2}", maxLength: "2", value: $1.padStart(2, "0"), required: "required" }))
    .replace(/:\d{2}/, "")
    .replace(/(AM|PM)/, $1 => `<select id="ampm"><option value="0" ${$1 === "AM" ? "selected" : ""}>AM</option><option value="12" ${$1 === "PM" ? "selected" : ""}>PM</option></select>`);
  if (!e.innerHTML.includes("ampm")) e.innerHTML += '<input id="ampm" type="hidden" value="0">';
}
for (let e of document.getElementsByTagName("input")) {
  e.previousValue = e.value;
  e.addEventListener("input", () => {
    if (e.maxLength !== -1 && e.maxLength < e.value.length || !new RegExp(e.pattern).test(e.value) || e.type === "number" && /\D/.test(e.value)) e.value = e.previousValue;
    e.previousValue = e.value;
  });
}
document.getElementById("form").addEventListener("submit", event => {
  event.preventDefault();
  modal.open("#loadingModal");
  activateLoading();
  document.getElementById("submit").error.clear();
  const icon = document.getElementById("icon").files[0] || "clock.svg";
  const reader = new FileReader();
  reader.onload = readEvent => {
    const formObj = {
      name: document.getElementById("eventName").value || "My Event",
      icon: readEvent.target.result,
      iconType: icon !== "clock.svg" ? icon.name.split(/\.(?=[^.]+$)/)[1] : undefined,
      timing: `${(parseInt(document.getElementById("hour").value.replace("12", "0")) + parseInt(document.getElementById("ampm").value)).toString().padStart(2, "0")}:${document.getElementById("minute").value.padStart(2, "0")} `,
      message: document.getElementById("message").value || "Hooray!"
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
      .then(res => {
        if (res.ok) return res.json();
        else throw res.json();
      })
      .then(res => {
        location.assign(res.id);
      })
      .catch(res => {
        document.getElementById("submit").error = res.error; // This makes all input red and the error put onscreen is [object Object]
      })
      .finally(() => {
        modal.close();
        deactivateLoading();
      });
  };
  if (icon !== "clock.svg") reader.readAsBinaryString(icon); // Handle if no file
  else reader.onload({ target: { result: icon } });
});