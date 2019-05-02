//jshint esversion:6
let loadFunc = () => {
  document.getElementById("username").addEventListener("input", event => {
    //console.log(event.target.parentNode);
    if (document.querySelector(`#${id(event.target)}:invalid`)) event.target.parentNode.setAttribute("data-err", "Usernames can only contain letters numbers _ - .");
    else event.target.parentNode.removeAttribute("data-err");
  });
};

if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);