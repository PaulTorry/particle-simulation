function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateForce(g, s) {
  const r = (s.subtract(g.s)).bringInsideBounds(...screenSize.scale(0.5), ...screenSize.scale(-0.5))
  //  if(r.subtract(r.bringInsideBounds(...screenSize)).mag > 10){
  //    console.log(s, g.s, r, r.bringInsideBounds(-400, -400, 400, 400))
  //  }

  let attraction;
  let repulsion;
  let effectiveDistance;
  if (r.mag <= 0.01){ // ||r.mag>500) {
    return new Vec(0, 0)
  }
  effectiveDistance = (1/atomicRadius)*r.mag
  //attraction = r.unit.scale(- 1/effectiveDistance**2)
  //console.log(r, r.unit.scale(-g.mass*G / r.mag ** 2))
  //console.log(g.mass)
  return r.unit.scale(1/effectiveDistance**6 - 1/effectiveDistance**2)
}
function calculateForces(a, s) {
  return a.reduce((p, c) => p.add(calculateForce(c, s)), new Vec(0, 0))
}
function potential(g, s) {
  const r = (s.subtract(g.s)).bringInsideBounds(...screenSize.scale(0.5), ...screenSize.scale(-0.5))
  if (r.mag <= 1) {
    return 0
  }
  let effectiveDistance = (1/atomicRadius)*r.mag
  return  1/effectiveDistance**5 - 1/effectiveDistance
}
function potentials(a, s) {
  return a.reduce((p, c) => p + potential(c, s), 0)
}


function calculateOrbitVelocities(a, s, m) {
  return a.reduce((p, c) => p.add(calculateOrbitVelocity(c, s, m).power(2)), new Vec(0, 0)).power(0.5)
}
function split(a, si, fi) {
  let aa = a.concat(a)
  return [aa.slice(si, fi + 1), aa.slice(fi, a.length + si + 1)]
}
function makeGrid(interval, start, finish) {
  let s = Math.floor(start/interval)
  let f = Math.ceil(finish/interval)
  let grid = [...Array(f-s+1).keys()]
  .map((v,i,a) => v+s)
  .map((v,i,a) => v*interval)
  return grid
}
console.log(makeGrid(10, 12, 52))