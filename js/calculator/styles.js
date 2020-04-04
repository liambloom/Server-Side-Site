{
  const onresize = () => {
    setImmediate(() => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - document.getElementsByTagName("header")[0].clientHeight;
      ctx.putImageData(data, 0, 0);
      ctx.lineWidth = showPoints.value ? 1 : strokeWeight;
    }, 0);
  };

  onresize();
  window.addEventListener("resize", onresize);
  document.getElementById("Capa_1").addEventListener("click", onresize);
  window.addEventListener("load", onresize);


  const devMenu = document.getElementById("devMenu");
  if (search.get("dev") === "true") devMenu.style.display = "initial";
  document.getElementById("devMenuOpenClose").addEventListener("click", () => {
    devMenu.classList.toggle("open");
  });

  /*const onresize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight - document.getElementById("fixed").clientHeight;
    main.style.width = width;
    main.style.height = height;
    canvas.width = width;
    canvas.height = height;
  };

  onresize();
  window.addEventListener("resize", onresize);*/
}