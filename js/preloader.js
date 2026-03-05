class Preloader {

  constructor() {
    this.__assets__ = new Object();
  }

  handleLoadingScreen() {
    let ld_bar = document.getElementById("loadingBar"),
    ld_prt = document.getElementById("loadingPercent"),
    ld_txt = document.getElementById("loadingText"),
    ld_scr = document.getElementById("loadingScreen"),
    start_txt = document.getElementById("start");


    ld_bar.style.width = "100%";
    ld_prt.innerHTML = "100%";
    ld_txt.innerHTML = "Loaded!";
    start_txt.style.display = "block";
    ld_scr.addEventListener("click", () => {
      ld_scr.style.display = "none";
      main();
      document.body.requestFullscreen();
    })
  }

  handleFailedToLoadScreen() {
    console.error("Failed! to load resources");
  }

  load(data) {
    if (Object.keys(data).length == 0) {
      this.handleLoadingScreen();
    } else {
      let ld_bar = document.getElementById("loadingBar"),
      ld_prt = document.getElementById("loadingPercent");

      this.__assets__ = data;
      let loads = [],
      noOfLoaded = 0;

      for (let key in data) {
        let {
          url,
          type
        } = data[key];

        if (type == "img") {
          loads.push(this.loadImage(url));
        } else if (type == "audio") {
          loads.push(this.loadAudio(url));
        } else if (type == "json") {
          loads.push(this.loadJSON(url));
        }
      }

      loads.forEach((load, idx) => {
        load.then(item => {
          let key = Object.keys(this.__assets__)[idx];
          this.__assets__[key].value = item;
          noOfLoaded++;

          ld_bar.style.width = noOfLoaded/Object.keys(this.__assets__).length*100+"%";
          ld_prt.innerHTML = Math.round(noOfLoaded/Object.keys(this.__assets__).length*100)+"%";


          if (noOfLoaded == Object.keys(this.__assets__).length) {
            this.handleLoadingScreen();
            return;
          }
        }).catch(() => {
          this.handleFailedToLoadScreen();
          return;
        })
      })

    }

  }

  loadImage(url) {
    return new Promise((resolve,
      reject) => {
      let img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      }
      img.onerror = () => {
        reject();
      }
    })
  }

  loadAudio(url) {
    return new Promise((resolve,
      reject) => {
      let audio = new Audio();
      audio.src = url;
      audio.oncanplay = () => {
        resolve(audio);
      }
      audio.onerror = () => {
        reject();
      }
    })
  }

  loadJSON(url) {
    return new Promise((resolve,
      reject) => {
      let request = fetch(url);
      request.then(response => {
        resolve(response.json());
      }).catch(() => {
        reject();
      })
    })
  }

  get(key) {
    return this.__assets__[key].value;
  }


}