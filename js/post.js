//jshint esversion:6
const post = elem => {
	if (window.confirm("Are you sure you want to submit this?")) {
		/*req = new XMLHttpRequest();
		req.open("POST", "/sugestions/sugestions.txt", true);
		req.setRequestHeader("Content-Type", "text/javascript; charset=utf-8");
		
		req.onload = () => {
			if (req.status === 200) {
				console.log("Yay it worked!");
			}
			else {
				window.alert("Uh oh. Something went wrong!");
			}
    };
    
    req.send(msg);*/
    fetch("/sugestions/sugestions.txt", {
      method: "POST",
      body: JSON.stringify({ info: document.querySelector(elem).value.toString() + "\n\n" }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(res => {
        if (res.ok) {
          document.getElementById("content").innerHTML = "<p>Thank you for your feedback. I will use it to try and make this site better. Reload the page or click <a href='/sugestions'>here</a> to submit another sugestion. Click <a href='/sugestions/sugestions.txt'>here</a> to see the sugestions.</p>";
        }
        else window.alert("Uh oh. Something went wrong!\n" + res);
      });
	}
};