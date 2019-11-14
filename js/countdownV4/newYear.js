window.newYear = {
  init (eventTime) {
    const audio = document.getElementById("audio");
    newYear.play = () => {
      setTimeout(() => { // This runs despite the timeLeft being about a month and a half
        console.log("Running at " + eventTime - new Date().getTime() - (2340000 / 77) - 1000);
        audio.play(); // THIS IS THE BUG. THIS LINE RUNS BEFORE IT SHOULD. I DON'T KNOW WHY.
      }, eventTime - new Date().getTime() - (2340000 / 77) - 1000);
    };
    newYear.popup();
  },
  popup() {
    modal.open("#audioPopup", () => {
      const audio = document.getElementById("audio");
      audio.onplay = () => {
        modal.close();
        audio.pause(); // THIS IS NOT THE BUG. THIS RUNS PROPERLY.
        audio.currentTime = 0;
        newYear.play();
        audio.onplay = undefined;
      };
    });
  }
};