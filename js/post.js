//jshint esversion:6
let onload = () => {
  document.getElementById("submit").addEventListener("click", () => {
    if (document.querySelector("#tags .active")) {
      document.getElementById("submit").error = "";
      window.modal.open('#confirm');
    }
    else document.getElementById("submit").error = "Select a type (push a button)";
  });
};
// onclick="window.modal.open('#confirm')"
const post = () => {
  document.getElementById("main").style.setProperty("display", "none");
  //document.getElementById("loadingContainer").style.setProperty("display", "initial");
  document.getElementById("submit").error = "";
  window.activateLoading();
  fetch("/api/sugestion", {
    method: "POST",
    body: JSON.stringify({
      content: document.getElementById("sugestion").value.toString(),
      type: document.querySelector("#tags .active").id.replace(/^(.)/, c => c.toUpperCase())
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(res => {
      if (res.ok) {
        document.getElementById("content").innerHTML = "<p>Thank you for your feedback. I will use it to try and make this site better. Reload the page or click <a href='/sugestions'>here</a> to submit another sugestion.</p>";
      }
      else {
        document.getElementById("main").style.setProperty("display", "initial");
        document.getElementById("loadingContainer").style.setProperty("display", "none");
        window.forLoadingIcons(e => { e.classList.remove("active"); });
        window.alert("Uh oh. Something went wrong!\n" + res);
      }
    });
};
if (document.readyState === "complete") onload();
else window.addEventListener("load", onload);