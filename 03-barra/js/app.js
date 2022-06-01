const graf = d3.select("#graf")

const margins = {
  top: 20,
  right: 20,
  bottom: 70,
  left: 105,
}
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const ancho = anchoTotal - margins.right - margins.left
const alto = altoTotal - margins.top - margins.bottom

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "graf")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

// g.append("rect")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("width", ancho)
//   .attr("height", alto)

const load = async () => {
  let data = await d3.csv("barras.csv")
  data.forEach((d) => {
    d.clientes = +d.clientes
    d.costos = +d.costos
    d.facturacion = +d.facturacion
    d.ganancia = +d.ganancia
    d.margen = +d.margen
  })
  console.log(data)

  const rect = g
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 30)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", (d) => d.ganancia)
}

load()
