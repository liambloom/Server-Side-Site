//jshint esversion:9
class dateExtended extends Date {
  constructor() {
    this.dateify = notYetADate => {
      if (notYetADate instanceof Date) return notYetADate;
      else return new Date(notYetADate);
    };
    
  }
}
exports = new dateExtended();