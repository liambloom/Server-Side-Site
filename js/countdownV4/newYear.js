window.newYear = {
  init (eventTime) {
    const audio = document.getElementById("audio");
    newYear.play = () => {
      setTimeout(() => {
        audio.play();
      }, eventTime - new Date().getTime() - (2340000 / 77) - 1000);
    };
    newYear.popup();
  },
  popup() {
    modal.open("#audioPopup", () => {
      const audio = document.getElementById("audio");
      audio.onplay = () => {
        modal.close();
        audio.pause();
        audio.currentTime = 0;
        newYear.play();
        audio.onplay = undefined;
      };
    });
  }
};