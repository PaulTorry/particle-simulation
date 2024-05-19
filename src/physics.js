const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(800, 800)
let objects = []
let lastTime = 0
let atomicRadius = 100
let heatingValue = 0.99
grid = makeGrid(80, 1, 700)
for (const n of grid) {
    for (const m of grid) {
        objects.push(new Particle(new Vec(m, n), new Vec(0, 0)))
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        console.log(e.key)
    }
    if(e.key === "h") {
        console.log(e.key)
        heatingValue = heatingValue + 0.001
        console.log(heatingValue)
    }
    if(e.key === "c") {
        heatingValue = heatingValue - 0.001
        console.log(heatingValue)
    }
    if(e.key === "1") {  heatingValue = 0.99  }
    if(e.key === "2") {  heatingValue = 0.9995  }
    if(e.key === "3") {  heatingValue = 1  }
    if(e.key === "4") {  heatingValue = 1.0005  }
})
document.addEventListener("click", (e) => {
    
        console.log(e)
        objects.push(new Particle(new Vec(e.offsetX, e.offsetY), new Vec(0, 0)))
})
draw()
function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    objects.forEach((o, i) => {
        for (const n of [-1,0,1]) {
            for (const m of [-1,0,1]) {
                dl.drawCircle(...o.s.addXY(n*800, m*800), 40, "grey")
            }
        }
        dl.drawCircle(...o.s, 40, "white")
    })
    let pp = objects.reduce((p,c) => p + potentials(objects, c.s), 0)
    dl.fillText(pp.toFixed(0), 100, 100, "white") 
    dl.fillText(objects.length, 500, 100, "white") 
}
function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateForces(objects, o.s))
        //console.log(calculateGravities(objects, o.s), dt)
        o.checkBounds(...screenSize)
        //o.applyGravity(gravityObjects[0], dt)
    }
    )
}
function update(t) {
    let itt = 10
    let dt = 0.1 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }
    lastTime = t
        setTimeout(update, 1)
        draw()
    }
setTimeout(update, 1)



