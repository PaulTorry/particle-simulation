const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(200, 200)
document.getElementById("simulationWindow").width = screenSize.x
document.getElementById("simulationWindow").height = screenSize.y
let objects = []
let lastTime = 0
let atomicRadius = 50
let heatingValue = 1.00
grid = makeGrid(80, 99, 200, true)
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
    }
    if(e.key === "c") {
        console.log(e.key)
        heatingValue = heatingValue - 0.001
    }
    if(e.key === "1") {
        console.log(e.key)
        heatingValue = 0.99
    }
    if(e.key === "2") {
        console.log(e.key)
        heatingValue = 0.999
    }
    if(e.key === "3") {
        console.log(e.key)
        heatingValue = 1
    }
    if(e.key === "4") {
        heatingValue = 1.001
    }
})
document.getElementById("simulationWindow").addEventListener("mousedown", (e) => {
    console.log(e.offsetX, e.offsetY)
    objects.push(new Particle(new Vec(e.offsetX, e.offsetY), new Vec(0,0)))
})
draw()
function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    let g = [-1, 0, 1]
    objects.forEach((o, i) => {
        for(const n of g) {
            for(const m of g) {
            dl.drawCircle(...o.s.addXY(m*screenSize.x, n*screenSize.y), 20, "gray")
            }
        }
    })
    objects.forEach((o, i) => {
        dl.drawCircle(...o.s, 20, "white")
    })
    let kineticEnergy = objects.reduce((p, c, i) => p+c.kineticEnergy, 0)
    let potentialEnergy = objects.reduce((p, c, i) => p+gravitationalPotentials(objects, c.s), 0)
    //console.log(kineticEnergy)
    //console.log(gravitationalPotentials(objects, objects[0].s))
    dl.fillText(kineticEnergy, 0, 25)
    dl.fillText(potentialEnergy, 0, 50)
    dl.fillText(kineticEnergy+potentialEnergy, 0, 75)
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
    let itt = 200
    let dt = 0.1 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }
    lastTime = t
        setTimeout(update, 5)
        draw()
    }
setTimeout(update, 1)



