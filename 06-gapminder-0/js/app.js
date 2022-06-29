const draw = async (el = "#graf") => {
  // Selección de gráfica
  const graf = d3.select("#graf")

  // Carga del dataset
  let dataset = await d3.csv("gapminder.csv", d3.autoType)
  dataset = dataset.filter((d) => d.life_exp > 0 && d.income > 0)
  // console.log(dataset)

  // Dimensiones
  const anchoTotal = +graf.style("width").slice(0, -2)
  const altoTotal = anchoTotal * 0.5

  const margins = { top: 20, right: 20, bottom: 75, left: 100 }

  const alto = altoTotal - margins.top - margins.bottom
  const ancho = anchoTotal - margins.left - margins.right

  // Accessors
  const xAccessor = (d) => d.income
  const yAccessor = (d) => d.life_exp
  const rAccessor = (d) => d.population

  // Variables
  var year = d3.max(dataset, (d) => d.year)
  console.log(year)

  // Escaladores
  console.log(Array.from(new Set(dataset.map((d) => d.continent))))
  const color = d3
    .scaleOrdinal()
    .domain(Array.from(new Set(dataset.map((d) => d.continent))))
    .range(["#ff798e", "#33dded", "#99ef33", "#ffec33"])

  const x = d3
    .scaleLog()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, ancho])
  const y = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([alto, 0])
    .nice()
  const r = d3
    .scaleLinear()
    .domain(d3.extent(dataset, rAccessor))
    .range([30, 6000])
    .nice()

  // Espacio de gráfica
  const svg = graf
    .append("svg")
    .classed("graf", true)
    .attr("width", anchoTotal)
    .attr("height", altoTotal)

  const clip = svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", ancho)
    .attr("height", alto)

  svg
    .append("g")
    .append("rect")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .attr("width", ancho)
    .attr("height", alto)
    .attr("class", "backdrop")

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)

  const yearLayer = chart
    .append("g")
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", alto / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .classed("year", true)
    .text(year)

  let newDataset

  const step = (year) => {
    newDataset = dataset.filter((d) => d.year == year)

    // Dibujar los puntos
    const circles = chart
      .selectAll("circle")
      .data(newDataset)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cx", (d) => x(xAccessor(d)))
            .attr("cy", (d) => y(yAccessor(d)))
            .attr("r", 0)
            .attr("fill", "black")
            .on("mouseenter", function (event, datum) {
              d3.select("#country").text(datum.country)
              d3.select("#country-income").text(datum.income)
              d3.select("#country-lifeexp").text(datum.life_exp)
              d3.select("#country-population").text(datum.population)
              d3.select("#tooltip")
                .style("display", "block")
                .style("top", y(yAccessor(datum)) + margins.top + "px")
                .style("left", x(xAccessor(datum)) + margins.left + "px")
            })
            .on("mouseout", function (event, datum) {
              d3.select("#tooltip").style("display", "none")
            }),

        (update) => update,
        (exit) =>
          exit.transition().duration(2000).attr("r", 0).attr("fill", "red")
      )
      .transition()
      .duration(2000)
      .attr("r", (d) => Math.sqrt(r(rAccessor(d)) / Math.PI))
      .attr("fill", (d) => color(d.continent))
      .attr("stroke", "#555")
      .attr("opacity", 0.6)
      .attr("clip-path", "url(#clip)")
  }

  // Ejes
  const xAxis = d3
    .axisBottom(x)
    .ticks(3)
    .tickFormat((d) => "$" + d.toLocaleString())
  const yAxis = d3.axisLeft(y)

  const xAxisGroup = chart
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .call(xAxis)
    .classed("axis", true)
  const yAxisGroup = chart.append("g").call(yAxis).classed("axis", true)

  xAxisGroup
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", margins.bottom - 10)
    .attr("fill", "black")
    .text("Ingreso Per Cápita")
  yAxisGroup
    .append("text")
    .attr("x", -alto / 2)
    .attr("y", -margins.left + 30)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)")
    .text("Expectativa de Vida")

  d3.select("#atras").on("click", () => {
    year--
    step(year)
    yearLayer.text(year)
  })
  d3.select("#adelante").on("click", () => {
    year++
    step(year)
    yearLayer.text(year)
  })

  step(year)
}

draw()
