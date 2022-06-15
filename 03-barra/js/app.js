// Selectores (elementos en el HTML)
const graf = d3.select("#graf")
const metrica = d3.select("#metrica")

// Dimensiones
const margins = {
  top: 50,
  right: 20,
  bottom: 70,
  left: 105,
}
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const ancho = anchoTotal - margins.right - margins.left
const alto = altoTotal - margins.top - margins.bottom

// Areas de dibujo
const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "graf")

svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", ancho)
  .attr("height", alto)
  .attr("transform", `translate(${margins.left}, ${margins.top})`)
  .classed("backdrop", true)

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const draw = async (m = "clientes") => {
  let data = await d3.csv("barras.csv", d3.autoType)
  data.sort((a, b) => b.clientes - a.clientes)

  // Llenar el select
  // console.log(data)
  // console.log(Object.keys(data[0]).slice(1))
  metrica
    .selectAll("option")
    .data(Object.keys(data[0]).slice(1))
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d)

  // Accessor
  const xAccessor = (d) => d.tienda
  const yAccessor = (d) => d[m]

  // Escaladores
  const tiendas = d3.map(data, (d) => d.tienda)
  const x = d3
    .scaleBand()
    .domain(tiendas)
    .range([0, ancho])
    .paddingOuter(0.2)
    .paddingInner(0.1)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, yAccessor)])
    .range([alto, 0])

  // Dibujo de las barras
  const rect = g
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(xAccessor(d)))
    .attr("y", (d) => y(yAccessor(d)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => alto - y(yAccessor(d)))

  // Título
  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .classed("titulo", true)
    .text("Clientes por Tienda")

  // Ejes
  const xAxis = d3.axisBottom(x)
  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)
    .call(xAxis)
  const yAxis = d3.axisLeft(y).ticks(10)
  const yAxisGroup = g.append("g").classed("axis", true).call(yAxis)

  // Escucha de Eventos
  metrica.on("change", (e) => {
    e.preventDefault()
    console.log(metrica.node().value)
  })

  d3.select("#formu").on("submit", (e) => {
    e.preventDefault()
  })
}

draw()
