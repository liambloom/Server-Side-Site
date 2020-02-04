function forceAsync (func, defaultFunc = async () => {}) {
  if (typeof func === "function") {
    if (func.constructor.name === "AsyncFunction" || /(?:return\s|=>)\s*(?:new )?\s*Promise/.test(func.toString())) return func;
    else return async (...args) => func(...args);
  }
  else return defaultFunc;
}

export default class Deck extends Array {
  constructor (cards, data) {
    super(...cards);
    this.original = cards;
    data = data || {};
    this.whenOut = data.whenOut || "reshuffle";
    this.animations = data.animations || [];
    this.animations = this.animations.map(forceAsync);
  }
  async draw (count = 1) {
    const drawn = [];
    for (let i = 0; i < count; i++) drawn.push(await this.draw1());
    return drawn;
  }
  async drawConcurrent (count = 1) {
    const promises = [];
    for (let i = 0; i < count; i++) promises.push(this.draw1());
    return await Promise.all(promises);
  }
  async draw1 () {
    const removed = this.shift();
    if (this.whenOut === "infinite") this.push(removed);
    if (this.length === 0 && this.whenOut === "reshuffle") this.push(...this.original.shuffle());
    for (let animation of this.animations) {
      await animation(removed);
    }
    return removed;
  }
  static async drawAnimation () {

  }
}