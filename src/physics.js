const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(200, 200)
updateCanvasSize()
let objects = []
let lastTime = 0
let atomicRadius = 50
let heatingValue = 1.00
let stats = {}
let datalog = []
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
    if(e.key === "i") {
        screenSize = screenSize.addXY(1,1)
        console.log(e.key)
        updateCanvasSize()
    }
    if(e.key === "d") {
        screenSize = screenSize.addXY(-1,-1)
        console.log(e.key)
        updateCanvasSize()
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
        dl.drawX(...o.s, 20, "white")
    })
    let kineticEnergy = objects.reduce((p, c, i) => p+c.kineticEnergy, 0)
    let potentialEnergy = objects.reduce((p, c, i) => p+gravitationalPotentials(objects, c.s), 0)
    //console.log(kineticEnergy)
    //console.log(gravitationalPotentials(objects, objects[0].s))
    dl.fillText(kineticEnergy.toFixed(2), 0, 25)
    dl.fillText(potentialEnergy.toFixed(2), 0, 50)
    dl.fillText((kineticEnergy+potentialEnergy).toFixed(2), 0, 75)
    dl.fillText(objects.length, 0, 100)
    dl.fillText((potentialEnergy/objects.length).toFixed(2), 0, 125)
    dl.fillText((kineticEnergy/objects.length).toFixed(2), 0, 150)
    dl.fillText(((kineticEnergy+potentialEnergy)/objects.length).toFixed(2), 0, 175)
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
function heat(n) {
    heatingValue = n
}
function changeScreenSize(x, y) {
    screenSize = screenSize.addXY(x,y)
        updateCanvasSize()
}
function logStats() {
    datalog.push([stats.x, (stats.pE/stats.n)])
}
function updateCanvasSize() {
        document.getElementById("simulationWindow").width = screenSize.x
        document.getElementById("simulationWindow").height = screenSize.y
}
function calculateStats() {
    stats = {
        kE: objects.reduce((p, c, i) => p+c.kineticEnergy, 0),
        pE: objects.reduce((p, c, i) => p+gravitationalPotentials(objects, c.s), 0),
        n: objects.length,
        x: screenSize.x,
        y: screenSize.y,
    }
}
function update(t) {
    let itt = 200
    let dt = 0.1 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }
    lastTime = t
        setTimeout(update, 5)
        calculateStats()
        //console.log(stats)
        document.getElementById("stats").innerHTML = "<tr><td>" + stats.kE.toFixed(3) + "</td>" + "    " + "<td>" + (stats.kE/stats.n).toFixed(3) + "</td></tr>" +
        "<tr><td>" + stats.pE.toFixed(3) + "</td>" + "    " + "<td>" + (stats.pE/stats.n).toFixed(3) + "</td></tr>" +
        "<tr><td>" + (stats.pE+stats.kE).toFixed(3) + "</td>" + "    " + "<td>" + ((stats.pE+stats.kE)/stats.n).toFixed(3) + "</td></tr>" +
         "<tr><td>" + stats.x + "</td>" + "    " + "<td>" + stats.y + "</td></tr>"
        draw()
    }
setTimeout(update, 1)



