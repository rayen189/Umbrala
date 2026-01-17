const canvas = document.getElementById("particles")
const ctx = canvas.getContext("2d")

function resize(){
  canvas.width = innerWidth
  canvas.height = innerHeight
}
resize()
addEventListener("resize", resize)

const dots=[]
for(let i=0;i<70;i++){
  dots.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-.5)*.3,
    vy:(Math.random()-.5)*.3,
    r:Math.random()*2+1
  })
}

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  dots.forEach(d=>{
    d.x+=d.vx
    d.y+=d.vy
    if(d.x<0||d.x>canvas.width) d.vx*=-1
    if(d.y<0||d.y>canvas.height) d.vy*=-1
    ctx.beginPath()
    ctx.arc(d.x,d.y,d.r,0,Math.PI*2)
    ctx.fillStyle="rgba(60,255,143,.6)"
    ctx.fill()
  })
  requestAnimationFrame(loop)
}
loop()
