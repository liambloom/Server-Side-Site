export default class Deck extends Array {
  constructor (cards, data) {
    super(...cards);
    this.original = cards;
    data = data || {};
    this.whenOut = data.whenOut || "reshuffle";
    this.animation = data.animation && data.animation.constructor.name === "AsyncFunction" ? data.animation : (async () => {});
    this.animation.pre = data.preAnimation && data.preAnimation.constructor.name === "AsyncFunction" ? data.preAnimation : (async () => {});
    this.animation.post = data.postAnimation && data.postAnimation.constructor.name === "AsyncFunction" ? data.postAnimation : (async () => {});
  }
  draw (count = 1) {
    const drawn = [];
    return new Promise(async resolve => {
      for await (let i of new Array(count)) {
        console.log(this.animation.post.toString());
        const removed = this.shift();
        if (this.whenOut === "infinite") this.push(removed);
        if (this.length === 0 && this.whenOut === "reshuffle") this.push(...this.original.shuffle());
        await this.animation.pre(removed);
        await this.animation(removed);
        await this.animation.post(removed);
        drawn.push(removed);
      }
      setTimeout(() => {
        resolve(drawn);
      }, animationTime * count);
    });
  }
  drawSync(count = 1) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const removed = this.shift();
      drawn.push(removed);
      if (this.whenOut === "infinite") this.push(removed);
      if (this.length === 0 && this.whenOut === "reshuffle") this.push(...this.original.shuffle());
      this.animation.pre(removed)
        .then(() => { this.animation(removed); })
        .then(() => { this.animation.post(removed); });
    }
    return drawn;
  }
}