class math {

  static rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randint(min, max) {
    return Math.round(this.rand(min, max));
  }

  static choice(array) {
    return array[this.randint(0, array.length - 1)];
  }

  static randCol(l = "50%", s = "100%") {
    return `hsl(${this.randint(0, 360)}, ${s}, ${l})`;
  }

  static rad(deg) {
    if (deg > 180) {
      //deg = 180 - deg;
    }
    return Math.PI/180*deg;
  }

  static deg(rad) {
    return 180/Math.PI*rad;
  }

}