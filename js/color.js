//jshint esversion:7
var $color = {
  get random() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  },
  normalize: function(color) {
    return color / 255;
  },
  parse: function(color) {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16)
    };
  },
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