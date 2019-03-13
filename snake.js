const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

//constants
const SIZE = 20
const SIZECUBEW = canvas.width/SIZE;
const SIZECUBEH = canvas.height/SIZE
const UP = { x: 0, y:-1 }
const DOWN = { x: 0, y: 1 }
const RIGHT  = { x: 1, y: 0 }
const LEFT = { x:-1, y: 0 }
const STOP = { x:0, y: 0 }

//returns random number between min and max
const rnd = min => max => Math.floor(Math.random() * max) + min
//returns random position
const rndPos = (c,r) => ({
  x: rnd(0)(c - 1),
  y: rnd(0)(r - 1),
})
//initates state
const initState = () => ({
  cols:  SIZE,
  rows:  SIZE,
  moves: {x:0, y:0},
  snakeHead: rndPos(SIZE, SIZE),
  snake: [],
  apple: rndPos(SIZE, SIZE),
})
let state = initState();

//compare position
const isSame = p1 => p2 =>  JSON.stringify(p1) === JSON.stringify(p2)
//set new position
const setNewPosition = pos => ({x:pos.x, y:pos.y});
//move body returns last position od body
const moveBody = () => {
  var last = setNewPosition(state.snakeHead);
  var prethodni = setNewPosition(last);
  for (var i = 0; i < state.snake.length; i++) {
    last = setNewPosition(state.snake[i]);
    if(i == 0){
      state.snake[i] = setNewPosition(state.snakeHead);
    }else{
      state.snake[i] = setNewPosition(prethodni);
    }
    prethodni = setNewPosition(last);
  }
  return last;
}
//move head
const mod = x => y => ((y % x) + x) % x
const moveHead = () => {
  state.snakeHead.x = mod(SIZE)(state.snakeHead.x + state.moves.x);
  state.snakeHead.y = mod(SIZE)(state.snakeHead.y + state.moves.y);
  //if it hits itself
  for (var i = 0; i < state.snake.length; i++) {
    if(isSame(state.snakeHead)(state.snake[i])){
      state = initState();
    }
  }
}
//snake in next iteration
const nextState = () => {
  var last = moveBody();
  moveHead();

  if(isSame(state.snakeHead)(state.apple)){
    state.apple = rndPos(SIZE, SIZE);
    state.snake.push({x:last.x, y:last.y});
  }
}

//drawing function
const scaleX = x => (x*(canvas.width/SIZE))
const scaleY = x => (x*(canvas.height/SIZE))
const draw = () => {
  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgb(0,200,50)'
  ctx.fillRect(scaleX(state.snakeHead.x), scaleY(state.snakeHead.y), SIZECUBEW, SIZECUBEH)

  ctx.fillStyle = 'rgb(0,200,50)'
  state.snake.map(p => ctx.fillRect(scaleX(p.x), scaleY(p.y), SIZECUBEW, SIZECUBEH))

  ctx.fillStyle = 'rgb(255,50,0)'
  ctx.fillRect(scaleX(state.apple.x), scaleY(state.apple.y), SIZECUBEW, SIZECUBEH)
}

//game loop
const step = t1 => t2 => {
  if (t2 - t1 > 50) {
    nextState();
    draw();
    window.requestAnimationFrame(step(t2))
  } else {
    window.requestAnimationFrame(step(t1))
  }
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'w': case 'ArrowUp':    state.moves = UP; break
    case 'a': case 'ArrowLeft':  state.moves = LEFT;  break
    case 's': case 'ArrowDown':  state.moves = DOWN; break
    case 'd': case 'ArrowRight': state.moves = RIGHT;  break
    case 'p': case 'ArrowRight': state.moves = STOP;  break
  }
})

draw();
window.requestAnimationFrame(step(0));