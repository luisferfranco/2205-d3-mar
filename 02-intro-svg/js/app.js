const graf = d3.select("#graf")

const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)

let cx = anchoTotal / 2
let cy = altoTotal / 2
let r = 75

const c = svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r)

const deltax = (d) => {
  cx += d
  c.transition().duration(1500).attr("cx", cx)
}

const deltay = (d) => {
  cy += d
  c.transition().duration(1500).attr("cy", cy)
}
