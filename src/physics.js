const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(800, 800)
let objects = []
let lastTime = 0
grid = [200]
for (const n of grid) {
    for (const m of grid) {
        objects.push(new SpaceObject(new Vec(m, n), new Vec(0, 0)))
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        console.log(e.key)
    }
})
draw()
function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    objects.forEach((o, i) => {
        dl.drawCircle(...o.s, 50, "white")
    })
}
function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateGravities(objects, o.s))
        o.checkBounds(...screenSize)
        //o.applyGravity(gravityObjects[0], dt)
    }
    )
}
function update(t) {
    let itt = 2
    let dt = 0.05 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }
    lastTime = t
        setTimeout(update, 1)
        draw()
    }
setTimeout(update, 1)



