const canvas = document.createElement("canvas");
let W, H;
W = canvas.width = Math.min(innerWidth, 600);
H = canvas.height = Math.min(innerHeight, 500);
document.querySelector(".container").appendChild(canvas);
const ctx = canvas.getContext("2d");


let {
  log
} = console;
let getELM = s => document.querySelector(s);

(() => {
  assets = new Preloader();
  assets.load({
    
  });
})();

function storageAvailable(type) {
  try {
    var storage = window[type], x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (e.code === 22 || e.code === 1014 || 
      e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      storage && storage.length !== 0;
  }
}
let ls_available = false;
if (storageAvailable('localStorage')) {
  ls_available = true;
}




function clearPreviousRendering(col = "rgb(5,17,32)") {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, W, H);
}

function calcDT() {
  now = performance.now();
  dt = now - then;
  then = now;
  fps = 1000/dt;
}


function main() {
  document.getElementById("wallCollisionToggleBtn").classList.remove("hide");
  document.getElementById("pauseResumeBtn").classList.remove("hide");
  
  now = 0,
  then = performance.now(),
  fps = 0,
  dt = 0;
  
  score = 0;
  hscore = 0;
  if(ls_available) {
    
    let k = localStorage.getItem("hebi");
    if(k) {
      hscore = JSON.parse(k).hscore
    }
  }
  
  
  snake = new Snake(new Vector(canvas.width/2, canvas.width/2), 5, 5, 70, 1);
  snake.init();
  
  apples = [generateApple()];
  
  
  GameLoop();
}

class Snake {
  constructor(pos, w, h, len, speed) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.len = Math.floor((len - w) / speed) + 1;
    this.direction = math.choice(["r", "u", "d"]);
    this.body = [];
    
    this.vel = new Vector(0, 0);
    this.speed = speed;
    
    this.updateDirectionData = null;
    
    this.dead = false;
    this.wallCollisionDead = true;
  
  }
  
  init() {
    for(let i = 0; i < this.len; i++) {
      this.body.push({
        pos: this.pos.sub(new Vector(this.speed * i, 0))
      })
    }
  }
  
  updateDirection() {
    let head = this.body[0];
    if(this.updateDirectionData !=null) {
      
      if(this.updateDirectionData.direction == "r" && head.pos.y >= this.updateDirectionData.y && this.direction == "d") {
        this.direction = "r";
        this.body[0].pos.y = this.updateDirectionData.y;
        this.updateDirectionData = null;
        
      }
      else if(this.updateDirectionData.direction == "r" && head.pos.y <= this.updateDirectionData.y && this.direction == "u") {
        this.direction = "r";
        this.body[0].pos.y = this.updateDirectionData.y;
        this.updateDirectionData = null;
        
      } 
      else if(this.updateDirectionData.direction == "l" && head.pos.y >= this.updateDirectionData.y && this.direction == "d") {
        this.direction = "l";
        this.body[0].pos.y = this.updateDirectionData.y;
        this.updateDirectionData = null;
        
      }
      else if(this.updateDirectionData.direction == "l" && head.pos.y <= this.updateDirectionData.y && this.direction == "u") {
        this.direction = "l";
        this.body[0].pos.y = this.updateDirectionData.y;
        this.updateDirectionData = null;
        
      }
      
      else if(this.updateDirectionData.direction == "u" && head.pos.x >= this.updateDirectionData.x && this.direction == "r") {
        this.direction = "u";
        this.body[0].pos.x = this.updateDirectionData.x;
        this.updateDirectionData = null;
        
      }
      else if(this.updateDirectionData.direction == "u" && head.pos.x <= this.updateDirectionData.x && this.direction == "l") {
        this.direction = "u";
        this.body[0].pos.x = this.updateDirectionData.x;
        this.updateDirectionData = null;
        
      }
      else if(this.updateDirectionData.direction == "d" && head.pos.x >= this.updateDirectionData.x && this.direction == "r") {
        this.direction = "d";
        this.body[0].pos.x = this.updateDirectionData.x;
        this.updateDirectionData = null;
        
      }
      else if(this.updateDirectionData.direction == "d" && head.pos.x <= this.updateDirectionData.x && this.direction == "l") {
        this.direction = "d";
        this.body[0].pos.x = this.updateDirectionData.x;
        this.updateDirectionData = null;
        
      }
      

    }
  }
  
  
  
  movement() {
    if(this.direction == "d") {
      this.body.pop();
      this.body.splice(0, 0, {
        pos: this.body[0].pos.add(new Vector(0, this.speed))
      })
    }
    else if(this.direction == "u") {
      this.body.pop();
      this.body.splice(0, 0, {
        pos: this.body[0].pos.add(new Vector(0, - this.speed))
      })
    }
    else if(this.direction == "l") {
      this.body.pop();
      this.body.splice(0, 0, {
        pos: this.body[0].pos.add(new Vector(- this.speed, 0))
      })
    }
    else if(this.direction == "r") {
      let popped = this.body.pop();
      this.body.splice(0, 0, {
        pos: this.body[0].pos.add(new Vector(this.speed, 0))
      })
    }
  }
  
  draw() {
    this.body.forEach((block, idx) => {
      ctx.fillStyle = "#09f";
    
      if(idx < 6) ctx.fillStyle = "rgb(73,182,255)"
      ctx.fillRect(block.pos.x, block.pos.y, this.w, this.h);
    })
  }
  
  checkCollision() {
    this.body.forEach((piece, idx) => {
      if(idx > 12 && CheckAABBCollision(this.body[0].pos, this.w, this.h, piece.pos, this.w, this.h)) {
        this.dead = true;
      }
    })
  }
  
  wallCollision() {
    let head = this.body[0];
    if(this.wallCollisionDead) {
      
      if((head.pos.x + this.w - 1 > canvas.width && this.direction == "r") || (head.pos.x + 1 < 0 && this.direction == "l") || (head.pos.y + this.h - 1 > canvas.height && this.direction == "d") || (head.pos.y + 1 < 0 && this.direction == "u")) {
        this.dead = true;
      }
      
    } else {
      
      if(head.pos.x + this.w > canvas.width && this.direction == "r") {
        head.pos.x = - this.w;
      } else if(head.pos.x < 0 && this.direction == "l") {
        head.pos.x = canvas.width;
      } else if(head.pos.y + this.h > canvas.height && this.direction == "d") {
        head.pos.y = - this.h;
      } else if(head.pos.y < 0 && this.direction == "u") {
        head.pos.y = canvas.height;
      }
      
    }
  }
  
  update() {
    if(fps > 10) this.speed = Math.round(100/fps);
    this.updateDirection();
    this.movement();
    this.draw();
    this.checkCollision();
    this.wallCollision();
    
    if(this.dead) {
      cancelAnimationFrame(loop)
      navigator.vibrate(150);
      document.getElementById("replayBtn").classList.remove("hide");
      document.getElementById("pauseResumeBtn").classList.add("hide");
    }
    
  }
  
}

class Apple {
  constructor(pos, w, h) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.color = "rgb(88,238,200)";
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
  }
  update() {
    this.draw();
  }
}

function CheckAABBCollision(p1, w1, h1, p2, w2, h2) {
  if(p1.x + w1 - 1 > p2.x && p1.x + 1 < p2.x + w2 && p1.y + h1 - 1 > p2.y && p1.y + 1 < p2.y + h2) {
    return true;
  }
  return false;
}

function generateApple(pos = new Vector(math.randint(0, Math.floor(canvas.width / snake.w) - 1) * snake.w, math.randint(0, Math.floor(canvas.height / snake.h) - 1) * snake.h)) {
  return new Apple(pos, snake.w, snake.h);
}

function increaseSnakesLength(len) {
  for(let i = 0; i <= Math.floor((len - snake.w) / snake.speed); i++)
  snake.body.push({
    pos: snake.body[snake.body.length - 1].pos
  })
}

let counter = 0, fc = 0;
function GameLoop() {
  loop = requestAnimationFrame(GameLoop);
  clearPreviousRendering();
  ctx.imageSmoothingEnabled = false;


  

  apples.forEach((apple, idx) => {
    apple.update();
    if(CheckAABBCollision(snake.body[0].pos, snake.w, snake.h, apple.pos, apple.w, apple.h)) {
      apples.splice(idx, 1);
      apples.push(generateApple());
      increaseSnakesLength(10);
      score += 10;
      snake.len += 10;
      if(score > hscore) {
        hscore = score;
        if(ls_available) localStorage.setItem("hebi", JSON.stringify({hscore:hscore}));
      }
      //apples.push(generateApple());
      //apples.push(generateApple());
      
    }
  })
  snake.update();
  
  
  now = performance.now();
  dt = (now - then) / 1000;
  fps = 1/dt;
  document.getElementById("dev").innerHTML = `Score: ${score} <br> High Score: ${hscore} <br> FPS: ${fc}`;
  if (counter > fps * 60) {
    fc = Math.floor(fps);
    counter = 0;
  }
  counter += fps;
  
  then = performance.now();
}

let startPoint, currentPoint, prevDirection;
window.addEventListener("touchstart", e => {
  startPoint = new Vector(e.touches[0].clientX, e.touches[0].clientY);
  
})
window.addEventListener("touchmove", e => {
  currentPoint = new Vector(e.touches[0].clientX, e.touches[0].clientY);
  
  let dis = currentPoint.sub(startPoint);
  let dx = dis.x;
  let dy = dis.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    if(dx > 0 && snake.direction != "l") {
      prevDirection = snake.direction;

      if(snake.direction == "u") {
        snake.updateDirectionData = {
          direction: "r",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h - snake.h,
          polarity: 1
        }
      } else if(snake.direction == "d") {
        snake.updateDirectionData = {
          direction: "r",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h,
          polarity: 1
        }
      }
      
    } else {
      if(snake.direction != "r") {
        prevDirection = snake.direction;

        
        if(snake.direction == "u") {
        snake.updateDirectionData = {
          direction: "l",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h - snake.h
        }
      } else if(snake.direction == "d") {
        snake.updateDirectionData = {
          direction: "l",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h
        }
      }
        
        
      }
    }
  } else {
    if(dy > 0 && snake.direction != "u") {
      prevDirection = snake.direction;

      if(snake.direction == "l") {
        snake.updateDirectionData = {
          direction: "d",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w - snake.w
        }
      } else if(snake.direction == "r") {
        snake.updateDirectionData = {
          direction: "d",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w
        }
      }
      
    } else {
      if(snake.direction != "d") {
        prevDirection = snake.direction;

        
        
        if(snake.direction == "l") {
        snake.updateDirectionData = {
          direction: "u",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w - snake.w
        }
      } else if(snake.direction == "r") {
        snake.updateDirectionData = {
          direction: "u",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w
        }
      }
      
      
      
      }
    }
  }
  
  
})

addEventListener("keydown", e => {
    let key = e.keyCode;
    let k = e.key;
    
    if (key == 37 || key == 65 || key == 39 || key == 68) {
    if((key == 39 || key == 68) && snake.direction != "l") {

      if(snake.direction == "u") {
        snake.updateDirectionData = {
          direction: "r",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h - snake.h
        }
      } else if(snake.direction == "d") {
        snake.updateDirectionData = {
          direction: "r",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h
        }
      }
      
    } else if(key == 65 || key == 37) {
      if(snake.direction != "r") {
        

        
        if(snake.direction == "u") {
        snake.updateDirectionData = {
          direction: "l",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h - snake.h
        }
      } else if(snake.direction == "d") {
        snake.updateDirectionData = {
          direction: "l",
          y: Math.floor((snake.body[0].pos.y + snake.h) / snake.h) * snake.h
        }
      }
        
        
      }
    }
  } else {
    if((key == 83 || key == 40) && snake.direction != "u") {

      if(snake.direction == "l") {
        snake.updateDirectionData = {
          direction: "d",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w - snake.w
        }
      } else if(snake.direction == "r") {
        snake.updateDirectionData = {
          direction: "d",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w
        }
      }
      
    } else if(key == 38 || key == 87) {
      if(snake.direction != "d") {

        
        
        if(snake.direction == "l") {
        snake.updateDirectionData = {
          direction: "u",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w - snake.w
        }
      } else if(snake.direction == "r") {
        snake.updateDirectionData = {
          direction: "u",
          x: Math.floor((snake.body[0].pos.x + snake.w) / snake.w) * snake.w
        }
      }
      
      
      
      }
    }
  }
    

   
});




function resize() {
  W = Math.min(innerWidth, 600);
  H = Math.min(innerHeight, 500);
}

onresize = resize;


document.getElementById("replayBtn").addEventListener("click", () => {
  main();
  document.getElementById("replayBtn").classList.add("hide");
})

document.getElementById("wallCollisionToggleBtn").addEventListener("dblclick", () => {
  let msgElm = document.getElementById("msg");
  msgElm.classList.remove("hide")
  if(snake.wallCollisionDead) {
    snake.wallCollisionDead = false;
    msgElm.classList.add("show");
    msgElm.innerHTML = `Wall Collision is Switched off!`
  } else {
    snake.wallCollisionDead = true;
    msgElm.classList.add("show");
    msgElm.innerHTML = `Wall Collision is Switched on!`;
  }
  
  setTimeout(() => {
    msgElm.classList.remove("show");
    msgElm.classList.add("hide")
  }, 1500)
})



let pauseResumeBtn = document.getElementById("pauseResumeBtn");
pauseResumeBtn.addEventListener("click", e => {
  if(pauseResumeBtn.classList.contains("pause")) {
    pauseResumeBtn.classList.remove("pause");
    pauseResumeBtn.classList.add("resume");
    pauseResumeBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    GameLoop();
  } else if(pauseResumeBtn.classList.contains("resume")) {
    pauseResumeBtn.classList.remove("resume");
    pauseResumeBtn.classList.add("pause");
    pauseResumeBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    cancelAnimationFrame(loop);
  }
  
})
