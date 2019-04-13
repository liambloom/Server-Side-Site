//jshint esversion:6
const post = (elem, page) => {
  document.getElementById("main").style.setProperty("display", "none");
  document.getElementById("loadingContainer").style.setProperty("display", "initial");
  window.activateLoading();
  fetch("/post/" + page, {
    method: "POST",
    body: JSON.stringify({
      data: document.querySelector(elem).value.toString(),
      timestamp: new Date(),
      theme: window.themes[window.theme.color],
      color: window.theme.color
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