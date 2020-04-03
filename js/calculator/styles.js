{
  const main = document.getElementsByTagName("main")[0];
  const canvas = document.getElementById("canvas");

  const onresize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight - document.getElementById("fixed").clientHeight;
    main.style.width = width;
    main.style.height = height;
    canvas.width = width;
    canvas.height = height;
  };

  onresize();
  window.addEventListener("resize", onresize);
}