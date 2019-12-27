window.newYear = {
  init (eventTime) {
    const audio = document.getElementById("audio");
    newYear.play = () => {
      const timeout = eventTime - new Date().getTime() - (2370000 / 77); // Each beat is 30000/77 ms
      console.log(timeout);
      console.log(timeout);
      if (timeout < 2 ** 31) {
        setTimeout(() => {
          audio.play();
        }, timeout);
      }
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