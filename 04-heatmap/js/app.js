const draw = async (el, escala = "linear") => {
  // Selecciones
  const graf = d3.select(el)

  const anchoTotal = +graf.style("width").slice(0, -2)
  const box = (anchoTotal - 10) / 20
  const altoTotal = box * 5 + 10

  console.log("Ancho Total", anchoTotal)
  console.log("Box", box)
  console.log("Alto Total", altoTotal)

  const svg = graf
    .append("svg")
    .classed("graf", true)
    .attr("width", anchoTotal)
    .attr("height", altoTotal)

  // Dataset
  const dataset = await d3.csv("data.csv", d3.autoType)
  dataset.sort((a, b) => a.altura - b.altura)

  // Escalador
  let color

  switch (escala) {
    case "linear":
      color = d3
        .scaleLinear()
        .domain(d3.extent(dataset, (d) => d.altura))
        .range(["white", "blue"])
      break
    case "quantize":
      color = d3
        .scaleQuantize()
        .domain(d3.extent(dataset, (d) => d.altura))
        .range(["white", "yellow", "blue"])
      break
    case "threshold":
      color = d3
        .scaleThreshold()
        .domain([1.6, 1.8])
        .range(["white", "yellow", "blue"])
      break
  }

  svg
    .append("g")
    .attr("transform", "translate(5, 5)")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("x", (d, i) => (i % 20) * box)
    .attr("y", (d, i) => Math.floor(i / 20) * box)
    .attr("fill", (d) => color(d.altura))
    .attr("stroke", "#777777")
    .attr("width", box - 2)
    .attr("height", box - 2)
}

draw("#hm1")
draw("#hm2", "quantize")
draw("#hm3", "threshold")
