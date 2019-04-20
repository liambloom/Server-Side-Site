//jshint esversion:7
var $color = {
  get random() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  },
  normalize: function(color) {
    return color / 255;
  },
  normalizeRGB: function(color) {
    return {
      r: color.r / 255,
      g: color.g / 255,
      b: color.b / 255
    };
  },
  parse: function(color) {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16)
    };
  },
  /*parseHSL: function(color) {
    color = this.normalizeRGB(this.parseRGB(color));
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let HSL = {h: 0, s: 0, l: 0};
    if (delta == 0) HSL.h = 0;
    else if (cmax == color.r) HSL.h = ((color.g - color.b) / delta) % 6;
    else if (cmax == g) HSL.h = (color.b - color.r) / delta + 2;
    else HSL.h = (color.r - color.g) / delta + 4;
    HSL.h = Math.round(h * 60);
    if (HSL.h < 0) HSL.h += 360;
    HSL.l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); // What???
  },*/
  invert: function(color) {
    color = this.parse(color);
    return "#" +
      (255 - color.r.toString(16).padStart(2, "0")) +
      (255 - color.g.toString(16).padStart(2, "0")) +
      (255 - color.b.toString(16).padStart(2, "0"));
  },
  HSBbrightness: function(color) {
    return Math.max(...this.parse(color));
  },
  HSLlightness: function(color) {
    color = this.parse(color);
    return (Math.max(...color) + Math.min(...color)) / 2;
  },
  intensityM: function(color) {
    color = this.parse(color);
    return  (color.r + color.g + color.b) / 3;
  },
  intensityG: function(color) {
    color = this.parse(color);
    return Math.cbrt(color.r * color.g * color.b);
  },
  Distance3DRGB: function(color) {
    color = this.parse(color);
    return Math.sqrt((color.r ** 2) + (color.g ** 2) + (color.b ** 2));
  },
  isLight: function(color, system) {
    return this[system](color) > 127.5;
  },
  isDark: function (color, system) {
    return this[system](color) < 127.5;
  }
};