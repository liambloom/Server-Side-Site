"use strict"; // does not work on mobile
const key = document.getElementById("key");
const instructions = document.getElementById("instructions");
const error = document.getElementById("error");
function position () {
  const mainBcr = key.getBoundingClientRect();
  for (let e of [instructions, error]) {
    e.style.setProperty("width", `${mainBcr.width}px`);
  }
  instructions.style.setProperty("top", `calc(${mainBcr.top - scrollY - instructions.getBoundingClientRect().height}px - 1em)`);
  error.style.setProperty("top", `calc(${mainBcr.top + mainBcr.height - scrollY}px + 1em)`);
}
if (document.readyState === "complete") position();
else window.addEventListener("load", position);
window.addEventListener("resize", position);
window.addEventListener("scroll", position);

function verify () {
  console.log("foo");
  error.innerHTML = "";
  fetch("/api/forbiddenKeyConfirm", {
    method: "POST",
    body: JSON.stringify({
      key: key.value
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(res => {
      if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
      else return res.json();
    })
    .then(res => {
      error.innerHTML = res.error;
    });

}
key.addEventListener("input", event => {
  key.value = key.value.replace(/([a-f])/g, $1 => $1.toUpperCase()).replace(/[^0-9a-f\-]/gi, "");
});
document.addEventListener("keydown", event => {
  if (event.keyCode === 13) verify(key.value);
});